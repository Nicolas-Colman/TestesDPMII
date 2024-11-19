import { StyleSheet } from "react-native";

export default StyleSheet.create({
    tela: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    inputArea: {
        width: '80%'
    },
    buttonArea: {
        width: '60%',
        marginTop: 40
    },
    input: {
        backgroundColor: 'white', 
        padding: 10,
        borderRadius: 10,
        marginTop: 20   
    },
    botao: {
        backgroundColor: "#0782F9",
        width: '100%',
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10
    },
    botaoTexto: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: "700"
    },
    botaoBranco :{
        backgroundColor: "#FFF",
        width: '100%',
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        borderColor: "#0782F9",
        borderWidth: 2
    },
    botaoBrancoTexto: {
        color: "#0782F9",
        fontSize: 15,
        fontWeight: "700"
    },

    // FLATLIST
    item : {
        backgroundColor: 'white',
        borderColor: '#0782F9',
        borderWidth: 2,
        borderRadius: 15,
        padding: 20,
        marginVertical: 8,
    },
    titulo: {
        fontSize: 16,
        color: '#0782F9',
        fontWeight: '500'
    },

    imagemCachorro: {
        width: 150,
        height: 150,
        borderRadius: 150/2,
    },
    imagemView:{
        alignContent: "center",
        alignItems: "center"
    }

});