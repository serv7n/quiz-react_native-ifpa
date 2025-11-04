import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
} from "react-native";
import Nav from "../components/Nav";

const questoes = {
    1: {
        title: "Qual o maior órgão do ser humano",
        alternativas: { 1: "Cérebro", 2: "Fígado", 3: "Pulmão", 4: "Pele" },
        correta: 4,
        timing: 10,
    },
    2: {
        title: "Quem foi o primeiro presidente do Brasil",
        alternativas: {
            1: "Getúlio Vargas",
            2: "Floriano Peixoto",
            3: "Deodoro da Fonseca",
            4: "Dom Pedro II",
        },
        correta: 3,
        timing: 10,
    },
    3: {
        title: "Qual planeta é conhecido como planeta vermelho",
        alternativas: { 1: "Marte", 2: "Vênus", 3: "Júpiter", 4: "Mercúrio" },
        correta: 1,
        timing: 10,
    },
};

export default function Questions() {
    const totalQuestoes = Object.keys(questoes).length;
    const [progresso, setProgresso] = useState({ step: 1, certas: 0, total: totalQuestoes });
    const [tempo, setTempo] = useState(questoes[1].timing);
    const [escolha, setEscolha] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [mostrandoFeedback, setMostrandoFeedback] = useState(false);
    const [finalizado, setFinalizado] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(0));
    const questaoAtual = questoes[progresso.step];

    // Temporizador
    useEffect(() => {
        if (!questaoAtual || mostrandoFeedback || finalizado) return;
        if (tempo > 0) {
            const timer = setTimeout(() => setTempo((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            mostrarResultado();
        }
    }, [tempo, mostrandoFeedback, questaoAtual, finalizado]);

    // Reset quando muda a questão
    useEffect(() => {
        if (questaoAtual) {
            setTempo(questaoAtual.timing);
            setEscolha(null);
            setFeedback(null);
        } else {
            setFinalizado(true);
        }
    }, [progresso.step]);

    function onClickButton(alternativa) {
        if (mostrandoFeedback) return;
        setEscolha(alternativa);
    }

    function mostrarResultado() {
        if (!questaoAtual) return;
        const acertou = parseInt(escolha) === questaoAtual.correta;
        setFeedback({
            tipo: acertou ? "correto" : "erro",
            texto: acertou ? "Resposta Correta! 🎉" : "Ops! Resposta incorreta 😔",
        });
        setMostrandoFeedback(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
        setTimeout(() => {
            setProgresso((prev) => ({
                step: prev.step + 1,
                certas: acertou ? prev.certas + 1 : prev.certas,
                total: prev.total,
            }));
            setMostrandoFeedback(false);
            setEscolha(null);
            setFeedback(null);
            scaleAnim.setValue(0);
        }, 2000);
    }

    if (finalizado) {
        const porcentagem = Math.round((progresso.certas / progresso.total) * 100);
        return (
            <View style={styles.containerCenter}>
                <View style={styles.finalizadoCard}>
                    <Text style={styles.finalizadoIcon}>🏆</Text>
                    <Text style={styles.title}>Quiz Finalizado!</Text>
                    <View style={styles.resultadoContainer}>
                        <Text style={styles.resultadoScore}>{progresso.certas}/{progresso.total}</Text>
                        <Text style={styles.resultadoPorcentagem}>{porcentagem}%</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        {porcentagem >= 70 ? "Excelente trabalho! 🌟" :
                            porcentagem >= 50 ? "Bom esforço! 👍" :
                                "Continue praticando! 💪"}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Nav />
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        Questão {progresso.step} de {progresso.total}
                    </Text>
                    <Text style={styles.scoreText}>
                        ✓ {progresso.certas} acertos
                    </Text>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((progresso.step - 1) / progresso.total) * 100}%` },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.questionCard}>
                <View style={styles.questionIconContainer}>
                    <Text style={styles.questionIcon}>❓</Text>
                </View>
                <Text style={styles.questionTitle}>{questaoAtual.title}</Text>
                <View style={styles.timerContainer}>
                    <Text style={[styles.timer, tempo <= 3 && styles.timerUrgent]}>
                        ⏱️ {tempo}s
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.alternativesContainer}>
                {Object.entries(questaoAtual.alternativas).map(([key, value]) => {
                    const isSelected = escolha === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.button,
                                isSelected && styles.buttonSelected,
                                mostrandoFeedback && styles.buttonDisabled,
                            ]}
                            onPress={() => onClickButton(key)}
                            disabled={mostrandoFeedback}
                            activeOpacity={0.7}
                        >
                            <View style={styles.buttonContent}>
                                <View style={[styles.buttonLetter, isSelected && styles.buttonLetterSelected]}>
                                    <Text style={[styles.buttonLetterText, isSelected && styles.buttonLetterTextSelected]}>
                                        {String.fromCharCode(64 + parseInt(key))}
                                    </Text>
                                </View>
                                <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                                    {value}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {feedback && (
                <View style={styles.feedbackModal}>
                    <Animated.View
                        style={[
                            styles.feedbackCard,
                            feedback.tipo === "correto" ? styles.correct : styles.incorrect,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <Text style={styles.feedbackIcon}>
                            {feedback.tipo === "correto" ? "🎉" : "😔"}
                        </Text>
                        <Text style={styles.feedbackText}>{feedback.texto}</Text>
                        {feedback.tipo === "erro" && (
                            <View style={styles.feedbackCorrectContainer}>
                                <Text style={styles.feedbackCorrectLabel}>Resposta correta:</Text>
                                <Text style={styles.feedbackCorrect}>
                                    {questaoAtual.alternativas[questaoAtual.correta]}
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F9FF",
        paddingTop: 0
    },
    containerCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0F9FF",
        padding: 20,
    },
    nav: {
        backgroundColor: "#0369A1",
        padding: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    navText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        letterSpacing: 1,
    },
    progressContainer: {
        padding: 20,
        paddingBottom: 12,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    progressText: {
        color: "#0369A1",
        fontSize: 16,
        fontWeight: "700",
    },
    scoreText: {
        color: "#059669",
        fontSize: 14,
        fontWeight: "600",
    },
    progressBar: {
        height: 12,
        backgroundColor: "#BAE6FD",
        borderRadius: 12,
        overflow: "hidden",
    },
    progressFill: {
        height: 12,
        backgroundColor: "#0EA5E9",
        borderRadius: 12,
    },
    questionCard: {
        backgroundColor: "#fff",
        margin: 20,
        marginBottom: 12,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#0369A1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: "#E0F2FE",
    },
    questionIconContainer: {
        backgroundColor: "#DBEAFE",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    questionIcon: {
        fontSize: 28,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
        color: "#0C4A6E",
        lineHeight: 26,
    },
    timerContainer: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#FCD34D",
    },
    timer: {
        fontSize: 18,
        color: "#92400E",
        fontWeight: "700",
    },
    timerUrgent: {
        color: "#DC2626",
    },
    alternativesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    button: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginVertical: 6,
        borderWidth: 2,
        borderColor: "#E0F2FE",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 70,
        justifyContent: "center",
    },
    buttonSelected: {
        backgroundColor: "#DBEAFE",
        borderColor: "#0EA5E9",
        borderWidth: 3,
        shadowColor: "#0EA5E9",
        shadowOpacity: 0.3,
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonLetter: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E0F2FE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    buttonLetterSelected: {
        backgroundColor: "#0EA5E9",
    },
    buttonLetterText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0369A1",
    },
    buttonLetterTextSelected: {
        color: "#fff",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0C4A6E",
        flex: 1,
    },
    buttonTextSelected: {
        color: "#0369A1",
        fontWeight: "700",
    },
    feedbackModal: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    feedbackCard: {
        padding: 32,
        borderRadius: 24,
        alignItems: "center",
        minWidth: 300,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    correct: {
        backgroundColor: "#D1FAE5",
        borderWidth: 4,
        borderColor: "#10B981"
    },
    incorrect: {
        backgroundColor: "#FEE2E2",
        borderWidth: 4,
        borderColor: "#EF4444"
    },
    feedbackIcon: {
        fontSize: 56,
        marginBottom: 16
    },
    feedbackText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1F2937",
    },
    feedbackCorrectContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: 12,
        width: "100%",
    },
    feedbackCorrectLabel: {
        fontSize: 14,
        color: "#7F1D1D",
        fontWeight: "600",
        marginBottom: 4,
    },
    feedbackCorrect: {
        fontSize: 16,
        color: "#991B1B",
        fontWeight: "700",
    },
    finalizadoCard: {
        backgroundColor: "#fff",
        padding: 40,
        borderRadius: 32,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 12,
        borderWidth: 2,
        borderColor: "#E0F2FE",
        width: "90%",
        maxWidth: 400,
    },
    finalizadoIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0C4A6E",
        marginBottom: 24,
        textAlign: "center",
    },
    resultadoContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 16,
        gap: 12,
    },
    resultadoScore: {
        fontSize: 48,
        fontWeight: "800",
        color: "#0369A1",
    },
    resultadoPorcentagem: {
        fontSize: 32,
        fontWeight: "700",
        color: "#059669",
    },
    subtitle: {
        fontSize: 18,
        color: "#475569",
        textAlign: "center",
        fontWeight: "600",
        marginTop: 8,
    },
});