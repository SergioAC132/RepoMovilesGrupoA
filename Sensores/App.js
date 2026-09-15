import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AccelerometerSensor from './components/AccelerometerSensor.js';
import GyroscopeSensor from './components/GyroscopeSensor.js';
import MagnetometerSensor from './components/MagnetometerSensor.js';
import PedometerSensor from './components/PedometerSensor.js';

export default function App() {
  return (
    
      <PedometerSensor/>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
