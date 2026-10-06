
import { Text, View } from 'react-native';
import CurrencyScreen from './src/screens/CurrencyScreen';
import IMCScreen from './src/screens/IMCScreen';
import TipScreen from './src/screens/TipScreen';
import HomeScreen from './src/screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName= 'Home'>
        <Stack.Screen name= 'Home' component={HomeScreen} options={{title: 'Menu principal'}}/>
        <Stack.Screen name= 'IMC' component={IMCScreen} options={{title: 'Calculadora IMC'}}/>
        <Stack.Screen name= 'divisas' component={CurrencyScreen} options={{title: 'Calculadora de divisas'}}/>
        <Stack.Screen name= 'tips' component={TipScreen} options={{title: 'Calculadora de propinas'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
