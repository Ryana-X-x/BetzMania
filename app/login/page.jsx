"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '../../styles/Login.module.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();


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

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          theme: 'dark',
          transition: Bounce,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => router.push('/'), 1000); // Redirect after a short delay
      } else {
        toast.error(data.message || 'Login failed', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          theme: 'dark',
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again later.', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        theme: 'dark',
        transition: Bounce,
      });
    }
  };



  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    
    if (isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        if (isMounted) {
            router.push('/login'); 
        }
        toast.info('Logged out successfully', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          theme: 'dark',
          transition: Bounce,
        });
    }
};


  if (!isMounted) {
    return null;  // Prevent rendering the component until after mounting
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Password"
              required
            />
            <span className={styles.passwordToggle} onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit" className={styles.button}>Login</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Login;
