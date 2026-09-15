import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Gyroscope } from "expo-sensors";

const { width, height } = Dimensions.get("window");

const TAMANO_PELOTA = 50;

export default function GyroscopeSensor() {
    const [datos, setDatos] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const [pelota, setPelota] = useState({
        x: width / 2 - TAMANO_PELOTA / 2,
        y: height / 2 - TAMANO_PELOTA / 2,
    });

    const posicion = useRef({
        x: width / 2 - TAMANO_PELOTA / 2,
        y: height / 2 - TAMANO_PELOTA / 2,
    });

    useEffect(() => {
        Gyroscope.setUpdateInterval(50);

        const subscribir = Gyroscope.addListener((measurements) => {
            setDatos(measurements);

            const { x, y } = measurements;

            const sensibilidad = 15;

            let nuevoX = posicion.current.x + y * sensibilidad;
            let nuevoY = posicion.current.y + x * sensibilidad;

            // Límites de TODA la pantalla
            const limiteX = width - TAMANO_PELOTA;
            const limiteY = height - TAMANO_PELOTA;

            nuevoX = Math.max(0, Math.min(nuevoX, limiteX));
            nuevoY = Math.max(0, Math.min(nuevoY, limiteY));

            posicion.current = {
                x: nuevoX,
                y: nuevoY,
            };

            setPelota({
                x: nuevoX,
                y: nuevoY,
            });
        });

        return () => {
            subscribir.remove();
        };
    }, []);

    return (
        <View style={styles.container}>

            {/* Área de juego ocupa toda la pantalla */}
            <View style={styles.juego}>

                {/* Título */}
                <View style={styles.informacion}>
                    <Text style={styles.title}>
                        Giroscopio
                    </Text>

                    <Text style={styles.instruccion}>
                        Gira el celular para mover la pelota 🎮
                    </Text>
                </View>

                {/* Pelota */}
                <View
                    style={[
                        styles.pelota,
                        {
                            left: pelota.x,
                            top: pelota.y,
                        },
                    ]}
                />

                {/* Datos del giroscopio */}
                <View style={styles.datos}>

                    <View style={styles.card}>
                        <Text style={styles.axis}>X</Text>
                        <Text style={styles.value}>
                            {datos.x.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.axis}>Y</Text>
                        <Text style={styles.value}>
                            {datos.y.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.axis}>Z</Text>
                        <Text style={styles.value}>
                            {datos.z.toFixed(2)}
                        </Text>
                    </View>

                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#202b38",
    },

    juego: {
        flex: 1,
        backgroundColor: "#202b38",
        position: "relative",
        overflow: "hidden",
    },

    informacion: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
    },

    title: {
        fontSize: 35,
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },

    instruccion: {
        textAlign: "center",
        fontSize: 18,
        marginTop: 10,
        color: "#ddd",
    },

    pelota: {
        position: "absolute",
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ff4757",
        borderWidth: 3,
        borderColor: "#fff",
    },

    datos: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 10,
    },

    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        minWidth: 90,
    },

    axis: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#3a4a5a",
    },

    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111",
        marginTop: 3,
    },
});
