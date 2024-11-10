"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
      
        if (res.ok) {
            const { token } = await res.json();
            // Store the token in localStorage (or sessionStorage) for later use
            localStorage.setItem('token', token);
            router.push('/login'); // Redirect to login after signup
        } else {
            const errorData = await res.json();
            console.error('Signup failed:', errorData.message); // Log the error message for debugging
            alert(errorData.message);  // Display the error message to the user
        }
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
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
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
