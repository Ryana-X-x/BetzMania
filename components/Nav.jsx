'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import styles from '../styles/nav.module.css';

const Navbar = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const [balance, setBalance] = useState(null);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [balanceError, setBalanceError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchUserBalance(user.id);
        }
    }, [isLoggedIn, user]);

    const fetchUserBalance = async (userId) => {
        setLoadingBalance(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/api/user/${userId}/balance`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBalance(response.data.balance);
            setBalanceError(null);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalanceError('Could not load balance');
        } finally {
            setLoadingBalance(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const toggleDropdown = () => {
        setShowDropdown((prevState) => !prevState);
    };

    return (
        <div className={styles.container}>
            <div className={styles.con1}>
                <Link href="/" className={styles.logo}>
                    <img src="/logo.png" alt="BetzMania Logo" />
                </Link>

                <div className={styles.rr}>
                    {isLoggedIn && (
                        <div className={styles.balanceContainer}>
                            {loadingBalance ? (
                                <span className={styles.balance}>Loading...</span>
                            ) : balanceError ? (
                                <span className={styles.error}>{balanceError}</span>
                            ) : (
                                <span className={styles.balance}>Balance: ${balance?.toFixed(2)}</span>
                            )}
                        </div>
                    )}

                    <div
                        className={styles.hamburger}
                        onClick={toggleDropdown}
                        role="button"
                        tabIndex={0}
                        aria-expanded={showDropdown}
                        aria-label="Toggle menu"
                    >
                        &#9776;
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
                            <span className={styles.item} onClick={handleLogout}>
                                Logout
                            </span>
                        ) : (
                            <>
                                <Link href="/login" className={styles.item}>Login</Link>
                                <Link href="/signup" className={styles.item}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
