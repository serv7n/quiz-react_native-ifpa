import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Test() {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                // Busca os dados salvos após o login
                const jsonValue = await AsyncStorage.getItem("user");
                if (jsonValue != null) {
                    setDados(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.error("Erro ao carregar dados:", e);
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, []);

    if (carregando) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#1E3A8A" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }

    if (!dados) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>❌ Nenhum dado encontrado.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📋 Dados do Aluno</Text>

            <View style={styles.card}>
                <Text style={styles.label}>🆔 ID:</Text>
                <Text style={styles.value}>{dados.id}</Text>

                <Text style={styles.label}>👤 Usuário:</Text>
                <Text style={styles.value}>{dados.user}</Text>

                <Text style={styles.label}>🏆 Pontuação:</Text>
                <Text style={styles.value}>{dados.pontuacao}</Text>

                {dados.turma ? (
                    <>
                        <Text style={styles.label}>🏫 Turma:</Text>
                        <Text style={styles.value}>
                            {dados.turma.nome} (ID: {dados.turma.id})
                        </Text>
                    </>
                ) : (
                    <Text style={styles.value}>Sem turma vinculada.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0F2FE",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1E3A8A",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        width: "90%",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    label: {
        fontSize: 16,
        color: "#1E40AF",
        fontWeight: "600",
        marginTop: 10,
    },
    value: {
        fontSize: 18,
        color: "#1E3A8A",
        marginBottom: 4,
    },
    errorText: {
        fontSize: 18,
        color: "#DC2626",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#1E3A8A",
    },
});
