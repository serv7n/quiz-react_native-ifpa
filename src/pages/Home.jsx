import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from "react-native";
import { Eye, EyeOff, User, Play } from "lucide-react-native";
import Api from "../services/Api";
import Nav from '../components/Nav';
import Livro from '../components/Livro';

/* 🔍 Verifica sessão salva */
async function checkUserSession(navigation) {
    try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            navigation.reset({
                index: 0,
                routes: [{ name: "TurmasSelection" }],
            });
        }
    } catch (error) {
        console.error("Erro ao verificar sessão:", error);
    }
}

export default function Home({ navigation }) {
    const [user, setUser] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkUserSession(navigation);
    }, []);

    async function onClickBtn() {
        if (!user.trim() || !senha.trim()) {
            Alert.alert("Preencha todos os campos.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await Api.login(user, senha);

            if (response.status_code === 200 && response.messege === "success") {
                const aluno = response.data;

                await AsyncStorage.setItem('user', JSON.stringify(aluno));

                Alert.alert(`Bem-vindo, ${aluno.user}!`);
                navigation.navigate("TurmasSelection");
            } else {
                Alert.alert(response.message || "Usuário ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            Alert.alert("Erro ao fazer login. Verifique sua conexão.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

                <Livro texto='Cadastre-se e faça login' />

                <Nav />

                <View style={styles.welcome}>
                    <Text style={styles.welcomeEmoji}>🧠</Text>
                    <Text style={styles.welcomeTitle}>Bem-vindo ao Quiz!</Text>
                    <Text style={styles.welcomeSubtitle}>Teste seus conhecimentos e divirta-se</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>👤 Usuário</Text>
                        <View style={styles.inputWrapper}>
                            <User size={24} color="#555" style={{ marginRight: 8 }} />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu usuário"
                                value={user}
                                onChangeText={setUser}
                                autoCapitalize="none"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>🔒 Senha</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={24} color="#555" /> : <Eye size={24} color="#555" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && { backgroundColor: "#E5E7EB" }]}
                        onPress={onClickBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <Play size={24} color="#fff" />
                                <Text style={styles.buttonText}>  Iniciar Quiz</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={{ textAlign: "center", color: "#F4C20D", marginTop: 10 }}>
                            Ainda não tem conta? <Text style={{ fontWeight: "bold" }}>Cadastrar</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e6e6e6ff",
    },
    welcome: {
        alignItems: "center",
        marginVertical: 20,
    },
    welcomeEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: "#666",
    },
    form: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 300,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontWeight: "bold",
        color: "#333",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        paddingHorizontal: 10,
        backgroundColor: "#F3F4F6",
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        color: "#333",
    },
    button: {
        backgroundColor: "#F4C20D",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        elevation: 2,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
});
