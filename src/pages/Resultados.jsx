import { View, Text, Button, StyleSheet } from "react-native";

export default function Resultados({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Você acertou 3 de 5!</Text>
            <Button title="Voltar ao início" onPress={() => navigation.navigate("Home")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        marginBottom: 10,
    },
});
