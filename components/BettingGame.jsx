"use client";
import React, { useState, useCallback, useEffect } from "react";
import GameBoard from "./Gameboard";
import axios from "axios";
import styles from '../styles/st.module.css'

const TOTAL_TILES = 24;

const BettingGame = () => {
  const [lavaCount, setLavaCount] = useState("4");
  const [betAmount, setBetAmount] = useState("10");
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [balance, setBalance] = useState(0); // Track user balance

  console.log("balancce434 ",balance);
  

  // Fetch balance from API and store it in localStorage on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;

      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      try {
        const response = await axios.get(`/api/user/${userId}/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userBalance = response.data.balance;
        setBalance(userBalance); // Set balance from API
        localStorage.setItem("balance", userBalance.toFixed(2)); // Save to localStorage
        console.log("Balance fetched:", userBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  // Load balance from localStorage if available
  useEffect(() => {
    const storedBalance = parseFloat(localStorage.getItem("balance")) || 0;
    setBalance(storedBalance);
  }, []);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("balance", balance.toFixed(2));
  }, [balance]);

  // Calculate probability of winning
  const calculateProbability = useCallback(
    (safeClicks) => {
      const remainingSafeTiles = TOTAL_TILES - parseInt(lavaCount) - safeClicks;
      const remainingTotalTiles = TOTAL_TILES - safeClicks;
      return remainingSafeTiles / remainingTotalTiles;
    },
    [lavaCount]
  );

  // Calculate payout based on safe clicks
  const calculatePayout = useCallback(
    (safeClicks) => {
      let payout = parseFloat(betAmount);
      for (let i = 0; i < safeClicks; i++) {
        payout /= calculateProbability(i);
      }
      return payout;
    },
    [betAmount, calculateProbability]
  );

  // Handle safe click logic
  const handleSafeClick = useCallback(
    (newClickCount) => {
      setClickCount(newClickCount);
      const newWinning = calculatePayout(newClickCount);
      setCurrentWinnings(newWinning);
    },
    [calculatePayout]
  );

  // Handle game over (win or loss)
  const handleGameOver = useCallback(async (isHomeRun) => {
    setGameOver(true);
    setIsGameStarted(false);
  
    // Update balance after game over based on win or loss
    setBalance((prevBalance) => {
      let newBalance = prevBalance;
      
      // Deduct bet amount if game is lost
      if (!isHomeRun) {
        newBalance = prevBalance - parseFloat(betAmount);
        setCurrentWinnings(0); // Reset winnings on loss
      } else {
        // Add winnings to balance if the game is won
        newBalance = prevBalance + currentWinnings;
      }
  
      // Save the updated balance to localStorage
      localStorage.setItem('balance', newBalance.toFixed(2));
  
      // Update the balance in the database
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;
  
      if (userId) {
        axios
          .put(
            `/api/user/${userId}/balance`, 
            { balance: newBalance }, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            console.log("Balance updated in DB:", response.data);
          })
          .catch((error) => {
            console.error("Error updating balance in DB:", error);
          });
      }
  
      return newBalance; // Return the updated balance for state
    });
  }, [betAmount, currentWinnings]);



  // Start the game
  const handleStartGame = () => {
    const lavaCountNum = parseInt(lavaCount);
    const betAmountNum = parseFloat(betAmount);

    if (isNaN(lavaCountNum) || lavaCount < 1 || lavaCount >= TOTAL_TILES) {
      alert("Please enter a valid number of lava circles (1-23).");
      return;
    }

    if (isNaN(betAmountNum) || betAmountNum <= 0 || betAmountNum > balance) {
      alert("Please enter a valid betting amount (greater than 0) and not exceeding your balance.");
      return;
    }

    setIsGameStarted(true);
    setGameOver(false);
    setCurrentWinnings(0);
    setClickCount(0);
  };

  // Cashout logic
  const handleCashout = async () => {
    if (currentWinnings > parseFloat(betAmount)) {
      setGameOver(true);
      setIsGameStarted(false);
      
      // Add winnings to balance on cashout and deduct bet amount
      setBalance((prevBalance) => {
        const newBalance = prevBalance + currentWinnings - parseFloat(betAmount);
        localStorage.setItem("balance", newBalance.toFixed(2)); // Save updated balance in localStorage
  
        // Update the balance in the database
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : null;
  
        if (userId) {
          axios
            .put(
              `/api/user/${userId}/balance`,
              { balance: newBalance },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
              console.log("Balance updated in DB:", response.data);
            })
            .catch((error) => {
              console.error("Error updating balance in DB:", error);
            });
        }
  
        return newBalance; // Update state with new balance
      });
  
      alert(`Congratulations! You've cashed out $${currentWinnings.toFixed(2)}`);
    }
  };


  // Handle input changes
  const handleLavaCountChange = (e) => setLavaCount(e.target.value);
  const handleBetAmountChange = (e) => setBetAmount(e.target.value);

  return (
    <div className={styles.con}>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
        {/* Game Settings Panel */}
        <div className="w-full md:w-64 p-4 bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg">
          <h2 className="text-xl text-white font-bold mb-4">Game Settings</h2>
          <div className="mb-4">
            <label htmlFor="lavaCount" className="block mb-2 text-white">
              Number of Lava Circles:
            </label>
            <input
              type="number"
              id="lavaCount"
              value={lavaCount}
              onChange={handleLavaCountChange}
              min="1"
              max="23"
              className="w-full px-2 py-1 border rounded"
              disabled={isGameStarted}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="betAmount" className="block mb-2 text-white">
              Betting Amount:
            </label>
            <input
              type="number"
              id="betAmount"
              value={betAmount}
              onChange={handleBetAmountChange}
              min="0.01"
              step="0.01"
              className="w-full px-2 py-1 border rounded"
              disabled={isGameStarted}
            />
          </div>
          <button
            onClick={handleStartGame}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
            disabled={isGameStarted}
          >
            {isGameStarted ? "Game in Progress" : "Start Game"}
          </button>
          <button
            onClick={handleCashout}
            className={`w-full px-4 py-2 rounded ${isGameStarted && currentWinnings > parseFloat(betAmount)
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={!isGameStarted || currentWinnings <= parseFloat(betAmount)}
          >
            Cash Out
          </button>
        </div>

        {/* Game Board */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <GameBoard
            lavaCount={parseInt(lavaCount)}
            onSafeClick={handleSafeClick}
            onGameOver={handleGameOver}
            isGameStarted={isGameStarted}
          />
          <div className="text-2xl mb-4 mt-4">
            Current Winning: ${currentWinnings.toFixed(2)}
          </div>
          {gameOver && currentWinnings === 0 && (
            <div className="text-2xl mb-4 text-red-500">Game Over! You lost your bet.</div>
          )}
          {gameOver && currentWinnings > 0 && (
            <div className="text-2xl mb-4 text-green-500">
              Congratulations! You won ${currentWinnings.toFixed(2)}!
            </div>
          )}
          <div className="text-2xl mb-4 mt-4 text-black">Balance: ${balance.toFixed(2)}</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BettingGame;
