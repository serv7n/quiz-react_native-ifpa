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
import Api from "../services/Api"; // ✅ conexão com a API
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
            // 🔹 Recupera o id do aluno salvo no AsyncStorage
            const aluno = await AsyncStorage.getItem("user");
            const dados = JSON.parse(aluno)
            if (!dados.id) {
                console.error("❌ ID do aluno não encontrado no armazenamento local.");
                setLoading(false);
                return;
            }

            // 🔹 Faz a requisição via POST
            const response = await Api.getRankingPorAluno(parseInt(dados.id));

            if (response.status_code === 200 && response.data) {
                setTurmaId(response.data.turma_id);
                setRanking(response.data.ranking || []);
            } else {
                console.error("Erro ao buscar ranking:", response.messege);
            }
        } catch (error) {
            console.error("Erro ao carregar ranking:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }) => {
        const colors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // ouro, prata, bronze
        const medalColor = colors[index] || "#60A5FA";

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
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Nav />
            <View style={styles.header}>
                <Trophy size={50} color="#FBBF24" />
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
        backgroundColor: "#DBEAFE",
    },
    header: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#1E3A8A",
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
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    rankContainer: {
        width: 40,
        alignItems: "center",
    },
    rankText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1E3A8A",
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#334155",
    },
    score: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2563EB",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#2563EB",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
        marginHorizontal: 60,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
