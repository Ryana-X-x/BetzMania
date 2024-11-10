// app/layout.js
import React from 'react';
import Navbar from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css'; // Import your global styles
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

export const metadata = {
    title: 'Your Site Title',
    description: 'Description of your site',
};

const Layout = ({ children }) => {
    return (
        <AuthProvider>
            <html lang="en">
                <body>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </body>
            </html>
        </AuthProvider>
    );
};

export default Layout;
