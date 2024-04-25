import React, { useState, useEffect } from "react";
import "./App.css";
import { dictionary } from "./Dictionary";

function App() {
  const [tiles1, setTiles1] = useState(Array(5).fill(""));
  const [tiles2, setTiles2] = useState(Array(5).fill(""));
  const [answers1, setAnswers1] = useState(Array(5).fill(""));
  const [answers2, setAnswers2] = useState(Array(5).fill(""));
  const [winner, setWinner] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for Player 1, 2 for Player 2

  // Function to generate a random uppercase letter
  const generateRandomLetter = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  };

  // Function to generate random letters for blank tiles in the first row
  const generateRandomLetters1 = () => {
    if (currentPlayer === 1) {
      const randomLetters = tiles1.map((tile) => {
        return tile === "" ? generateRandomLetter() : tile;
      });
      setTiles1(randomLetters);
    }
  };

  // Function to generate random letters for blank tiles in the second row
  const generateRandomLetters2 = () => {
    if (currentPlayer === 2) {
      const randomLetters = tiles2.map((tile) => {
        return tile === "" ? generateRandomLetter() : tile;
      });
      setTiles2(randomLetters);
    }
  };

  // Function to find the closest valid word for the given tiles
  const findClosestWord = (tiles) => {
    let closestWord = "";
    let minDifference = Infinity;

    dictionary.forEach((dictWord) => {
      const dictLetterCount = {}; // Object to store letter counts in the dictionary word
      const tilesLetterCount = {}; // Object to store letter counts in the combined tiles
      let difference = 0;

      // Count occurrences of each letter in the dictionary word
      dictWord.split("").forEach((letter) => {
        dictLetterCount[letter] = (dictLetterCount[letter] || 0) + 1;
      });

      // Count occurrences of each letter in the combined tiles
      tiles.forEach((letter) => {
        tilesLetterCount[letter] = (tilesLetterCount[letter] || 0) + 1;
      });

      // Compare the counts of each letter
      for (const letter in dictLetterCount) {
        const dictCount = dictLetterCount[letter] || 0;
        const tilesCount = tilesLetterCount[letter] || 0;
        difference += Math.max(0, dictCount - tilesCount); // Add the difference in counts
      }

      // Update the closest word if the current word has a smaller difference
      if (difference < minDifference) {
        closestWord = dictWord;
        minDifference = difference;
      }
    });

    return closestWord;
  };

  const solve = () => {
    const combinedLetters =
      currentPlayer === 1 ? tiles1.concat(answers1) : tiles2.concat(answers2);
    const closestWord = findClosestWord(combinedLetters);
    const tilesCopy = [...(currentPlayer === 1 ? tiles1 : tiles2)];
    const missingLetters = closestWord
      .split("")
      .filter((letter) => !combinedLetters.includes(letter));
    const answer = closestWord.split("").map((letter, index) => {
      if (tilesCopy.includes(letter)) {
        tilesCopy[tilesCopy.indexOf(letter)] = "";
        return letter;
      }
      if (combinedLetters.includes(letter)) {
        return letter;
      }
      return (
        <span key={index} style={{ color: "green" }}>
          {letter}
        </span>
      );
    });

    if (currentPlayer === 1) {
      setTiles1(tilesCopy);
      setAnswers1(answer);
    } else {
      setTiles2(tilesCopy);
      setAnswers2(answer);
    }

    // Check if current player wins
    if (missingLetters.length === 0) {
      setWinner(currentPlayer);
      alert(`Player ${currentPlayer} Wins!`);
      return;
    }

    // Switch to the next player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const handlePass = () => {
    if (currentPlayer === 1) {
      const randomLetters = Array(5)
        .fill("")
        .map(() => generateRandomLetter());
      setTiles1(randomLetters);
    } else {
      const randomLetters = Array(5)
        .fill("")
        .map(() => generateRandomLetter());
      setTiles2(randomLetters);
    }
    // Switch to the next player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const resetGame = () => {
    setTiles1(Array(5).fill(""));
    setTiles2(Array(5).fill(""));
    setAnswers1(Array(5).fill(""));
    setAnswers2(Array(5).fill(""));
    setWinner(null);
    setCurrentPlayer(1);
  };

  return (
    <div>
      <button
        className="reset-button text-black"
        onClick={resetGame}
        style={{ position: "fixed", top: "20px", right: "20px" }}
      >
        Reset Game
      </button>
      <div className="flex flex-col space-y-40 text-white">
        <div className="flex flex-col space-y-4 items-start">
          <h1> Player 1</h1>
          <div className="flex flex-row space-x-4">
            <div
              className={`flex flex-row justify-between items-center space-x-8 border border-5 p-8 ${
                winner === 1 ? "border-green-500" : ""
              }`}
            >
              <div className="grid grid-cols-5 gap-8">
                {tiles1.map((letter, index) => (
                  <div key={index} className="border-2 p-4">
                    {letter}
                  </div>
                ))}
              </div>
              <button
                className="button text-black"
                onClick={generateRandomLetters1}
                disabled={currentPlayer !== 1}
              >
                Generate
              </button>
              <button
                className="button text-black"
                onClick={handlePass}
                disabled={currentPlayer !== 1}
              >
                Pass
              </button>
            </div>
            <div
              className={`flex flex-row justify-between items-center space-x-8 border border-5 p-8 ${
                winner === 1 ? "border-green-500" : ""
              }`}
            >
              <div className="grid grid-cols-5 gap-8">
                {answers1.map((letter, index) => (
                  <div key={index} className="border-2 p-4">
                    {letter}
                  </div>
                ))}
              </div>
              <button
                className="button text-black"
                onClick={solve}
                disabled={currentPlayer !== 1}
              >
                Move
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 items-start">
          <h1> Player 2</h1>
          <div className="flex flex-row space-x-4">
            <div
              className={`flex flex-row justify-between items-center space-x-8 border border-5 p-8 ${
                winner === 2 ? "border-green-500" : ""
              }`}
            >
              <div className="grid grid-cols-5 gap-8">
                {tiles2.map((letter, index) => (
                  <div key={index} className="border-2 p-4">
                    {letter}
                  </div>
                ))}
              </div>
              <button
                className="button text-black"
                onClick={generateRandomLetters2}
                disabled={currentPlayer !== 2}
              >
                Generate
              </button>
              <button
                className="button text-black"
                onClick={handlePass}
                disabled={currentPlayer !== 2}
              >
                Pass
              </button>
            </div>
            <div
              className={`flex flex-row justify-between items-center space-x-8 border border-5 p-8 ${
                winner === 2 ? "border-green-500" : ""
              }`}
            >
              <div className="grid grid-cols-5 gap-8">
                {answers2.map((letter, index) => (
                  <div key={index} className="border-2 p-4">
                    {letter}
                  </div>
                ))}
              </div>
              <button
                className="button text-black"
                onClick={solve}
                disabled={currentPlayer !== 2}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
