import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function TimerBar({ tempo, total }) {
    const progress = useRef(new Animated.Value((tempo / total) * 100)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: (tempo / total) * 100,
            duration: 500, // velocidade da animação
            useNativeDriver: false,
        }).start();
    }, [tempo, total]);

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.text}>⏱️ Tempo: {tempo}s</Text>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progress.interpolate({
                                inputRange: [0, 100],
                                outputRange: ["0%", "100%"],
                            }),
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: "#FFF",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        overflow: "hidden",
    },
    innerContainer: {
        backgroundColor: "#0A1E5E", // azul-950
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    text: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 18,
        zIndex: 2,
    },
    progressBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 4,
        backgroundColor: "#60A5FA", // azul-400
    },
});
