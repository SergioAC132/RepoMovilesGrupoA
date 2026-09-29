import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

import Splash from './components/Splash';
import Pasos from './components/Pasos';
import Actividades from './components/Actividades';
import Perfil from './components/Perfil';
import Acerca from './components/Acerca';
import { colores } from './components/tema';

SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const temaNav = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colores.fondo,
    card: colores.superficie,
    text: colores.texto,
    border: colores.linea,
    primary: colores.acento,
  },
};

const iconosTab = {
  Pasos: ['walk', 'walk-outline'],
  Actividades: ['list', 'list-outline'],
};

const iconosDrawer = {
  Inicio: 'home-outline',
  Perfil: 'person-outline',
  'Acerca de': 'information-circle-outline',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colores.acento,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarStyle: {
          backgroundColor: colores.superficie,
          borderTopColor: colores.linea,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={iconosTab[route.name][focused ? 0 : 1]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Pasos" component={Pasos} />
      <Tab.Screen name="Actividades" component={Actividades} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [listo, setListo] = useState(false);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colores.fondo} />
      {listo ? (
        <NavigationContainer theme={temaNav}>
          <Drawer.Navigator
            initialRouteName="Inicio"
            screenOptions={({ route }) => ({
              headerStyle: { backgroundColor: colores.fondo },
              headerTintColor: colores.texto,
              headerTitleStyle: { fontWeight: '700' },
              headerShadowVisible: false,
              drawerStyle: { backgroundColor: colores.superficie },
              drawerActiveTintColor: colores.acento,
              drawerInactiveTintColor: colores.textoSuave,
              drawerActiveBackgroundColor: 'rgba(255,107,74,0.14)',
              drawerLabelStyle: { fontWeight: '600' },
              drawerIcon: ({ color, size }) => (
                <Ionicons name={iconosDrawer[route.name]} size={size} color={color} />
              ),
            })}
          >
            <Drawer.Screen
              name="Inicio"
              component={Tabs}
              options={{ title: 'PasosApp' }}
            />
            <Drawer.Screen name="Perfil" component={Perfil} />
            <Drawer.Screen name="Acerca de" component={Acerca} />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <Splash onFinish={() => setListo(true)} />
      )}
    </>
  );
}