"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/cf.module.css";

const CoinFlip = () => {
    const [result, setResult] = useState(null);
    const [flipping, setFlipping] = useState(false);
    const [showFlipping, setShowFlipping] = useState(false);
    const [userChoice, setUserChoice] = useState(null);
    const [gameMessage, setGameMessage] = useState("");
    const [balance, setBalance] = useState(0);
    const [betAmount, setBetAmount] = useState(0);

    const user = JSON.parse(localStorage.getItem("user")); // Assuming user is stored in localStorage
    const userId = user ? user.id : null;  // Get userId from localStorage

    // Fetch user balance from the backend
    useEffect(() => {
        const fetchBalance = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(`/api/user/${userId}/balance`);
                setBalance(response.data.balance);  // Set the balance from the backend
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        fetchBalance();
    }, [userId]);

    const handleBetChange = (e) => {
        setBetAmount(Number(e.target.value));
    };

    const flipCoin = async () => {
        if (flipping || userChoice === null || betAmount <= 0 || betAmount > balance) return;

        setFlipping(true);
        setShowFlipping(true);
        setResult(null);
        setGameMessage("");

        const randomResult = Math.random() < 0.5 ? "Heads" : "Tails";

        setTimeout(async () => {
            setResult(randomResult);
            setFlipping(false);
            setShowFlipping(false);

            let newGameMessage = "";
            let gameOutcome = "";

            if (userChoice === randomResult) {
                setBalance((prevBalance) => prevBalance + betAmount);
                newGameMessage = "You Win!";
                gameOutcome = "win";
            } else {
                setBalance((prevBalance) => prevBalance - betAmount);
                newGameMessage = "You Lose!";
                gameOutcome = "lose";
            }

            setGameMessage(newGameMessage);

            // Update balance in the backend after the game result
            if (userId) {
                try {
                    const response = await axios.post(`/api/user/${userId}/balance/game`, {
                        gameOutcome,
                        amount: betAmount
                    });
                    setBalance(response.data.balance);  // Set the updated balance from the backend
                } catch (error) {
                    console.error("Error updating balance:", error);
                }
            }
        }, 1000);
    };

    const resetGame = () => {
        setResult(null);
        setFlipping(false);
        setShowFlipping(false);
        setUserChoice(null);
        setGameMessage("");
        setBetAmount(0);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>Coin Flip Game</h1>
            <p className={styles.balance}>Balance: ${balance}</p>
            <div className={`${styles.coin} ${flipping ? styles.flipping : ""}`}>
                {showFlipping ? (
                    <img src="/dollar.gif" alt="Flipping Coin" className={styles.coinImage} />
                ) : result ? (
                    result === "Heads" ? (
                        <img src="/heads.png" alt="Heads" className={styles.coinImage} />
                    ) : (
                        <img src="/tails.png" alt="Tails" className={styles.coinImage} />
                    )
                ) : (
                    <img src="/heads.png" alt="Heads" className={styles.coinImage} />
                )}
            </div>
            <div className={styles.buttonct}>
                <div className={styles.buttons}>
                    <button
                        id="button"
                        onClick={() => setUserChoice("Heads")}
                        disabled={flipping || userChoice === "Heads"}
                        className={`${styles.button} ${userChoice === "Heads" ? styles.selected : ""}`}
                    >
                        Heads
                    </button>
                    <button
                        id="button"
                        onClick={() => setUserChoice("Tails")}
                        disabled={flipping || userChoice === "Tails"}
                        className={`${styles.button} ${userChoice === "Tails" ? styles.selected : ""}`}
                    >
                        Tails
                    </button>
                </div>

                <div className={styles.bet}>
                    <label htmlFor="betAmount">Bet Amount</label>
                    <input
                        type="number"
                        id="betAmount"
                        min="1"
                        max={balance}
                        value={betAmount}
                        onChange={handleBetChange}
                        disabled={flipping}
                    />
                </div>
                <button
                    className={styles.button}
                    onClick={flipCoin}
                    disabled={flipping || userChoice === null || betAmount <= 0 || betAmount > balance}
                >
                    {flipping ? "Flipping..." : "Flip the Coin"}
                </button>
                {result && <p className={styles.result}>Result: {result}</p>}
                {gameMessage && <p className={styles.message}>{gameMessage}</p>}
                {gameMessage && (
                    <button className={styles.button} onClick={resetGame}>
                        Play Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default CoinFlip;
