import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Accelerometer } from "expo-sensors";

export function AccelerometerSensor(){
    const [ datos, setDatos ] = useState({
        x:0,
        y:0,
        z:0,
    });

    const [ colorfondo, setColorFondo ] = useState('#efefef')

    useEffect(
        () => {
            const subscribir = Accelerometer.addListener(
                measurements => {setDatos(measurements)}
            );

            Accelerometer.setUpdateInterval(100);

            return () => {
                subscribir.remove();
            }
        }, []
    );

    function cambiarColorFondo(){
        const colorAleatorio = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;

        setColorFondo(colorAleatorio);
    }

    useEffect(
        () => {
            if (datos.x < -1 || datos.y < -1 || datos.z < -1.5) {
                cambiarColorFondo()
            }
        }, [datos]
    );

    return(
        <View style={[styles.container, {backgroundColor: colorfondo}]}>
            <Text style={styles.titulo}>
                Acelerometro
            </Text>
            <View style={styles.card}>
                <Text style={styles.axis}>X</Text>
                <Text style={styles.Value}>{datos.x.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Y</Text>
                <Text style={styles.Value}>{datos.y.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Z</Text>
                <Text style={styles.Value}>{datos.z.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    titulo: {
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 35,
        color: '#3a4a5a',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    axis: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    Value: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});