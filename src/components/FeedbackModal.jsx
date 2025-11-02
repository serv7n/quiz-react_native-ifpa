import React from "react";
import { View, Text, StyleSheet, Modal, Platform } from "react-native";

export default function FeedbackModal({ feedback, correta, visible }) {
    if (!feedback) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => { }}
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.modalContainer,
                        feedback.tipo === "correto"
                            ? styles.correto
                            : styles.erro,
                    ]}
                >
                    <Text style={styles.emoji}>
                        {feedback.tipo === "correto" ? "🎉" : "😔"}
                    </Text>

                    <Text
                        style={[
                            styles.texto,
                            feedback.tipo === "correto"
                                ? styles.textoCorreto
                                : styles.textoErro,
                        ]}
                    >
                        {feedback.texto}
                    </Text>

                    {feedback.tipo === "erro" && (
                        <Text style={styles.resposta}>Resposta: {correta}</Text>
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
    },
    modalContainer: {
        width: "90%",
        maxWidth: 350,
        padding: 24,
        borderRadius: 20,
        alignItems: "center",
        // Sombras cross-platform
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
            },
        }),
    },
    correto: {
        backgroundColor: "#D1FAE5",
        borderWidth: 3,
        borderColor: "#10B981",
    },
    erro: {
        backgroundColor: "#FEE2E2",
        borderWidth: 3,
        borderColor: "#EF4444",
    },
    emoji: {
        fontSize: 64,
        marginBottom: 12,
        // animação simples
        transform: [{ scale: 1 }],
    },
    texto: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    textoCorreto: { color: "#047857" },
    textoErro: { color: "#B91C1C" },
    resposta: {
        marginTop: 8,
        fontSize: 16,
        color: "#374151",
    },
});
