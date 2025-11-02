import { View, Text, Button, StyleSheet } from "react-native";

export default function NotFound({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>😕</Text>
            <Text style={styles.title}>Página não encontrada</Text>
            <Text style={styles.subtitle}>
                Parece que você tentou acessar algo que não existe.
            </Text>

            <Button title="Voltar ao início" onPress={() => navigation.navigate("Home")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
});
