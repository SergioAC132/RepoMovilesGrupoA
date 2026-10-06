import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function AccelerometerSensor() {
    const [datos, setDatos] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const [color, setColor] = useState("#efefef");
    const [agitaciones, setAgitaciones] = useState(0);
    const [mensaje, setMensaje] = useState("Agita tu celular 📱");

    // Guarda el momento de la última agitada
    const ultimaAgitada = useRef(0);

    useEffect(() => {
        Accelerometer.setUpdateInterval(100);

        const subscribir = Accelerometer.addListener((measurements) => {
            setDatos(measurements);

            const { x, y, z } = measurements;

            // Calculamos la intensidad del movimiento
            const intensidad = Math.sqrt(
                x * x + y * y + z * z
            );

            // Umbral para detectar una agitada
            const UMBRAL = 2;

            const ahora = Date.now();

            // Evitamos detectar muchas veces la misma agitada
            if (
                intensidad > UMBRAL &&
                ahora - ultimaAgitada.current > 700
            ) {
                ultimaAgitada.current = ahora;

                // Generamos un color aleatorio
                const nuevoColor =
                    "#" +
                    Math.floor(Math.random() * 16777215)
                        .toString(16)
                        .padStart(6, "0");

                setColor(nuevoColor);

                setAgitaciones((anterior) => anterior + 1);

                setMensaje("¡Agitaste el celular! 🎉");
            }
        });

        return () => {
            subscribir.remove();
        };
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Text style={styles.title}>
                Acelerómetro
            </Text>

            <Text style={styles.mensaje}>
                {mensaje}
            </Text>

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

            <View style={styles.counter}>
                <Text style={styles.counterText}>
                    Agitaciones: {agitaciones} 🔥
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 25,
    },

    title: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        color: "#3a4a5a",
    },

    mensaje: {
        fontSize: 22,
        textAlign: "center",
        marginBottom: 30,
        fontWeight: "bold",
        color: "#3a4a5a",
    },

    card: {
        backgroundColor: "#fff",
        padding: 20,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 15,

        // Sombra
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },

    axis: {
        fontSize: 24,
        fontWeight: "bold",
    },

    value: {
        fontSize: 24,
        fontWeight: "bold",
    },

    counter: {
        marginTop: 10,
        backgroundColor: "#3a4a5a",
        padding: 18,
        borderRadius: 15,
    },

    counterText: {
        color: "#fff",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
});
