import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";

export default function Livro({ texto = "Olá!", onPress }) {
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -8,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: floatAnim }] }]}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.inner}>

                {/* Balão de fala */}
                <View style={styles.balao}>
                    <Text style={styles.texto}>{texto}</Text>
                </View>

                {/* Mascote */}
                <Image
                    source={require("../../assets/mascotes/livro.png")}
                    style={styles.mascote}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 600,
        right: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    // Agora alinha tudo dentro do botão também
    inner: {
        alignItems: "center",
    },

    balao: {
        backgroundColor: "#000",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginBottom: 5,
        maxWidth: 160,
    },

    texto: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
    },

    mascote: {
        width: 100,
        height: 100,
    },
});
