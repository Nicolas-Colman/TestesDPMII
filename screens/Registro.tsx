import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { KeyboardAvoidingView, View, TextInput, TouchableOpacity, Text } from "react-native";
import estilo from '../estilo';
import { Usuario } from '../model/Usuario';

const Registro = () => {
    const [formUsuario, setFormUsuario] = 
        useState<Partial<Usuario>>({});

    const navigation = useNavigation();

    const refUsuario = firestore.collection("Usuario");

    const Registro = () => {
        auth
            .createUserWithEmailAndPassword(
                formUsuario.email,formUsuario.senha
            )
            .then( userCredentials => {
                const user = userCredentials.user;

                const refComIdUsuario = refUsuario.doc(auth.currentUser.uid);
                refComIdUsuario.set({
                    id: auth.currentUser.uid,
                    nome: formUsuario.nome,
                    email: formUsuario.email,
                    senha: formUsuario.senha,
                    datanasc: formUsuario.datanasc,
                    fone: formUsuario.fone
                })

                console.log('Registrado como ', user.email);
                navigation.replace("Menu");
            })
            .catch( error => alert(error.message) )
    }

    const irParaLogin = () => {
        navigation.replace("Login");
    }

    const Limpar = () => {
        setFormUsuario({})
    }


    return(
        <KeyboardAvoidingView style={estilo.tela}>
            <View style={estilo.inputArea}>
                <TextInput 
                    placeholder="Nome" 
                    value={formUsuario.nome}
                    onChangeText={texto => setFormUsuario({...formUsuario, nome: texto })}
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Email" 
                    value={formUsuario.email}
                    onChangeText={texto => setFormUsuario({...formUsuario, email: texto })}
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Senha" 
                    value={formUsuario.senha}
                    onChangeText={texto => setFormUsuario({...formUsuario, senha: texto })}
                    secureTextEntry
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Data Nascimento" 
                    value={formUsuario.datanasc}
                    onChangeText={texto => setFormUsuario({...formUsuario, datanasc: texto })}
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Fone" 
                    value={formUsuario.fone}
                    onChangeText={texto => setFormUsuario({...formUsuario, fone: texto })}
                    style={estilo.input}
                />
            </View>
            <View style={estilo.buttonArea}>
                <TouchableOpacity 
                    style={estilo.botao}
                    onPress={Registro}
                >
                    <Text style={estilo.botaoTexto}>Registrar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={estilo.botaoBranco}
                    onPress={Limpar}
                >
                    <Text style={estilo.botaoBrancoTexto}>Limpar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={estilo.botaoBranco}
                    onPress={irParaLogin}
                >
                    <Text style={estilo.botaoBrancoTexto}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )

}

export default Registro;


