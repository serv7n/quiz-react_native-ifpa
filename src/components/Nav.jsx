import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, Image } from "react-native";
import { LogOut, Menu, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Nav() {
    const [menuAberto, setMenuAberto] = useState(false);
    const navigation = useNavigation();

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
                            await AsyncStorage.removeItem("user");
                            setMenuAberto(false);
                            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
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

                {/* Imagem no lugar do texto */}
                <View style={styles.titleContainer}>
                    <Image
                        source={require("../../assets/nav.png")} // ajuste o caminho
                        style={styles.navImage}
                        resizeMode="contain"
                    />
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

const styles = StyleSheet.create({
    nav: {
        backgroundColor: "#246d38ff",
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
        alignItems: "center",
        justifyContent: "center",
    },
    navImage: {
        width: 120,
        height: 40,
    },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 280,
        height: "100%",
        backgroundColor: "#fff",
        elevation: 10,
    },
    sidebarHeader: {
        backgroundColor: "#34A853",
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
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#E6F4EA",
    },
    sidebarText: { fontSize: 16, fontWeight: "600", color: "#34A853" },
    sidebarFooter: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 16,
        backgroundColor: "#F9FAFB",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
    },
    footerText: { textAlign: "center", color: "#6B7280", fontSize: 13 },
});
