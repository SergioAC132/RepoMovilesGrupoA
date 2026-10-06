import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY =
  '@cohete_shopping_list';


export default function ShoppingList() {

  const [item, setItem] = useState('');

  const [items, setItems] = useState([]);

  const [loaded, setLoaded] =
    useState(false);


  // ==============================================
  // CARGAR LISTA AL ABRIR LA APLICACIÓN
  // ==============================================

  useEffect(() => {

    loadItems();

  }, []);


  // ==============================================
  // GUARDAR LISTA CADA VEZ QUE CAMBIE
  // ==============================================

  useEffect(() => {

    if (loaded) {
      saveItems();
    }

  }, [items, loaded]);


  const loadItems = async () => {

    try {

      const savedItems =
        await AsyncStorage.getItem(
          STORAGE_KEY
        );

      if (savedItems) {

        setItems(
          JSON.parse(savedItems)
        );

      }

    } catch (error) {

      console.log(
        'Error cargando lista:',
        error
      );

    } finally {

      setLoaded(true);

    }
  };


  const saveItems = async () => {

    try {

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );

    } catch (error) {

      console.log(
        'Error guardando lista:',
        error
      );

    }
  };


  // ==============================================
  // AGREGAR PRODUCTO
  // ==============================================

  const addItem = () => {

    if (item.trim() === '') {
      return;
    }

    const newItem = {

      id: Date.now().toString(),

      name: item.trim(),

    };

    setItems([
      ...items,
      newItem,
    ]);

    setItem('');

  };


  // ==============================================
  // ELIMINAR PRODUCTO
  // ==============================================

  const deleteItem = (id) => {

    setItems(
      items.filter(
        currentItem =>
          currentItem.id !== id
      )
    );

  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🛒 Lista del súper
      </Text>


      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Agregar producto..."
          value={item}
          onChangeText={setItem}
          onSubmitEditing={addItem}
        />


        <TouchableOpacity
          style={styles.addButton}
          onPress={addItem}
        >

          <Text style={styles.addButtonText}>
            +
          </Text>

        </TouchableOpacity>

      </View>


      <FlatList
        style={styles.list}

        data={items}

        keyExtractor={
          item => item.id
        }

        renderItem={({ item }) => (

          <View style={styles.listItem}>

            <Text style={styles.itemText}>
              {item.name}
            </Text>


            <TouchableOpacity
              onPress={() =>
                deleteItem(item.id)
              }
            >

              <Text style={styles.deleteText}>
                🗑️
              </Text>

            </TouchableOpacity>

          </View>

        )}

      />

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 25,
  },

  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  addButton: {
    width: 55,
    marginLeft: 10,
    backgroundColor: '#3478f6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 30,
  },

  list: {
    flex: 1,
  },

  listItem: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 18,
  },

  deleteText: {
    fontSize: 20,
  },

});
