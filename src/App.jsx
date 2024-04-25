import React, { useState, useEffect } from "react";
import "./App.css";
import { dictionary } from "./Dictionary";
import Tree from "react-d3-tree";
function App() {
  const [tiles1, setTiles1] = useState(Array(5).fill(""));
  const [tiles2, setTiles2] = useState(Array(5).fill(""));
  const [answers1, setAnswers1] = useState(Array(5).fill(""));
  const [answers2, setAnswers2] = useState(Array(5).fill(""));
  const [winner, setWinner] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for Player 1, 2 for Player 2
  const [generateClicked, setGenerateClicked] = useState(false);
  const [orgChartData, setOrgChartData] = useState({ name: "Sample" });
  const [winnable1, setWinnable1] = useState(false);
  const [winnable2, setWinnable2] = useState(false);
  const [totalCalculations, setTotalCalculations] = useState(0);
  const [modalOpened, setModalOpened] = useState(false);
  // Function to generate a random uppercase letter

  useEffect(() => {
    // Open the modal when the component mounts
    setModalOpened(true);
  }, []);

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

  const findClosestWord = (tiles, isTest = false) => {
    let closestWord = "";
    let minDifference = Infinity;
    let solutionProcess = [];
    let allData = [];
    let totalCalculations = 0; // Counter for total calculations

    dictionary.forEach((dictWord) => {
      const dictLetterCount = {};
      const tilesLetterCount = {};
      let difference = 0;
      let process = [];
      let currentCalculations = 0; // Counter for calculations within this loop

      dictWord.split("").forEach((letter) => {
        dictLetterCount[letter] = (dictLetterCount[letter] || 0) + 1;
      });

      tiles.forEach((letter) => {
        tilesLetterCount[letter] = (tilesLetterCount[letter] || 0) + 1;
      });

      for (const letter in dictLetterCount) {
        const dictCount = dictLetterCount[letter] || 0;
        const tilesCount = tilesLetterCount[letter] || 0;
        difference += Math.max(0, dictCount - tilesCount);
        process.push({
          name: letter,
          attributes: {
            dictCount: dictCount,
            tilesCount: tilesCount,
          },
        });

        currentCalculations++; // Increment calculation counter
      }

      totalCalculations += currentCalculations; // Add current loop's calculations to total

      let wordData = {
        name: dictWord,
        attributes: {
          difference: difference,
          calc: currentCalculations,
        },
      };

      if (wordData.attributes.difference <= 3) {
        allData.push(wordData);
      }

      if (difference < minDifference) {
        closestWord = dictWord;
        minDifference = difference;
        solutionProcess = process;
      }
    });

    if (!isTest) {
      let jsonData = {
        name: closestWord,
        attributes: {
          minDifference: minDifference,
        },
        children: allData,
      };
      setOrgChartData(jsonData);
      setTotalCalculations(totalCalculations);
      console.log("data is: ", jsonData);
    }

    return closestWord;
  };

  const check1 = () => {
    const combinedLetters = tiles1.concat(answers1);
    const closestWord = findClosestWord(combinedLetters, true);
    const missingLetters = closestWord
      .split("")
      .filter((letter) => !combinedLetters.includes(letter));

    if (missingLetters.length === 0) {
      return true;
    }

    return false;
  };

  const check2 = () => {
    const combinedLetters = tiles2.concat(answers2);
    const closestWord = findClosestWord(combinedLetters, true);
    const missingLetters = closestWord
      .split("")
      .filter((letter) => !combinedLetters.includes(letter));

    if (missingLetters.length === 0) {
      return true;
    }

    return false;
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
    setTotalCalculations(0);
    setOrgChartData({ name: "Sample" });
  };

  useEffect(() => {
    console.log("total are: ", totalCalculations);
    if (currentPlayer == 1) {
      const valid = check1();
      setWinnable1(valid);
    } else if (currentPlayer == 2) {
      const valid = check2();
      setWinnable2(valid);
    }
  }, [currentPlayer]);

  return (
    <div>
      <button
        className={`reset-button bg-white text-black ${
          winner ? "bg-green-500" : ""
        }`}
        onClick={resetGame}
        style={{ position: "fixed", top: "20px", right: "20px" }}
      >
        Reset Game
      </button>
      {modalOpened && (
        <dialog id="my_modal_1" className="modal" open={true}>
          <div className="modal-box text-justify">
            <h3 className="font-bold text-lg text-center">
              Welcome to Debmac&apos;s Word Duelist
            </h3>
            <p className="py-4">
              Welcome to Debmac&apos;s Word Duelist, where you can engage in a
              strategic word game experience driven by advanced AI algorithms.
              Our AI opponent utilizes a sophisticated search process to analyze
              the board and determine the optimal word to play.
            </p>
            <p className="py-4">
              Our algorithm evaluates all possible combinations of letters on
              the board and calculates the difference between them and the
              dictionary words. It then selects the word with the minimum
              difference, ensuring the most strategic move.
            </p>
            <p className="py-4">
              Throughout the game, you&apos;ll observe the backend of our search
              and logic for Debmac&apos;s Word Duelist visualized in real-time.
              The tree structure displayed below demonstrates the search process
              and calculations performed by our AI to make its decision.
              You&apos;ll also see the total number of calculations, providing
              insight into the complexity of its decision-making.
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Okay</button>
              </form>
            </div>
          </div>
        </dialog>
      )}

      <div className="flex flex-col space-y-20 text-white">
        {!winner && (
          <h1
            className={`${
              currentPlayer === 1 ? "text-pink-500" : "text-yellow-500"
            }`}
          >
            Player&apos;s Turn: Player {currentPlayer}
          </h1>
        )}
        {winner && (
          <h1
            className={`${
              currentPlayer === 1 ? "text-pink-500" : "text-yellow-500"
            }`}
          >
            Winner is : Player {winner}
          </h1>
        )}
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
                className={`button bg-white text-black ${
                  !winner &&
                  currentPlayer === 1 &&
                  tiles1.filter((tile) => tile === "").length > 2
                    ? "bg-green-500"
                    : ""
                }`}
                onClick={() => {
                  generateRandomLetters1();
                  setGenerateClicked(true);
                }}
                disabled={currentPlayer !== 1 || winner}
              >
                Generate
              </button>
              <button
                className={`button bg-white text-black ${
                  !winner &&
                  currentPlayer === 1 &&
                  !generateClicked &&
                  !winnable1 &&
                  tiles1.filter((tile) => tile === "").length <= 2
                    ? "bg-green-500"
                    : ""
                }`}
                onClick={handlePass}
                disabled={currentPlayer !== 1 || generateClicked || winner}
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
                className={`button bg-white text-black ${
                  (!winner && currentPlayer === 1 && generateClicked) ||
                  (currentPlayer === 1 && winnable1)
                    ? "bg-green-500"
                    : ""
                }`}
                onClick={() => {
                  solve();
                  setGenerateClicked(false);
                }}
                disabled={currentPlayer !== 1 || winner}
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
                className={`button bg-white text-black ${
                  !winner &&
                  currentPlayer === 2 &&
                  tiles2.filter((tile) => tile === "").length > 2
                    ? "bg-green-500"
                    : ""
                }`}
                onClick={() => {
                  generateRandomLetters2();
                  setGenerateClicked(true);
                }}
                disabled={currentPlayer !== 2 || winner}
              >
                Generate
              </button>
              <button
                className={`button bg-white text-black ${
                  !winner &&
                  currentPlayer === 2 &&
                  !generateClicked &&
                  !winnable2 &&
                  tiles2.filter((tile) => tile === "").length <= 2
                    ? "bg-green-500"
                    : ""
                }`}
                onClick={handlePass}
                disabled={currentPlayer !== 2 || generateClicked || winner}
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
                className={`button bg-white text-black ${
                  (!winner && currentPlayer === 2 && generateClicked) ||
                  (currentPlayer === 2 && winnable2)
                    ? "bg-green-500"
                    : ""
                }`}
                onClick={() => {
                  solve();
                  setGenerateClicked(false);
                }}
                disabled={currentPlayer !== 2 || winner}
              >
                Move
              </button>
            </div>
          </div>
        </div>
        <div className="collapse bg-base-200">
          <input type="checkbox" className="peer" />
          <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
            Show Search Process
          </div>
          <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
            <h2>Total Calculations are: {totalCalculations}</h2>
            <div id="treeWrapper" style={{ height: "20em" }}>
              <Tree
                className="text-white"
                data={orgChartData}
                zoomable={true}
                translate={{ x: 100, y: 100 }}
                orientation="vertical"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
