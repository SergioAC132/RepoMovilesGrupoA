import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AccelerometerSensor } from './componentes/AccelerometerSensor.jsx';
import { GyroscopeSensor } from './componentes/GyroscopeSensor.jsx';
import { MagnetometerSensor } from './componentes/MagnetometerSensor.jsx';
import { PedometerSensor } from './componentes/PedometerSensor.jsx';



export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <PedometerSensor/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
