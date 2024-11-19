import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase';
import { KeyboardAvoidingView, View, Image, TextInput, TouchableOpacity, Text, Pressable, Alert, FlatList } from "react-native";
import estilo from '../estilo';
import { Raca } from '../model/Raca';
import * as ImagePicker from "expo-image-picker";
import { uploadBytes } from "firebase/storage"; //Envia arq para o storage

const ManterRaca = () => {
    const [formRaca, setFormRaca] = 
        useState<Partial<Raca>>({});
    const [loading, setLoading] = useState(true);
    const [atualizar, setAtualizar] = useState(true);
    const [raca, setRaca] = useState<Raca[]>([]); // Array em branco
    

    const [imagePath, setImagePath] = useState('');

    const refRaca = firestore.collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Raca")

    const Salvar = async() => {
        const raca = new Raca(formRaca);

        if (raca.id === undefined){
            const refIdRaca = refRaca.doc();        
            raca.id = refIdRaca.id;

            refIdRaca.set(raca.toFirestore())
            .then(() => {
                alert("Raça adicionada com sucesso!");
                Limpar();
            })
            .catch( error => alert(error.message) )
        } else {
            const refIdRaca = refRaca.doc(raca.id);

            refIdRaca.update(raca.toFirestore())
            .then(() => {
                alert(raca.nome + " atualizado com sucesso!");
                Limpar();
            })
        }
        
    }

    const Limpar = () => {
        setFormRaca({})
        setImagePath('')
    }


    //CRIA FLATLIST
    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <TouchableOpacity 
            onPress={ () => editRaca(item) }
            onLongPress={ () => deleteRaca(item) }
        >
            <View style={estilo.item}>
                <Text style={estilo.titulo}>Nome: {item.nome}</Text>
            </View>
        </TouchableOpacity>
    )

    useEffect(() => {
        if (loading) {
            listarTodos();
        }        
    }, [raca]);

    const listarTodos = () => {
        const subscriber = refRaca
        .onSnapshot((querySnapshot) => {
            const raca= [];
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

    //EDITA E EXCLUI REGISTRO
    const editRaca = async (item) => {
        const resultado = firestore.collection('Usuario')
            .doc(auth.currentUser?.uid)
            .collection('Raca')
            .doc(item.id)
            .onSnapshot( documentSnapshot => {
                const raca = new Raca(documentSnapshot.data())
                setFormRaca(raca); 
                
                
            });
    }

    const deleteRaca = async (item) => {
        Alert.alert(
            "Excluir " + item.nome + "?",
            "Essa operação não pode ser desfeita!",
            [
                {
                    text: "Cancelar"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        const resultado = await refRaca
                            .doc(item.id)
                            .delete()
                            .then( () => {
                                setAtualizar(true);
                                alert(item.nome + " excluído!");
                                Limpar();
                            });
                    }
                }
            ]
        )
    }

    return (
        <KeyboardAvoidingView style={estilo.tela}>
            <View style={estilo.inputArea}>

                <TextInput 
                    placeholder="Nome" 
                    value={formRaca.nome}
                    onChangeText={texto => setFormRaca({...formRaca, nome: texto })}
                    style={estilo.input}
                />

            </View>

            <View style={estilo.buttonArea}>
                
                <TouchableOpacity 
                    style={estilo.botao}
                    onPress={Salvar}
                >
                    <Text style={estilo.botaoTexto}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={estilo.botaoBranco}
                    onPress={Limpar}
                >
                    <Text style={estilo.botaoBrancoTexto}>Limpar</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                data={raca}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshing={atualizar}
                onRefresh={ () => listarTodos() }
            />
        </KeyboardAvoidingView>
    )
    
}

export default ManterRaca;