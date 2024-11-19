import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import { auth } from '../firebase';
import { KeyboardAvoidingView, View, TextInput, TouchableOpacity, Text } from "react-native";
import estilo from "../estilo";

const Home = () =>{
    const navigation = useNavigation();

    const Logout = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
            })    
    }

    return (
        <KeyboardAvoidingView style={estilo.tela}>
            <View style={estilo.inputArea}>
                <Text>Email: {auth.currentUser?.email} </Text>

                <TouchableOpacity 
                    style={estilo.botao}
                    onPress={Logout}
                >
                    <Text style={estilo.botaoTexto}>Sair</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Home;