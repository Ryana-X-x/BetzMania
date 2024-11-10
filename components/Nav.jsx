// components/Nav.js
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook
import Link from 'next/link';
import axios from 'axios';
import styles from "../styles/nav.module.css";

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth(); // Access the auth context
    const [balance, setBalance] = useState(null); // State to hold balance
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchUserBalance(user.id);
        }
    }, [isLoggedIn, user]); // Re-run effect when isLoggedIn or user changes

    const fetchUserBalance = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/api/user/${userId}/balance`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(response.data.balance); // Assuming the API returns { balance: amount }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const handleLogout = () => {
        logout(); // Use the logout function from AuthContext
    };

    const toggleDropdown = () => {
        setShowDropdown(prevState => !prevState);
    };

    return (
        <div className={styles.container}>
            <div className={styles.con1}>
                <Link href="/" className={styles.logo}>
                    <img src="/logo.png" alt="BetzMania Logo" />
                </Link>

                <div className={styles.rr}>
                    {isLoggedIn && balance !== null ? (
                        <span className={styles.balance}>Balance: ${balance.toFixed(2)}</span> // Display balance
                    ) : null}
                    <div className={styles.hamburger} onClick={toggleDropdown}>
                        &#9776; {/* Hamburger icon */}
                    </div>

                    <div className={`${styles.right} ${showDropdown ? styles.show : ''}`}>
                        <Link href="/" className={styles.item}>Home</Link>

                        {isLoggedIn ? (
                            <Link href={`/user/${user.id}`} className={styles.item}>
                                Profile
                            </Link>
                        ) : (
                            <Link href="/profile" className={styles.item}>
                                Profile
                            </Link>
                        )}

                        {isLoggedIn ? (
                            <span className={styles.item} onClick={handleLogout}>Logout</span>
                        ) : (
                            <>
                                <Link href="/login" className={styles.item}>Login</Link>
                                <Link href="/signup" className={styles.item}>SignUp</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
