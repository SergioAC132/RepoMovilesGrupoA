import React, { useEffect, useRef, useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DiceGame from './components/DiceGame.jsx';
import MemoryGame from './components/MemoryGame.jsx';
import TicTacToe from './components/TicTacToe.jsx';
import ShoppingList from './components/ShoppingList.jsx';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


// ================================================
// SPLASH SCREEN
// ================================================

function SplashScreen() {

  const scale = useRef(
    new Animated.Value(0)
  ).current;

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const position = useRef(
    new Animated.Value(-200)
  ).current;


  useEffect(() => {

    Animated.parallel([

      Animated.timing(scale, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),

      Animated.timing(position, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),

    ]).start();

  }, []);


  return (
    <View style={styles.splash}>

      <Animated.Text
        style={[
          styles.logo,
          {
            opacity,
            transform: [
              { scale },
              { translateY: position },
            ],
          },
        ]}
      >
        🚀 Cohete
      </Animated.Text>


      <Animated.Text
        style={[
          styles.title,
          {
            opacity,
          },
        ]}
      >
        Mi aplicación
      </Animated.Text>


      <Animated.Text style={{ opacity }}>
        Cargando...
      </Animated.Text>

    </View>
  );
}


// ================================================
// HOME SCREEN
// ================================================

function HomeScreen({ navigation }) {

  return (
    <View style={styles.home}>

      <Text style={styles.homeTitle}>
        ¡Bienvenido a Cohete! 🚀
      </Text>


      <Text style={styles.homeDescription}>
        Elige una opción para comenzar.
      </Text>


      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Juegos')}
      >

        <Text style={styles.buttonText}>
          🎮 Juegos
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Super')}
      >

        <Text style={styles.buttonText}>
          🛒 Lista del súper
        </Text>

      </TouchableOpacity>

    </View>
  );
}


// ================================================
// JUEGOS
// ================================================

function GamesScreen() {

  return (
    <Tab.Navigator>

      <Tab.Screen
        name="Dados"
        component={DiceGame}
        options={{
          title: 'Lanzar dados',
          tabBarLabel: 'Dados',
        }}
      />


      <Tab.Screen
        name="Memorama"
        component={MemoryGame}
        options={{
          title: 'Memorama',
          tabBarLabel: 'Memorama',
        }}
      />


      <Tab.Screen
        name="TicTacToe"
        component={TicTacToe}
        options={{
          title: 'Tic Tac Toe',
          tabBarLabel: 'Gato',
        }}
      />

    </Tab.Navigator>
  );
}


// ================================================
// PERFIL
// ================================================

function ProfileScreen() {

  return (
    <View style={styles.center}>

      <Text style={styles.sectionTitle}>
        👤 Perfil
      </Text>

      <Text>
        Información del usuario.
      </Text>

    </View>
  );
}


// ================================================
// AJUSTES
// ================================================

function SettingsScreen() {

  return (
    <View style={styles.center}>

      <Text style={styles.sectionTitle}>
        ⚙️ Ajustes
      </Text>

      <Text>
        Configuración de la aplicación.
      </Text>

    </View>
  );
}


// ================================================
// DRAWER
// ================================================

function MyDrawer() {

  return (
    <Drawer.Navigator>

      <Drawer.Screen
        name="Inicio"
        component={HomeScreen}
      />

      <Drawer.Screen
        name="Juegos"
        component={GamesScreen}
      />

      <Drawer.Screen
        name="Super"
        component={ShoppingList}
      />

      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
      />

      <Drawer.Screen
        name="Ajustes"
        component={SettingsScreen}
      />

    </Drawer.Navigator>
  );
}


// ================================================
// APP
// ================================================

export default function App() {

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 2500);


    return () => {
      clearTimeout(timer);
    };

  }, []);


  if (loading) {
    return <SplashScreen />;
  }


  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="Principal"
          component={MyDrawer}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}


// ================================================
// ESTILOS
// ================================================

const styles = StyleSheet.create({

  splash: {
    flex: 1,
    backgroundColor: '#182848',
    alignItems: 'center',
    justifyContent: 'center',
  },


  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },


  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },


  home: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },


  homeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },


  homeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },


  button: {
    width: '90%',
    backgroundColor: '#3478f6',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },


  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },


  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },


  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },

});
