import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { CheckCircle, XCircle, Trophy, Table } from "lucide-react-native";
import Nav from "../components/Nav";
import Api from "../services/Api";

export default function ResultadosPage() {
    const [loading, setLoading] = useState(true);
    const [totalCorretas, setTotalCorretas] = useState(0);
    const [totalQuestoes, setTotalQuestoes] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [respostasCertas, setRespostasCertas] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        carregarResultados();
    }, []);

    const carregarResultados = async () => {
        try {
            const [totalCorretasStr, totalQuestoesStr, respostasStr, certasStr] =
                await Promise.all([
                    AsyncStorage.getItem("totalCorretas"),
                    AsyncStorage.getItem("totalQuestoes"),
                    AsyncStorage.getItem("respostasQuiz"),
                    AsyncStorage.getItem("respostasCertas"),
                ]);

            setTotalCorretas(parseInt(totalCorretasStr) || 0);
            setTotalQuestoes(parseInt(totalQuestoesStr) || 0);
            setRespostas(respostasStr ? JSON.parse(respostasStr) : {});
            setRespostasCertas(certasStr ? JSON.parse(certasStr) : {});
        } catch (error) {
            console.error("Erro ao carregar resultados:", error);
        } finally {
            setLoading(false);
        }
    };

    const calcularPorcentagem = () => {
        if (totalQuestoes === 0) return 0;
        return Math.round((totalCorretas / totalQuestoes) * 100);
    };

    const obterMensagem = () => {
        const porcentagem = calcularPorcentagem();

        // Todas as mensagens agora usam #F4C20D
        return {
            text:
                porcentagem >= 90
                    ? "Excelente! 🎉"
                    : porcentagem >= 70
                        ? "Muito Bom! 👏"
                        : porcentagem >= 50
                            ? "Bom trabalho! 👍"
                            : "Continue praticando! 💪",
            color: "#F4C20D",
        };
    };

    const irParaTabela = async () => {
        try {
            const userStr = await AsyncStorage.getItem("user");
            if (!userStr) {
                Alert.alert("Erro", "Usuário não encontrado no armazenamento.");
                return;
            }

            const user = JSON.parse(userStr);
            const idAluno = user.id;

            const pontuacaoFinal = totalCorretas * 100;

            const resposta = await Api.atualizarPontuacao(idAluno, pontuacaoFinal);

            if (resposta.status_code === 200) {
                console.log("Pontuação salva:", resposta.data);
            } else {
                console.warn("Erro ao salvar pontuação:", resposta.messege);
            }

            await AsyncStorage.multiRemove([
                "respostasQuiz",
                "respostasCertas",
                "totalCorretas",
                "totalQuestoes",
            ]);

            navigation.reset({
                index: 0,
                routes: [{ name: "Ranking" }],
            });
        } catch (error) {
            console.error("Erro ao enviar pontuação:", error);
            Alert.alert("Erro", "Não foi possível enviar a pontuação ao servidor.");
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#F4C20D" />
            </View>
        );
    }

    const mensagem = obterMensagem();
    const porcentagem = calcularPorcentagem();

    return (
        <View style={styles.container}>
            <Nav />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.resultCard}>
                    <Trophy size={80} color="#F4C20D" style={{ alignSelf: "center" }} />

                    <Text style={styles.title}>Quiz Finalizado!</Text>

                    <Text style={[styles.message, { color: mensagem.color }]}>
                        {mensagem.text}
                    </Text>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>
                            {totalCorretas} / {totalQuestoes}
                        </Text>
                        <Text style={styles.scoreLabel}>Acertos</Text>
                    </View>

                    <View style={styles.percentageContainer}>
                        <View style={styles.percentageBar}>
                            <View
                                style={[
                                    styles.percentageFill,
                                    { width: `${porcentagem}%`, backgroundColor: mensagem.color },
                                ]}
                            />
                        </View>
                        <Text style={styles.percentageText}>{porcentagem}%</Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <CheckCircle size={24} color="#10B981" />
                            <Text style={styles.detailText}>Corretas: {totalCorretas}</Text>
                        </View>

                        <View style={styles.detailItem}>
                            <XCircle size={24} color="#EF4444" />
                            <Text style={styles.detailText}>
                                Erradas: {totalQuestoes - totalCorretas}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={irParaTabela}>
                    <Table size={24} color="#fff" />
                    <Text style={styles.buttonText}>  Ir para Tabela</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e9e9e9ff", // amarelo bem suave para não agredir visual
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF7D1",
    },

    resultCard: {
        backgroundColor: "#fff",
        padding: 30,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: "#F4C20D",
        marginTop: 20,
        marginBottom: 10,
    },

    message: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 30,
    },

    scoreContainer: {
        alignItems: "center",
        marginBottom: 20,
    },

    scoreText: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#F4C20D",
    },

    scoreLabel: {
        fontSize: 16,
        color: "#64748B",
        marginTop: 5,
    },

    percentageContainer: {
        marginBottom: 30,
    },

    percentageBar: {
        height: 20,
        backgroundColor: "#E5E7EB",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
    },

    percentageFill: {
        height: "100%",
        borderRadius: 10,
    },

    percentageText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#F4C20D",
    },

    detailsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },

    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    detailText: {
        fontSize: 16,
        color: "#475569",
        fontWeight: "500",
    },

    button: {
        backgroundColor: "#F4C20D",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
