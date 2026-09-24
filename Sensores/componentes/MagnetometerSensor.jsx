import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import { Magnetometer } from "expo-sensors";

// Suaviza el valor nuevo mezclándolo con el anterior (reduce el temblor del sensor)
function suavizar(valorAnterior, valorNuevo, factor = 0.2) {
    return valorAnterior + factor * (valorNuevo - valorAnterior);
}

// Calcula el ángulo (heading) en grados, normalizado de 0 a 360
function calcularAngulo(x, y) {
    let angulo = Math.atan2(y, x) * (180 / Math.PI);
    angulo = angulo - 90; // ajusta para que 0° sea "arriba" del teléfono, no a la derecha
    if (angulo < 0) {
        angulo += 360;
    }
    return angulo;
}

export function MagnetometerSensor(){
    const [ datos, setDatos ] = useState({
        x:0,
        y:0,
        z:0,
    });

    const [ heading, setHeading ] = useState(0);

    // Guardamos los valores suavizados aquí para no depender del estado
    // dentro del callback del listener (evita closures obsoletos)
    const suavizadoRef = useRef({ x: 0, y: 0 });

    // Guarda el último ángulo "crudo" para saber si conviene girar
    // por el camino corto al animar (evita el salto feo de 359° a 0°)
    const ultimoAnguloRef = useRef(0);

    // Valor animado que controla la rotación real de la aguja
    const anguloAnimado = useRef(new Animated.Value(0)).current;

    useEffect(
        () => {
            const subscribir = Magnetometer.addListener(
                measurements => {
                    setDatos(measurements);

                    suavizadoRef.current = {
                        x: suavizar(suavizadoRef.current.x, measurements.x),
                        y: suavizar(suavizadoRef.current.y, measurements.y),
                    };

                    const anguloCrudo = calcularAngulo(
                        suavizadoRef.current.x,
                        suavizadoRef.current.y
                    );

                    // Ajuste para que la animación siempre gire por el camino
                    // más corto (ej. de 350° a 10°, que gire +20 y no -340)
                    let diferencia = anguloCrudo - ultimoAnguloRef.current;
                    if (diferencia > 180) diferencia -= 360;
                    if (diferencia < -180) diferencia += 360;

                    const anguloContinuo = ultimoAnguloRef.current + diferencia;
                    ultimoAnguloRef.current = anguloContinuo;

                    setHeading(Math.round(anguloCrudo));

                    Animated.timing(anguloAnimado, {
                        toValue: anguloContinuo,
                        duration: 400,
                        useNativeDriver: true,
                    }).start();
                }
            );

            Magnetometer.setUpdateInterval(100);

            return () => {
                subscribir.remove();
            }
        }, []
    );

    const rotacionInterpolada = anguloAnimado.interpolate({
        inputRange: [-360, 0, 360, 720],
        outputRange: ['360deg', '0deg', '-360deg', '-720deg'],
    });

    return(
        <View style={[styles.container]}>
            <Text style={styles.titulo}>
                Brújula
            </Text>

            <View style={styles.brujulaContenedor}>
                <Animated.View
                    style={[
                        styles.aguja,
                        { transform: [{ rotate: rotacionInterpolada }] },
                    ]}
                >
                    <View style={styles.puntaNorte} />
                    <View style={styles.puntaSur} />
                </Animated.View>
                <Text style={styles.letraNorte}>N</Text>
            </View>

            <Text style={styles.heading}>{heading}°</Text>

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
    brujulaContenedor: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#3a4a5a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    aguja: {
        width: 4,
        height: 160,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    puntaNorte: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 70,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#e74c3c',
    },
    puntaSur: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 70,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#3a4a5a',
    },
    letraNorte: {
        position: 'absolute',
        top: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3a4a5a',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3a4a5a',
        marginBottom: 25,
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