"use client"

import { useState } from 'react';
import styles from '../../styles/rw.module.css'; // Make sure this path is correct


const numbers = [
    { number: 0, color: 'green' },
    { number: 1, color: 'red' },
    { number: 2, color: 'black' },
    { number: 3, color: 'red' },
    { number: 4, color: 'black' },
    { number: 5, color: 'red' },
    { number: 6, color: 'black' },
    { number: 7, color: 'red' },
    { number: 8, color: 'black' },
    { number: 9, color: 'red' },
    { number: 10, color: 'black' },
    { number: 11, color: 'red' },
    { number: 12, color: 'black' },
    { number: 13, color: 'red' },
    { number: 14, color: 'black' },
    { number: 15, color: 'red' },
    { number: 16, color: 'black' },
    { number: 17, color: 'red' },
    { number: 18, color: 'black' },
    { number: 19, color: 'red' },
    { number: 20, color: 'black' },
    { number: 21, color: 'red' },
    { number: 22, color: 'black' },
    { number: 23, color: 'red' },
    { number: 24, color: 'black' },
    { number: 25, color: 'red' },
    { number: 26, color: 'black' },
    { number: 27, color: 'red' },
    { number: 28, color: 'black' },
    { number: 29, color: 'red' },
    { number: 30, color: 'black' },
    { number: 31, color: 'red' },
    { number: 32, color: 'black' },
    { number: 33, color: 'red' },
    { number: 34, color: 'black' },
    { number: 35, color: 'red' },
    { number: 36, color: 'black' },
];

const Wheel = () => {
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState({ number: null, color: null });

    const spinWheel = () => {
        const randomDegree = Math.floor(Math.random() * 360) + 720; // Ensure at least two full rotations
        setRotation(randomDegree);

        // Calculate winning number and color after spin
        setTimeout(() => {
            const index = Math.floor(((randomDegree % 360) / 360) * numbers.length);
            const winningNumber = numbers[index % numbers.length];
            setResult(winningNumber);
        }, 3000); // Wait for 3 seconds for the spin effect
    };

    return (
        <div className={styles.container}>
            <div
                className={styles.wheel}
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {numbers.map((num, index) => (
                    <div
                        key={index}
                        className={`${styles.segment} ${styles[num.color]}`}
                    >
                        {num.number}
                    </div>
                ))}
            </div>
            <button onClick={spinWheel} className={styles.spinButton}>
                Spin the Wheel!
            </button>
            {result.number !== null && (
                <h2>
                    Winning Number: {result.number} - Color: {result.color}
                </h2>
            )}
        </div>
    );
};

export default Wheel;

