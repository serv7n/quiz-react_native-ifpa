import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeOff, User, UserPlus, Mail } from "lucide-react-native";
import Api from "../services/Api";
import Nav from "../components/Nav";

// 🔹 Verifica se o usuário já está logado
async function checkUserSession(navigation) {
    try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            console.log("Usuário já logado:", parsedUser);
            navigation.reset({
                index: 0,
                routes: [{ name: "TurmasSelection" }],
            });
        }
    } catch (error) {
        console.error("Erro ao verificar sessão:", error);
    }
}

export default function Register({ navigation }) {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 🔹 Verifica sessão ao entrar na tela
    useEffect(() => {
        checkUserSession(navigation);
    }, []);

    // 🔹 Função de registro corrigida
    async function onClickRegister() {
        if (!user.trim() || !email.trim() || !senha.trim() || !confirmar.trim()) {
            Alert.alert("Preencha todos os campos obrigatórios.");
            return;
        }

        if (senha !== confirmar) {
            Alert.alert("As senhas não coincidem.");
            return;
        }

        // Valida formato básico de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Digite um e-mail válido.");
            return;
        }

        setIsLoading(true);

        try {
            // Chamada à API Laravel
            const response = await Api.register({
                user,
                email,
                senha,
            });

            console.log("Resposta do servidor:", response);

            if (response.status_code === 200 || response.message === "success") {
                Alert.alert("Conta criada com sucesso!", "Agora você pode fazer login.", [
                    { text: "OK", onPress: () => navigation.navigate("Home") },
                ]);
            } else {
                const message = response.errors
                    ? Object.values(response.errors).flat().join("\n")
                    : response.message || "Erro ao criar conta. Tente novamente.";
                Alert.alert(message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            Alert.alert("Erro ao criar conta. Verifique sua conexão e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Nav />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.welcome}>
                    <Text style={styles.welcomeEmoji}>🧾</Text>
                    <Text style={styles.welcomeTitle}>Crie sua conta</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Participe do Quiz e teste seus conhecimentos!
                    </Text>
                </View>

                <View style={styles.form}>
                    {/* Usuário */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>👤 Usuário *</Text>
                        <View style={styles.inputWrapper}>
                            <User size={24} color="#1E3A8A" style={{ marginRight: 8 }} />
                            <TextInput
                                style={styles.input}
                                placeholder="Escolha um nome de usuário"
                                value={user}
                                onChangeText={setUser}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>✉️ Email *</Text>
                        <View style={styles.inputWrapper}>
                            <Mail size={24} color="#1E3A8A" style={{ marginRight: 8 }} />
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Senha */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>🔒 Senha *</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Digite sua senha"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirmar Senha */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>🔁 Confirmar Senha *</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Repita sua senha"
                                value={confirmar}
                                onChangeText={setConfirmar}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Botão */}
                    <TouchableOpacity
                        style={[styles.button, isLoading && { opacity: 0.6 }]}
                        onPress={onClickRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <UserPlus size={24} color="#000" />
                                <Text style={styles.buttonText}>  Criar Conta</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Link para Login */}
                    <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginTop: 10 }}>
                        <Text style={{ textAlign: "center", color: "#1E3A8A" }}>
                            Já tem uma conta? <Text style={{ fontWeight: "bold" }}>Entrar</Text>
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
        backgroundColor: "#e2e2e2ff",

    },

    welcome: {
        alignItems: "center",
        marginVertical: 20
    },

    welcomeEmoji: {
        fontSize: 60,
        marginBottom: 10
    },

    welcomeTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1E3A8A"
    },

    welcomeSubtitle: {
        fontSize: 16,
        color: "#1E40AF"
    },

    form: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 300
    },

    inputGroup: {
        marginBottom: 16
    },

    label: {
        marginBottom: 6,
        fontWeight: "bold",
        color: "#1E3A8A"
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#C4C4C4",
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: "#E5E7EB",
    },

    input: {
        flex: 1,
        paddingVertical: 10,
        color: "#1E3A8A"
    },

    button: {
        backgroundColor: "#FACC15",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 18
    },
});
