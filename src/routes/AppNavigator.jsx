import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../pages/Home";
import QuestionsPage from "../pages/QuestionsPage";
import Resultados from "../pages/Resultados";
import NotFound from "../pages/NotFound";
import Test from "../pages/Test";
import TurmasSelection from "../pages/TurmasSelection";
import Register from "../pages/Register";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false, // 👈 remove o cabeçalho de TODAS as telas
            }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Register" component={Register} /> 
                <Stack.Screen name="TurmasSelection" component={TurmasSelection} />
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="Questions" component={QuestionsPage} />
                <Stack.Screen name="Resultados" component={Resultados} />
                <Stack.Screen name="NotFound" component={NotFound} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
