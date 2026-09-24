import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Pedometer } from "expo-sensors";

export function PedometerSensor(){
    const [ pasos, setPasos ] = useState(0);
    const [ disponible, setDisponible] = useState(false);

    useEffect(
        () => {
            let subscribir;

            const iniciar = async () => {
                const disp = await Pedometer.isAvailableAsync();
                setDisponible(disp);

                if(disp){
                    subscribir = Pedometer.watchStepCount(
                        result => { setPasos(result.steps) }
                    );
                }
            };

            iniciar();

            return () => {
                if(subscribir){
                    subscribir.remove();
                }
            };

        }, []
    );

    return(
        <View style={[styles.container]}>
            <Text style={styles.titulo}>
                Podometro
            </Text>
            <View style={styles.card}>
                <Text style={styles.axis}>Disponible </Text>
                <Text style={styles.Value}>{disponible ? 'SI' : 'NO'}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Pasos </Text>
                <Text style={styles.Value}>{pasos}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.axis}>Pasos detectados</Text>
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