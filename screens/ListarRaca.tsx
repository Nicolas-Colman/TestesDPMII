import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { FlatList, View, TextInput, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import estilo from '../estilo';
import { Raca } from '../model/Raca';
import { SafeAreaView } from "react-native-safe-area-context";

const ListarCachorro = () => {
    const [loading, setLoading] = useState(true);
    const [atualizar, setAtualizar] = useState(true);
    const [raca, setRaca] = useState<Raca[]>([]); // Array em branco

    const refRaca= firestore.collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Raca")

    useEffect(() => {
        if (loading) {
            listarTodos();
        }        
    }, [raca]);

    const listarTodos = () => {
        const subscriber = refRaca
        .onSnapshot((querySnapshot) => {
            const raca = [];
            querySnapshot.forEach((documentSnapshot) => {
                raca.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id
                });
            });
            setRaca(raca);
            setLoading(false);
            setAtualizar(false);
            console.log(raca);
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
        </View>
    )

    return (
        <SafeAreaView style={estilo.tela}>
            <FlatList 
                data={raca}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshing={atualizar}
                onRefresh={ () => listarTodos() }
            />
        </SafeAreaView>
    )



}
export default ListarCachorro;