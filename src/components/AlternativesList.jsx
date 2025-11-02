import React from "react";
import { Modal, View, Text, StyleSheet, Animated } from "react-native";

export default function FeedbackModal({ feedback, correta, visible }) {
    if (!feedback) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.modal,
                        feedback.tipo === "correto" ? styles.correctBg : styles.errorBg,
                    ]}
                >
                    <Text style={styles.emoji}>
                        {feedback.tipo === "correto" ? "🎉" : "😔"}
                    </Text>
                    <Text
                        style={[
                            styles.title,
                            feedback.tipo === "correto" ? styles.correctText : styles.errorText,
                        ]}
                    >
                        {feedback.texto}
                    </Text>
                    {feedback.tipo === "erro" && (
                        <Text style={styles.answer}>Resposta: {correta}</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    modal: {
        width: "100%",
        maxWidth: 300,
        padding: 24,
        borderRadius: 24,
        borderWidth: 4,
        alignItems: "center",
    },
    correctBg: {
        backgroundColor: "#d1fae5", // verde claro
        borderColor: "#22c55e", // verde
    },
    errorBg: {
        backgroundColor: "#fee2e2", // vermelho claro
        borderColor: "#ef4444", // vermelho
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
        // Para animação você pode usar Animated API se quiser bounce
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    correctText: {
        color: "#065f46", // verde escuro
    },
    errorText: {
        color: "#991b1b", // vermelho escuro
    },
    answer: {
        color: "#374151",
        marginTop: 8,
        textAlign: "center",
    },
});
