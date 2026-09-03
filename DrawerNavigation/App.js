import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './componentes/HomeScreen';
import SearchScreen from './componentes/SearchScreen';
import ProfileScreen from './componentes/ProfileScreen';
import SettingsScreen from './componentes/SettingsScreen';

import {
  createDrawerNavigator
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Inicio"
        component={HomeScreen}
      />
      <Drawer.Screen
        name="Buscar"
        component={SearchScreen}
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

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer/>
    </NavigationContainer>
  )
}