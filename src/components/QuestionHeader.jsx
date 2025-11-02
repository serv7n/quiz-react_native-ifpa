import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function QuestionHeader({ step, total, certas }) {
    const progresso = (step / total) * 100;

    return (
        <View style={styles.container}>
            {/* Cabeçalho com questão e acertos */}
            <View style={styles.topRow}>
                <View>
                    <Text style={styles.label}>Questão</Text>
                    <Text style={styles.value}>
                        {step}/{total}
                    </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.label}>Acertos</Text>
                    <Text style={styles.value}>{certas}</Text>
                </View>
            </View>

            {/* Barra de progresso */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progresso}%` }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0A1E5E", // azul-950
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        color: "#9DBAFE", // azul-200
        fontSize: 14,
    },
    value: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: "bold",
    },
    progressContainer: {
        backgroundColor: "#1E3A8A", // azul-800
        borderRadius: 9999,
        height: 8,
        overflow: "hidden",
    },
    progressBar: {
        backgroundColor: "#3B82F6", // azul-400
        height: "100%",
    },
});
