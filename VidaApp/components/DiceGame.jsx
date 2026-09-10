import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function DiceGame() {

  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);

  const rollDice = () => {

    const newDice1 =
      Math.floor(Math.random() * 6) + 1;

    const newDice2 =
      Math.floor(Math.random() * 6) + 1;

    setDice1(newDice1);
    setDice2(newDice2);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🎲 Lanzar dados
      </Text>

      <View style={styles.diceContainer}>

        <View style={styles.dice}>
          <Text style={styles.diceText}>
            {dice1}
          </Text>
        </View>

        <View style={styles.dice}>
          <Text style={styles.diceText}>
            {dice2}
          </Text>
        </View>

      </View>

      <Text style={styles.result}>
        Resultado: {dice1 + dice2}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={rollDice}
      >
        <Text style={styles.buttonText}>
          Lanzar dados
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7fb',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },

  diceContainer: {
    flexDirection: 'row',
    gap: 20,
  },

  dice: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  diceText: {
    fontSize: 50,
    fontWeight: 'bold',
  },

  result: {
    fontSize: 22,
    marginTop: 30,
  },

  button: {
    marginTop: 30,
    backgroundColor: '#3478f6',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

});
