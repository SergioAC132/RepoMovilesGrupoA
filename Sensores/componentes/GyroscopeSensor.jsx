import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Gyroscope } from "expo-sensors";

function clamp(valor, min, max) {
    return Math.min(Math.max(valor, min), max);
}

function aplicarDeadzone(valor, umbral) {
    return Math.abs(valor) < umbral ? 0 : valor;
}

const INTERVALO_MS = 100;
const DEADZONE = 0.02;      // ignora ruido del sensor al estar quieto
const ANGULO_MAX = 0.6;     // qué tanto se puede "inclinar la tabla" (acumulado)
const GRAVEDAD = 400;       // qué tan fuerte acelera la pelota según la inclinación
const FRICCION = 0.98;      // frena la velocidad poco a poco (más cerca de 1 = menos fricción)
const LIMITE = 100;         // paredes del área de juego (en px desde el centro)

export function GyroscopeSensor(){
    const [ datos, setDatos ] = useState({ x:0, y:0, z:0 });
    const [ posicionPelota, setPosicionPelota ] = useState({ x: 0, y: 0 });

    // Estos son el "estado físico real" de la simulación.
    // Van en refs porque se actualizan dentro del callback del listener
    // y no necesitamos que disparen un re-render por sí solos.
    const anguloRef = useRef({ x: 0, y: 0 });     // inclinación acumulada de la "tabla"
    const velocidadRef = useRef({ x: 0, y: 0 });  // velocidad actual de la pelota
    const posicionRef = useRef({ x: 0, y: 0 });   // posición actual de la pelota

    useEffect(
        () => {
            const subscribir = Gyroscope.addListener(
                measurements => {
                    setDatos(measurements);

                    const deltaTiempo = INTERVALO_MS / 1000;

                    // Nota: cruzamos los ejes a propósito.
                    // measurements.y (balanceo/roll, lado a lado) -> mueve en X (izq/der)
                    // measurements.x (cabeceo/pitch, adelante/atrás) -> mueve en Y (arriba/abajo)
                    const velGyroX = aplicarDeadzone(measurements.y, DEADZONE);
                    const velGyroY = aplicarDeadzone(measurements.x, DEADZONE);

                    // 1. Acumulamos el ángulo de inclinación de la "tabla"
                    anguloRef.current = {
                        x: clamp(anguloRef.current.x + velGyroX * deltaTiempo, -ANGULO_MAX, ANGULO_MAX),
                        y: clamp(anguloRef.current.y + velGyroY * deltaTiempo, -ANGULO_MAX, ANGULO_MAX),
                    };

                    // 2. El ángulo genera una aceleración (como la gravedad en un plano inclinado)
                    const accelX = anguloRef.current.x * GRAVEDAD;
                    const accelY = anguloRef.current.y * GRAVEDAD;

                    // 3. La aceleración cambia la velocidad, y la fricción la va frenando
                    velocidadRef.current = {
                        x: (velocidadRef.current.x + accelX * deltaTiempo) * FRICCION,
                        y: (velocidadRef.current.y + accelY * deltaTiempo) * FRICCION,
                    };

                    // 4. La velocidad cambia la posición
                    let nuevaX = posicionRef.current.x + velocidadRef.current.x * deltaTiempo;
                    let nuevaY = posicionRef.current.y + velocidadRef.current.y * deltaTiempo;

                    // 5. Si choca con la "pared" del área de juego, se detiene en vez de rebotar
                    if (nuevaX > LIMITE || nuevaX < -LIMITE) {
                        nuevaX = clamp(nuevaX, -LIMITE, LIMITE);
                        velocidadRef.current.x = 0;
                    }
                    if (nuevaY > LIMITE || nuevaY < -LIMITE) {
                        nuevaY = clamp(nuevaY, -LIMITE, LIMITE);
                        velocidadRef.current.y = 0;
                    }

                    posicionRef.current = { x: nuevaX, y: nuevaY };
                    setPosicionPelota({ x: nuevaX, y: nuevaY });
                }
            );

            Gyroscope.setUpdateInterval(INTERVALO_MS);

            return () => {
                subscribir.remove();
            }
        }, []
    );

    return(
        <View style={[styles.container]}>
            <Text style={styles.titulo}>
                Giroscopio
            </Text>

            <View style={styles.areaJuego}>
                <View
                    style={[
                        styles.pelota,
                        {
                            transform: [
                                { translateX: posicionPelota.x },
                                { translateY: posicionPelota.y },
                            ],
                        },
                    ]}
                />
            </View>

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
        backgroundColor: '#efefef',
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
    areaJuego: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 2,
        borderColor: '#3a4a5a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 35,
        backgroundColor: '#fff',
    },
    pelota: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e74c3c',
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