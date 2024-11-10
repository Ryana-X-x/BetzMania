"use client";
import React, { useState, useEffect } from "react";

const GameBoard = ({ lavaCount, onSafeClick, onGameOver, isGameStarted }) => {
    const [gameState, setGameState] = useState(Array(25).fill("hidden"));
    const [lavaPositions, setLavaPositions] = useState(new Set());
    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        if (isGameStarted) {
            initializeGame();
        }
    }, [isGameStarted, lavaCount]);

    const initializeGame = () => {
        const newGameState = Array(25).fill("hidden");
        const newLavaPositions = new Set();
        while (newLavaPositions.size < lavaCount) {
            newLavaPositions.add(Math.floor(Math.random() * 25));
        }
        setGameState(newGameState);
        setLavaPositions(newLavaPositions);
        setClickCount(0);
    };

    const handleCircleClick = (index) => {
        if (gameState[index] !== "hidden" || !isGameStarted) return;

        const newGameState = [...gameState];
        if (lavaPositions.has(index)) {
            newGameState[index] = "Lava";
            setGameState(newGameState);
            onGameOver(false);
        } else {
            newGameState[index] = "gem";
            setGameState(newGameState);
            const newClickCount = clickCount + 1;
            setClickCount(newClickCount);
            onSafeClick(newClickCount);

            if (newClickCount === 25 - lavaCount) {
                onGameOver(true);
            }
        }
    };

    useEffect(() => {
        if (!isGameStarted) {
            const finalGameState = [...gameState];
            lavaPositions.forEach((pos) => {
                finalGameState[pos] = "Lava";
            });
            setGameState(finalGameState);
        }
    }, [isGameStarted]);

    return (
        <div className="w-full max-w-xl mx-auto" >
            <div className="grid place-items-center grid-cols-5 sm:grid-cols-5 gap-1 sm:gap-2 md:gap-3 bg-[#0f212e] p-2 sm:p-3 md:p-4 rounded-lg">
                {gameState.map((state, index) => (
                    <div
                        key={index}
                        className={`aspect-square cursor-pointer w-12 sm:w-14 md:w-16 lg:w-20 flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 overflow-hidden ${state === "hidden"
                                ? "bg-[#4f6f86] hover:bg-[#557086] border-2 border-gray-300 shadow-lg hover:shadow-xl"
                                : state === "gem"
                                    ? "shadow-lg hover:shadow-xl hover:scale-110"
                                    : "shadow-lg hover:shadow-xl hover:scale-110"
                            }`}
                        onClick={() => handleCircleClick(index)}
                    >
                        {state !== "hidden" && (
                            <img
                                src={state === "gem" ? "/gem.png" : "/bomb.png"}
                                alt="game-item"
                                className="w-full h-full object-cover w-90"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>

    );


};

export default GameBoard;
