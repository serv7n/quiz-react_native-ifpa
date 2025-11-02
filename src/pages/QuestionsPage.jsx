import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import Nav from "../components/Nav";
import QuestionHeader from "../components/QuestionHeader";
import TimerBar from "../components/TimerBar";
import QuestionCard from "../components/QuestionCard";
import AlternativesList from "../components/AlternativesList";
import FeedbackModal from "../components/FeedbackModal";

import { questionsData } from "../data/questionsData";

export default function QuestionsPage() {
    const navigation = useNavigation();

    // Fallback seguro
    const safeQuestionsData = questionsData || {};
    const totalQuestoes = Object.keys(safeQuestionsData).length;

    const [progresso, setProgresso] = useState({
        step: 1,
        certas: 0,
        total: totalQuestoes,
    });

    const questaoAtual = safeQuestionsData[progresso.step] || null;

    const [tempo, setTempo] = useState(questaoAtual?.timing || 10);
    const [escolha, setEscolha] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [mostrandoFeedback, setMostrandoFeedback] = useState(false);
    const [finalizado, setFinalizado] = useState(false);

    // Temporizador
    useEffect(() => {
        if (mostrandoFeedback || !questaoAtual) return;

        if (tempo > 0) {
            const timer = setTimeout(() => setTempo((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            mostrarResultado();
        }
    }, [tempo, mostrandoFeedback, questaoAtual]);

    // Reinicia o tempo ao mudar de questão
    useEffect(() => {
        if (questaoAtual) {
            setTempo(questaoAtual.timing || 10);
            setEscolha(null);
            setFeedback(null);
            setMostrandoFeedback(false);
        }
    }, [progresso.step, questaoAtual]);

    function onClickButton(alternativa) {
        if (!mostrandoFeedback && tempo > 0) setEscolha(alternativa);
    }

    function mostrarResultado() {
        if (mostrandoFeedback || !questaoAtual) return;

        setMostrandoFeedback(true);

        const corretaIndex = questaoAtual.correta;
        const acertou = escolha !== null && escolha == corretaIndex;

        setFeedback({
            tipo: acertou ? "correto" : "erro",
            texto: acertou ? "Resposta Correta! 🎉" : "Ops! Resposta incorreta 😔",
        });

        setTimeout(() => {
            setMostrandoFeedback(false);
            setEscolha(null);
            setFeedback(null);

            const novoProgresso = {
                step: progresso.step + 1,
                certas: acertou ? progresso.certas + 1 : progresso.certas,
                total: progresso.total,
            };

            setProgresso(novoProgresso);

            if (novoProgresso.step > totalQuestoes) {
                setFinalizado(true);
            }
        }, 1500);
    }

    // Final do quiz → salva resultado e navega
    useEffect(() => {
        if (finalizado) {
            const resultado = {
                certas: progresso.certas,
                erradas: progresso.total - progresso.certas,
                total: progresso.total,
            };

            AsyncStorage.setItem("resultadoQuiz", JSON.stringify(resultado)).then(() => {
                navigation.replace("Resultados");
            });
        }
    }, [finalizado]);

    if (!questaoAtual) {
        return (
            <View style={styles.container}>
                <Nav />
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>Nenhuma questão disponível.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Nav />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Cabeçalho */}
                <QuestionHeader
                    step={progresso.step}
                    total={progresso.total}
                    certas={progresso.certas}
                />

                {/* Timer */}
                <TimerBar tempo={tempo} total={questaoAtual.timing || 10} />

                {/* Pergunta */}
                <QuestionCard title={questaoAtual.title || "Sem título"} />

                {/* Alternativas */}
                <AlternativesList
                    alternativas={questaoAtual.alternativas || []}
                    escolha={escolha}
                    mostrandoFeedback={mostrandoFeedback}
                    onClick={onClickButton}
                />

                {/* Botão confirmar */}
                {escolha !== null && !mostrandoFeedback && (
                    <TouchableOpacity style={styles.button} onPress={mostrarResultado}>
                        <Text style={styles.buttonText}>✓ Confirmar Resposta</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Feedback */}
            <FeedbackModal
                feedback={feedback}
                correta={questaoAtual.alternativas?.[questaoAtual.correta]}
                visible={mostrandoFeedback}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DBEAFE",
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    button: {
        backgroundColor: "#22C55E",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: "#374151",
    },
});
