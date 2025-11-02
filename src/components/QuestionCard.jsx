import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function QuestionCard({ title }) {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4, // sombra no Android
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0A1E5E", // azul-950
        textAlign: "center",
        lineHeight: 28,
    },
});
