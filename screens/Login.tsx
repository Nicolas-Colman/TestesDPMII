import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import { auth } from '../firebase';
import { KeyboardAvoidingView, View, TextInput, TouchableOpacity, Text } from "react-native";
import estilo from '../estilo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigation = useNavigation();

    const irParaRegistro = () => {
        navigation.replace("Registro");
    }

    const Login = () => {
        auth
            .signInWithEmailAndPassword(email,senha)
            .then( userCredentials => {
                const user = userCredentials.user;
                console.log('Logado como ', user.email);
                navigation.replace("Menu");
            })
            .catch( error => alert(error.message) )

    }

    return(
        <KeyboardAvoidingView style={estilo.tela}>
            <View style={estilo.inputArea}>
                <TextInput 
                    placeholder="Email" 
                    onChangeText={texto => setEmail(texto)}
                    style={estilo.input}
                />
                <TextInput 
                    placeholder="Senha" 
                    onChangeText={texto => setSenha(texto)}
                    secureTextEntry
                    style={estilo.input}
                />
            </View>
            <View style={estilo.buttonArea}>
                <TouchableOpacity 
                    style={estilo.botao}
                    onPress={Login}
                >
                    <Text style={estilo.botaoTexto}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={estilo.botaoBranco}
                    onPress={irParaRegistro}
                >
                    <Text style={estilo.botaoBrancoTexto}>Registrar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )

}

export default Login;


