import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { LogIn, LogOut, Menu, X } from "lucide-react-native";

export default function Nav() {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <>
            {/* Barra superior */}
            <View style={styles.nav}>
                {/* Botão Menu */}
                <TouchableOpacity
                    onPress={() => setMenuAberto(true)}
                    style={styles.menuButton}
                >
                    <Menu size={24} color="#fff" />
                </TouchableOpacity>

                {/* Título central */}
                <View style={styles.titleContainer}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>Q</Text>
                    </View>
                    <Text style={styles.title}>
                        Quiz<Text style={styles.titleHighlight}>App</Text>
                    </Text>
                </View>

                {/* Espaço lateral para equilibrar */}
                <View style={{ width: 40 }} />
            </View>

            {/* Menu lateral (Modal) */}
            <Modal
                visible={menuAberto}
                animationType="slide"
                transparent
                onRequestClose={() => setMenuAberto(false)}
            >
                {/* Overlay escuro */}
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setMenuAberto(false)}
                    activeOpacity={1}
                />

                {/* Sidebar */}
                <View style={styles.sidebar}>
                    {/* Header */}
                    <View style={styles.sidebarHeader}>
                        <Text style={styles.sidebarTitle}>Menu</Text>
                        <TouchableOpacity onPress={() => setMenuAberto(false)}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Conteúdo */}
                    <View style={styles.sidebarContent}>
                        <TouchableOpacity style={styles.sidebarButton}>
                            <LogIn size={20} color="#2563EB" />
                            <Text style={styles.sidebarText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.sidebarButton, { backgroundColor: "#FEE2E2" }]}>
                            <LogOut size={20} color="#DC2626" />
                            <Text style={[styles.sidebarText, { color: "#DC2626" }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
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
        backgroundColor: "#1E3A8A",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 6,
    },
    menuButton: {
        padding: 8,
    },
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
    logoText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    titleHighlight: {
        color: "#60A5FA",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
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
    sidebarTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    sidebarContent: {
        padding: 16,
        gap: 10,
    },
    sidebarButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#EFF6FF",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    sidebarText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2563EB",
    },
    sidebarFooter: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        backgroundColor: "#F9FAFB",
    },
    footerText: {
        textAlign: "center",
        color: "#6B7280",
        fontSize: 13,
    },
});
