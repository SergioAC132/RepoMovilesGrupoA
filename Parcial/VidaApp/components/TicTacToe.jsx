import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const emptyBoard = [
  '', '', '',
  '', '', '',
  '', '', '',
];

const winningCombinations = [

  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],

];

function getWinner(board) {

  for (
    const combination of winningCombinations
  ) {

    const [a, b, c] = combination;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

export default function TicTacToe() {

  const [board, setBoard] =
    useState(emptyBoard);

  const [turn, setTurn] =
    useState('X');

  const [winner, setWinner] =
    useState(null);

  const play = (index) => {

    if (board[index] || winner) {
      return;
    }

    const newBoard = [...board];

    newBoard[index] = turn;

    setBoard(newBoard);

    const newWinner =
      getWinner(newBoard);

    if (newWinner) {
      setWinner(newWinner);
      return;
    }

    if (!newBoard.includes('')) {
      setWinner('Empate');
      return;
    }

    setTurn(
      turn === 'X'
        ? 'O'
        : 'X'
    );
  };

  const restart = () => {

    setBoard(emptyBoard);
    setTurn('X');
    setWinner(null);

  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        ❌⭕ Tic Tac Toe
      </Text>

      <Text style={styles.turn}>

        {winner
          ? winner === 'Empate'
            ? '¡Empate!'
            : `Ganador: ${winner}`
          : `Turno de: ${turn}`
        }

      </Text>

      <View style={styles.board}>

        {board.map((value, index) => (

          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => play(index)}
          >

            <Text style={styles.cellText}>
              {value}
            </Text>

          </TouchableOpacity>

        ))}

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
    marginBottom: 15,
  },

  turn: {
    fontSize: 20,
    marginBottom: 25,
  },

  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cellText: {
    fontSize: 45,
    fontWeight: 'bold',
  },

  button: {
    marginTop: 30,
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
