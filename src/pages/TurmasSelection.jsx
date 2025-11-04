import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../services/Api";
import Nav from "../components/Nav";

export default function TurmasSelection({ navigation }) {
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [confirmado, setConfirmado] = useState(false);
    const [mostrandoFeedback, setMostrandoFeedback] = useState(false);

    // ✅ NOVA FUNÇÃO — verifica se o aluno já tem turma
    async function verificarTurmaAluno() {
        try {
            const userData = await AsyncStorage.getItem("user");

            if (!userData) {
                console.log("Nenhum usuário encontrado — permanecendo na tela.");
                return;
            }

            const aluno = JSON.parse(userData);

           
            if (aluno.turma_id) {
                console.log(`Usuário já tem turma (${aluno.turma_id}) — redirecionando...`);
                navigation.replace("Questions");
            } else {
                console.log("Usuário sem turma atribuída — permanece na tela.");
            }
        } catch (error) {
            console.error("Erro ao verificar turma do aluno:", error);
        }
    }

    // ✅ Executa verificação ao abrir a tela
    useEffect(() => {
        verificarTurmaAluno();
    }, []);

    // ✅ Busca turmas da API
    useEffect(() => {
        async function fetchTurmas() {
            try {
                const dados = await Api.turmas();
                const formatadas = dados.map((t) => ({
                    id: t.id,
                    nome: t.name,
                    professores: t.professores?.map((p) => p.user).join(", ") || "Sem professor",
                }));
                setTurmas(formatadas);
            } catch (err) {
                console.error("Erro ao carregar turmas:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTurmas();
    }, []);

    // ✅ Atualiza turma no backend e local
    const confirmarInscricao = async () => {
        if (!turmaSelecionada) {
            Alert.alert("Selecione uma turma primeiro!");
            return;
        }

        setMostrandoFeedback(true);

        try {
            const userData = await AsyncStorage.getItem("user");
            if (!userData) {
                Alert.alert("Erro: usuário não encontrado.");
                return;
            }

            const aluno = JSON.parse(userData);
            const response = await Api.updateTurma(aluno.id, turmaSelecionada);

            if (response.status_code === 200 || response.message === "success") {
                const turma = turmas.find((t) => t.id === turmaSelecionada);
                const alunoAtualizado = {
                    ...aluno,
                    turma_id: turmaSelecionada,
                    turma,
                };

                await AsyncStorage.setItem("user", JSON.stringify(alunoAtualizado));
                setConfirmado(true);
            } else {
                Alert.alert("Erro ao confirmar inscrição", response.message || "Tente novamente.");
            }
        } catch (err) {
            console.error("Erro ao confirmar inscrição:", err);
            Alert.alert("Erro ao confirmar inscrição. Verifique sua conexão.");
        } finally {
            setMostrandoFeedback(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1E3A8A" />
                <Text style={styles.loadingText}>Carregando turmas...</Text>
            </View>
        );
    }

    if (confirmado) {
        const turma = turmas.find((t) => t.id === turmaSelecionada);
        return (
            <View style={styles.container}>
                <Nav />
                <View style={styles.confirmContainer}>
                    <Text style={styles.successEmoji}>🎓</Text>
                    <Text style={styles.successTitle}>Inscrição Confirmada!</Text>
                    <Text style={styles.successSubtitle}>Bem-vindo à turma {turma?.nome}</Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.label}>Professor:</Text>
                        <Text style={styles.infoText}>{turma?.professores}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() => navigation.replace("Questions")}
                    >
                        <Text style={styles.confirmButtonText}>Ir para Questions</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Nav />
            <Text style={styles.header}>Selecione uma Turma ({turmas.length})</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {turmas.map((turma) => (
                    <TouchableOpacity
                        key={turma.id}
                        style={[
                            styles.turmaCard,
                            turmaSelecionada === turma.id && styles.turmaSelecionada,
                        ]}
                        onPress={() => setTurmaSelecionada(turma.id)}
                        disabled={mostrandoFeedback}
                    >
                        <Text style={styles.turmaNome}>{turma.nome}</Text>
                        <Text style={styles.turmaProf}>👨‍🏫 {turma.professores}</Text>
                    </TouchableOpacity>
                ))}

                {turmaSelecionada && (
                    <TouchableOpacity
                        style={styles.botaoConfirmar}
                        onPress={confirmarInscricao}
                        disabled={mostrandoFeedback}
                    >
                        <Text style={styles.textoBotao}>Confirmar Inscrição</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

// 🎨 Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DBEAFE",
        paddingBottom: 20,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginTop: 10,
        color: "#1E3A8A",
        fontWeight: "bold",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1E3A8A",
        textAlign: "center",
        marginVertical: 20,
    },
    scrollContainer: {
        paddingHorizontal: 16,
    },
    turmaCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },
    turmaSelecionada: {
        borderWidth: 2,
        borderColor: "#2563EB",
    },
    turmaNome: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1E3A8A",
    },
    turmaProf: {
        fontSize: 14,
        color: "#475569",
        marginTop: 4,
    },
    botaoConfirmar: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    textoBotao: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    confirmContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    successEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    successTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#1E3A8A",
    },
    successSubtitle: {
        color: "#1E40AF",
        marginBottom: 20,
    },
    infoBox: {
        backgroundColor: "#EFF6FF",
        padding: 16,
        borderRadius: 12,
        width: "80%",
        marginBottom: 30,
    },
    label: {
        fontWeight: "bold",
        color: "#1E3A8A",
    },
    infoText: {
        color: "#334155",
    },
    confirmButton: {
        backgroundColor: "#22C55E",
        paddingVertical: 14,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
