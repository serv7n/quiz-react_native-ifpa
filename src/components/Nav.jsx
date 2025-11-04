import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import { LogOut, Menu, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Nav() {
    const [menuAberto, setMenuAberto] = useState(false);
    const navigation = useNavigation(); // 🔹 garante que navigation funcione

    async function handleLogout() {
        Alert.alert(
            "Sair da conta",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sim, sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("user"); // remove usuário
                            setMenuAberto(false); // fecha menu
                            navigation.reset({ index: 0, routes: [{ name: "Home" }] }); // volta para Home
                        } catch (error) {
                            console.error("Erro ao fazer logout:", error);
                            Alert.alert("Erro ao sair. Tente novamente.");
                        }
                    },
                },
            ]
        );
    }

    return (
        <>
            {/* Barra superior */}
            <View style={styles.nav}>
                <TouchableOpacity onPress={() => setMenuAberto(true)} style={styles.menuButton}>
                    <Menu size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>Q</Text>
                    </View>
                    <Text style={styles.title}>
                        Quiz<Text style={styles.titleHighlight}>App</Text>
                    </Text>
                </View>

                <View style={{ width: 40 }} />
            </View>

            {/* Menu lateral */}
            <Modal visible={menuAberto} animationType="slide" transparent onRequestClose={() => setMenuAberto(false)}>
                <TouchableOpacity style={styles.overlay} onPress={() => setMenuAberto(false)} activeOpacity={1} />

                <View style={styles.sidebar}>
                    <View style={styles.sidebarHeader}>
                        <Text style={styles.sidebarTitle}>Menu</Text>
                        <TouchableOpacity onPress={() => setMenuAberto(false)}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sidebarContent}>
                        {/* Apenas botão Logout */}
                        <TouchableOpacity
                            style={[styles.sidebarButton, { backgroundColor: "#FEE2E2" }]}
                            onPress={handleLogout}
                        >
                            <LogOut size={20} color="#DC2626" />
                            <Text style={[styles.sidebarText, { color: "#DC2626" }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sidebarFooter}>
                        <Text style={styles.footerText}>QuizApp © 2025</Text>
                    </View>
                </View>
            </Modal>
        </>
    );
}

// estilos permanecem iguais
const styles = StyleSheet.create({
    nav: {
        backgroundColor: "#1E3A8A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 6,
        marginTop: 35,
    },
    menuButton: { padding: 8 },
    titleContainer: {
        position: "absolute",
        left: "50%",
        transform: [{ translateX: -60 }],
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    logoBox: {
        backgroundColor: "#3B82F6",
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },
    logoText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
    title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    titleHighlight: { color: "#60A5FA" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 280,
        height: "100%",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    sidebarHeader: {
        backgroundColor: "#1E3A8A",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    sidebarTitle: { color: "#fff", fontWeight: "bold", fontSize: 18 },
    sidebarContent: { padding: 16, gap: 10 },
    sidebarButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#EFF6FF",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    sidebarText: { fontSize: 16, fontWeight: "600", color: "#2563EB" },
    sidebarFooter: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        backgroundColor: "#F9FAFB",
    },
    footerText: { textAlign: "center", color: "#6B7280", fontSize: 13 },
});
