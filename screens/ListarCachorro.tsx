import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { FlatList, View, TextInput, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import estilo from '../estilo';
import { Cachorro } from '../model/Cachorro';
import { SafeAreaView } from "react-native-safe-area-context";

const ListarCachorro = () => {
    const [loading, setLoading] = useState(true);
    const [atualizar, setAtualizar] = useState(true);
    const [cachorro, setCachorro] = useState<Cachorro[]>([]); // Array em branco

    const refCachorro = firestore.collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Cachorro")

    useEffect(() => {
        if (loading) {
            listarTodos();
        }        
    }, [cachorro]);

    const listarTodos = () => {
        const subscriber = refCachorro
        .onSnapshot((querySnapshot) => {
            const cachorro = [];
            querySnapshot.forEach((documentSnapshot) => {
                cachorro.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id
                });
            });
            setCachorro(cachorro);
            setLoading(false);
            setAtualizar(false);
            console.log(cachorro);
        });
        return () => subscriber();
    }

    if (loading){
        return <ActivityIndicator 
                    size="60" 
                    color="#0782F9"
                    style={estilo.tela}
                />
    }


    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <View style={estilo.item}>
            <Text style={estilo.titulo}>Nome: {item.nome}</Text>
            <Text style={estilo.titulo}>Raça: {item.raca}</Text>
            <Text style={estilo.titulo}>Sexo: {item.sexo}</Text>
            <Text style={estilo.titulo}>Nasc: {item.datanasc}</Text>
        </View>
    )

    return (
        <SafeAreaView style={estilo.tela}>
            <FlatList 
                data={cachorro}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshing={atualizar}
                onRefresh={ () => listarTodos() }
            />
        </SafeAreaView>
    )



}
export default ListarCachorro;