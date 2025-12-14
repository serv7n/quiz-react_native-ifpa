import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Trophy, Medal, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../services/Api";
import Nav from "../components/Nav";

export default function RankingPage() {
    const [loading, setLoading] = useState(true);
    const [ranking, setRanking] = useState([]);
    const [turmaId, setTurmaId] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        carregarRanking();
    }, []);

    const carregarRanking = async () => {
        try {
            const aluno = await AsyncStorage.getItem("user");
            const dados = JSON.parse(aluno);

            if (!dados.id) {
                console.error("ID do aluno não encontrado.");
                setLoading(false);
                return;
            }

            const response = await Api.getRankingPorAluno(parseInt(dados.id));

            if (response.status_code === 200 && response.data) {
                setTurmaId(response.data.turma_id);
                setRanking(response.data.ranking || []);
            } else {
                console.error("Erro:", response.messege);
            }
        } catch (error) {
            console.error("Erro ao carregar ranking:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }) => {
        const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
        const medalColor = colors[index] || "#F4C20D";

        return (
            <View style={styles.card}>
                <View style={styles.rankContainer}>
                    {index < 3 ? (
                        <Medal size={28} color={medalColor} />
                    ) : (
                        <Text style={styles.rankText}>{index + 1}</Text>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.user}</Text>
                </View>

                <Text style={styles.score}>{item.pontuacao ?? 0} pts</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#F4C20D" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Nav />

            <View style={styles.header}>
                <Trophy size={48} color="#F4C20D" />
                <Text style={styles.title}>Ranking da Turma {turmaId ?? ""}</Text>
            </View>

            <FlatList
                data={ranking}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Resultados")}
            >
                <ArrowLeft size={22} color="#fff" />
                <Text style={styles.buttonText}>  Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e6e6e6ff", // igual Home
    },

    header: {
        alignItems: "center",
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },

    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    card: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },

    rankContainer: {
        width: 40,
        alignItems: "center",
    },
    rankText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },

    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },

    score: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#F4C20D", // mesma paleta do Home
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    button: {
        backgroundColor: "#F4C20D",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
        marginHorizontal: 60,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
