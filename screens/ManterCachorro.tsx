import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase';
import { KeyboardAvoidingView, View, Image, TextInput, TouchableOpacity, Text, Pressable, Alert, FlatList } from "react-native";
import estilo from '../estilo';
import { Cachorro } from '../model/Cachorro';
import * as ImagePicker from "expo-image-picker";
import { uploadBytes } from "firebase/storage"; //Envia arq para o storage

const ManterCachorro = () => {
    const [formCachorro, setFormCachorro] = 
        useState<Partial<Cachorro>>({});
    const [loading, setLoading] = useState(true);
    const [atualizar, setAtualizar] = useState(true);
    const [cachorro, setCachorro] = useState<Cachorro[]>([]); // Array em branco
    

    const [imagePath, setImagePath] = useState('');

    const refCachorro = firestore.collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Cachorro")

    const Salvar = async() => {
        const cachorro = new Cachorro(formCachorro);

        if (cachorro.id === undefined){
            const refIdCachorro = refCachorro.doc();        
            cachorro.id = refIdCachorro.id;

            refIdCachorro.set(cachorro.toFirestore())
            .then(() => {
                alert("Cachorro adicionado com sucesso!");
                Limpar();
            })
            .catch( error => alert(error.message) )
        } else {
            const refIdCachorro = refCachorro.doc(cachorro.id);

            refIdCachorro.update(cachorro.toFirestore())
            .then(() => {
                alert(cachorro.nome + " atualizado com sucesso!");
                Limpar();
            })
        }
        
    }

    const Limpar = () => {
        setFormCachorro({})
        setImagePath('')
    }

    // FUNÇÕES FOTO
    const escolheFoto = () => {
        Alert.alert(
            "Selecionar Foto",
            "Escolha uma alternativa",
            [
                {
                    text: "Câmera",
                    onPress: () => abrirCamera()
                },
                {
                    text: "Abrir Galeria",
                    onPress: () => abrirGaleria()
                }
            ]
        );
    }

    const abrirCamera = async () => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (permissao.granted === false) {
            alert("Você recusou a permissão de acesso à câmera.")
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        //console.log(result.assets[0]);
        enviarImagem(result);
    }

    const abrirGaleria = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissao.granted === false) {
            alert("Você recusou a permissão de acesso à galeria.")
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        enviarImagem(result);
    }

    const enviarImagem = async (result) => {
        if (!result.canceled){
            setImagePath(result.assets[0].uri);
            let filename = result.assets[0].fileName;
            const ref = storage.ref(`imagens/${filename}`);

            const img = await fetch(result.assets[0].uri);
            const bytes = await img.blob();
            const fbResult = await uploadBytes(ref, bytes);

            const urlDownload = await storage.ref(
                fbResult.metadata.fullPath).getDownloadURL()

            setFormCachorro({... formCachorro, urlfoto: urlDownload});

        } else {
            alert("Envio cancelado!");
        }
    }

    //CRIA FLATLIST
    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <TouchableOpacity 
            onPress={ () => editCachorro(item) }
            onLongPress={ () => deleteCachorro(item) }
        >
            <View style={estilo.item}>
                <Text style={estilo.titulo}>Nome: {item.nome}</Text>
                <Text style={estilo.titulo}>Raça: {item.raca}</Text>
                <Text style={estilo.titulo}>Sexo: {item.sexo}</Text>
                <Text style={estilo.titulo}>Nasc: {item.datanasc}</Text>
            </View>
        </TouchableOpacity>
    )

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

    //EDITA E EXCLUI REGISTRO
    const editCachorro = async (item) => {
        const resultado = firestore.collection('Usuario')
            .doc(auth.currentUser?.uid)
            .collection('Cachorro')
            .doc(item.id)
            .onSnapshot( documentSnapshot => {
                const cachorro = new Cachorro(documentSnapshot.data())
                setFormCachorro(cachorro); 
                
                if (cachorro.urlfoto > ''){                    
                    setImagePath(cachorro.urlfoto);
                } else {
                    setImagePath('');
                }
                
            });
    }

    const deleteCachorro = async (item) => {
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
                        const resultado = await refCachorro
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

                <Pressable onPress={() => escolheFoto() }>
                    <View style={estilo.imagemView}>
                        {
                            imagePath !== "" && (
                                <Image source={{ uri: imagePath }} style={estilo.imagemCachorro} />
                            )
                        }
                        {
                            imagePath === "" && (
                                <Image source={require("../assets/camera.png")} style={estilo.imagemCachorro} />
                            )
                        }                        
                    </View>
                </Pressable>

                <TextInput 
                    placeholder="Nome" 
                    value={formCachorro.nome}
                    onChangeText={texto => setFormCachorro({...formCachorro, nome: texto })}
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Sexo" 
                    value={formCachorro.sexo}
                    onChangeText={texto => setFormCachorro({...formCachorro, sexo: texto })}
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Raca" 
                    value={formCachorro.raca}
                    onChangeText={texto => setFormCachorro({...formCachorro, raca: texto })}
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Data Nascimento" 
                    value={formCachorro.datanasc}
                    onChangeText={texto => setFormCachorro({...formCachorro, datanasc: texto })}
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
                data={cachorro}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshing={atualizar}
                onRefresh={ () => listarTodos() }
            />
        </KeyboardAvoidingView>
    )
    
}

export default ManterCachorro;