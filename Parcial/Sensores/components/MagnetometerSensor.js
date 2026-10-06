import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Magnetometer } from "expo-sensors";

export default function MagnetometerSensor() {
    const [datos, setDatos] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const [direccion, setDireccion] = useState(0);

    useEffect(() => {
        const subscribir = Magnetometer.addListener((measurements) => {
            setDatos(measurements);

            // Calculamos el ángulo
            let angle = Math.atan2(measurements.y, measurements.x);

            // Convertimos radianes a grados
            let grados = angle * (180 / Math.PI);

            // Ajustamos para tener valores entre 0 y 360
            grados = grados + 90;

            if (grados < 0) {
                grados += 360;
            }

            if (grados >= 360) {
                grados -= 360;
            }

            setDireccion(grados);
        });

        Magnetometer.setUpdateInterval(100);

        return () => {
            subscribir.remove();
        };
    }, []);

    const obtenerDireccion = (grados) => {
        if (grados >= 337.5 || grados < 22.5) return "N";
        if (grados >= 22.5 && grados < 67.5) return "NE";
        if (grados >= 67.5 && grados < 112.5) return "E";
        if (grados >= 112.5 && grados < 157.5) return "SE";
        if (grados >= 157.5 && grados < 202.5) return "S";
        if (grados >= 202.5 && grados < 247.5) return "SO";
        if (grados >= 247.5 && grados < 292.5) return "O";
        return "NO";
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Brújula Digital
            </Text>

            <View style={styles.compassContainer}>

                <View style={styles.compass}>

                    <Text style={[styles.direction, styles.norte]}>
                        N
                    </Text>

                    <Text style={[styles.direction, styles.este]}>
                        E
                    </Text>

                    <Text style={[styles.direction, styles.sur]}>
                        S
                    </Text>

                    <Text style={[styles.direction, styles.oeste]}>
                        O
                    </Text>

                    <Text style={styles.arrow}>
                        ▲
                    </Text>

                </View>

            </View>

            <Text style={styles.grados}>
                {direccion.toFixed(0)}°
            </Text>

            <Text style={styles.card}>
                Dirección: {obtenerDireccion(direccion)}
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

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 25,
        backgroundColor: "#efefef",
    },

    title: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 25,
        color: "#3a4a5a",
    },

    compassContainer: {
        alignItems: "center",
        marginBottom: 20,
    },

    compass: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 5,
        borderColor: "#3a4a5a",
        backgroundColor: "#fff",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },

    direction: {
        position: "absolute",
        fontSize: 25,
        fontWeight: "bold",
        color: "#3a4a5a",
    },

    norte: {
        top: 15,
    },

    este: {
        right: 15,
    },

    sur: {
        bottom: 15,
    },

    oeste: {
        left: 15,
    },

    arrow: {
        fontSize: 55,
        color: "red",
    },

    grados: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        color: "#3a4a5a",
        marginBottom: 5,
    },

    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 20,
    },

    axis: {
        fontSize: 20,
        fontWeight: "bold",
    },

    value: {
        fontSize: 20,
        fontWeight: "bold",
    },
});