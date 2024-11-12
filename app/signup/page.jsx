"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/Login.module.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Signup successful! Redirecting to login...", {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    theme: "dark",
                    transition: Bounce,
                });
                localStorage.setItem('token', data.token);
                setTimeout(() => router.push('/login'), 1500);
            } else {
                toast.error(data.message || 'Signup failed.', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "dark",
                transition: Bounce,
            });
            console.error('Signup error:', error); 
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 py-6">
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
