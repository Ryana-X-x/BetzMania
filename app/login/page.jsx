"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use next/navigation for client-side routing
import styles from '../../styles/Login.module.css'; // Import the CSS module

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);  // State to track client-side mounting
  const router = useRouter();  // Use the correct useRouter from next/navigation

  // Ensure useRouter is used only after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        // Save the JWT token to localStorage
        router.push('/');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to home or dashboard

    } else {
        alert(data.message); // Show error
    }
};


 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (isMounted) {
      router.push('/login'); // Redirect to login page after logout
    }
  };

  if (!isMounted) {
    return null;  // Prevent rendering the component until after mounting
  }

  return (
    <div className={styles.container}>
      {user ? (
        <div>
          <h1 className={styles.heading}>Welcome, {user.name}</h1>
          <button className={styles.button} onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className={styles.form}>
          <h1 className={styles.heading}>Login</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Password"
            required
          />
          <button type="submit" className={styles.button}>Login</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Login;
