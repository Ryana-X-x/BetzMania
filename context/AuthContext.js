// app/context/AuthContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create the context
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter(); 

    useEffect(() => {

        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
        }
    }, []); 

    // Login function
    const login = (userData, token) => {
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        router.push('/'); 
    };

    // SignUp function
    const signUp = async (userData) => {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await res.json();

        if (res.ok) {
            login(data.user, data.token); 
        } else {
            
            console.error(data.message);
        }
    };

    // Logout function
    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        router.push('/login'); // Redirect to login page after logout
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
