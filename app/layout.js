import React from 'react';
import Navbar from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css'; 
import { AuthProvider } from '@/context/AuthContext'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
    title: 'BetzMania',
};

const Layout = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/logo.png" type='image/png' />
            </head>
            <body>
                <AuthProvider>
                    <Navbar />
                    <ToastContainer />
                    <main>{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
};

export default Layout;
