import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const initialCards = [
  '🍎', '🍎',
  '🍌', '🍌',
  '🍕', '🍕',
  '🚀', '🚀',
];

function shuffle(array) {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}

export default function MemoryGame() {

  const [cards, setCards] =
    useState(shuffle(initialCards));

  const [selected, setSelected] =
    useState([]);

  const [matched, setMatched] =
    useState([]);

  const selectCard = (index) => {

    if (
      selected.includes(index) ||
      matched.includes(index) ||
      selected.length === 2
    ) {
      return;
    }

    const newSelected = [
      ...selected,
      index,
    ];

    setSelected(newSelected);

    if (newSelected.length === 2) {

      const [first, second] = newSelected;

      if (cards[first] === cards[second]) {

        setMatched([
          ...matched,
          first,
          second,
        ]);

        setSelected([]);

      } else {

        setTimeout(() => {
          setSelected([]);
        }, 800);

      }
    }
  };

  const restart = () => {

    setCards(shuffle(initialCards));
    setSelected([]);
    setMatched([]);

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🧠 Memorama
      </Text>

      <View style={styles.board}>

        {cards.map((card, index) => {

          const visible =
            selected.includes(index) ||
            matched.includes(index);

          return (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => selectCard(index)}
            >

              <Text style={styles.cardText}>
                {visible ? card : '❓'}
              </Text>

            </TouchableOpacity>
          );

        })}

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={restart}
      >

        <Text style={styles.buttonText}>
          Reiniciar
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
    marginBottom: 25,
  },

  board: {
    width: 320,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  card: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#3478f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardText: {
    fontSize: 32,
  },

  button: {
    marginTop: 25,
    backgroundColor: '#3478f6',
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
