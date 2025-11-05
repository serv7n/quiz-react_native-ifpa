import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import Api from "../services/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Nav from "../components/Nav";

export default function QuestionsPage() {
    const [questoes, setQuestoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [tempoRestante, setTempoRestante] = useState(0);
    const [respostas, setRespostas] = useState({});
    const [respostasCertas, setRespostasCertas] = useState({});
    const [comecou, setComecou] = useState(false);
    const timerRef = useRef(null);
    const pollingRef = useRef(null);
    const navigation = useNavigation();

    // 🔹 Usar refs para manter valores atualizados entre renderizações
    const respostasRef = useRef({});
    const respostasCertasRef = useRef({});

    // 🔹 Busca as questões periodicamente até o quiz começar
    useEffect(() => {
        let ativo = true;

        const carregarQuestoes = async () => {
            try {
                const response = await Api.questoesUsuario(1); // id do aluno (ajuste se necessário)
                if (response.messege === "success") {
                    const questoesData = Array.isArray(response.data)
                        ? response.data
                        : response.data.questoes || [];

                    setQuestoes(questoesData);

                    if (questoesData.length > 0) {
                        setComecou(true);
                        setTempoRestante(questoesData[0]?.timing || 0);
                        clearInterval(pollingRef.current);

                        console.log("📋 Total de questões:", questoesData.length);
                        console.log("✅ Primeira questão:", questoesData[0]);
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar questões:", err);
            } finally {
                if (ativo) setLoading(false);
            }
        };

        carregarQuestoes();
        pollingRef.current = setInterval(carregarQuestoes, 1500);

        return () => {
            ativo = false;
            clearInterval(pollingRef.current);
        };
    }, []);

    // 🔹 Controla o cronômetro do quiz
    useEffect(() => {
        if (!comecou || questoes.length === 0) return;

        if (tempoRestante <= 0) {
            if (indiceAtual < questoes.length - 1) {
                proximaQuestao();
            } else {
                finalizarQuiz();
            }
            return;
        }

        timerRef.current = setTimeout(() => {
            setTempoRestante((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timerRef.current);
    }, [tempoRestante, comecou]);

    const proximaQuestao = () => {
        const proximoIndice = indiceAtual + 1;
        if (proximoIndice < questoes.length) {
            setIndiceAtual(proximoIndice);
            setTempoRestante(questoes[proximoIndice].timing);
        } else {
            finalizarQuiz();
        }
    };

    const selecionarResposta = (alternativa) => {
        const questaoAtual = questoes[indiceAtual];
        const idQuestao = questaoAtual.id;

        console.log("🔍 DEBUG - Questão:", questaoAtual.title);
        console.log("🔍 Alternativa selecionada:", alternativa);
        console.log("🔍 Resposta correta da API:", questaoAtual.altCorreta ?? questaoAtual.certa);
        console.log("🔍 Tipo da resposta correta:", typeof (questaoAtual.altCorreta ?? questaoAtual.certa));

        // 🔹 Atualiza os objetos de respostas
        const novasRespostas = {
            ...respostasRef.current,
            [idQuestao]: alternativa,
        };
        const novasRespostasCertas = { ...respostasCertasRef.current };

        // ✅ Normaliza e compara resposta
        const respostaCorretaNormalizada = String(
            questaoAtual.altCorreta ?? questaoAtual.certa
        ).toLowerCase().trim();

        const alternativaNormalizada = String(alternativa).toLowerCase().trim();

        console.log("🔍 Comparando:", alternativaNormalizada, "===", respostaCorretaNormalizada);

        if (alternativaNormalizada === respostaCorretaNormalizada) {
            novasRespostasCertas[idQuestao] = true;
            console.log("✅ RESPOSTA CORRETA!");
        } else {
            console.log("❌ RESPOSTA ERRADA");
        }

        respostasRef.current = novasRespostas;
        respostasCertasRef.current = novasRespostasCertas;

        setRespostas(novasRespostas);
        setRespostasCertas(novasRespostasCertas);

        console.log("📊 Respostas certas até agora:", Object.keys(novasRespostasCertas).length);

        if (indiceAtual === questoes.length - 1) {
            finalizarQuiz(novasRespostas, novasRespostasCertas);
        } else {
            proximaQuestao();
        }
    };

    const finalizarQuiz = async (
        respostasFinais = respostasRef.current,
        certasFinais = respostasCertasRef.current
    ) => {
        clearTimeout(timerRef.current);

        const totalCorretas = Object.keys(certasFinais).length;
        const totalQuestoes = questoes.length;

        console.log("📊 ===== FINALIZAÇÃO DO QUIZ =====");
        console.log("📊 Respostas finais:", respostasFinais);
        console.log("📊 Respostas certas finais:", certasFinais);
        console.log("📊 Total de acertos:", totalCorretas, "de", totalQuestoes);

        try {
            await AsyncStorage.setItem("respostasQuiz", JSON.stringify(respostasFinais));
            await AsyncStorage.setItem("respostasCertas", JSON.stringify(certasFinais));
            await AsyncStorage.setItem("totalCorretas", totalCorretas.toString());
            await AsyncStorage.setItem("totalQuestoes", totalQuestoes.toString());

            navigation.navigate("Resultados");
        } catch (error) {
            console.error("Erro ao salvar respostas:", error);
            Alert.alert("Erro", "Não foi possível salvar suas respostas.");
        }
    };

    // 🔹 Estados visuais
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    if (!comecou) {
        return (
            <View style={styles.centered}>
                <Nav />
                <Text style={styles.waitText}>⏳ Aguardando o início do quiz...</Text>
            </View>
        );
    }

    const questao = questoes[indiceAtual];

    return (
        <View style={styles.container}>
            <Nav />

            <View style={styles.quizCard}>
                <Text style={styles.timer}>⏱️ Tempo: {tempoRestante}s</Text>

                <Text style={styles.title}>
                    {indiceAtual + 1}. {questao.title}
                </Text>

                {["alt1", "alt2", "alt3", "alt4"].map((alt) => (
                    <TouchableOpacity
                        key={alt}
                        style={styles.option}
                        onPress={() => selecionarResposta(alt)}
                    >
                        <Text style={styles.optionText}>{questao[alt]}</Text>
                    </TouchableOpacity>
                ))}

                <Text style={styles.footer}>
                    Questão {indiceAtual + 1} de {questoes.length}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#DBEAFE" },

    quizCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginVertical: 30,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1E3A8A",
    },

    option: {
        backgroundColor: "#E0E7FF",
        padding: 14,
        marginVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#C7D2FE",
    },

    optionText: {
        fontSize: 16,
        color: "#1E40AF",
    },

    timer: {
        fontSize: 18,
        color: "#DC2626",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },

    footer: {
        textAlign: "center",
        marginTop: 20,
        color: "#475569",
        fontWeight: "500",
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DBEAFE",
    },

    waitText: {
        fontSize: 18,
        color: "#1E3A8A",
        marginTop: 10,
        textAlign: "center",
        fontWeight: "500",
    },
});
