import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return new Response(JSON.stringify({ message: "All fields are required.", success: false }), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ message: "Invalid email format.", success: false }), { status: 400 });
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return new Response(JSON.stringify({ message: "Password must be at least 8 characters long and contain at least one letter and one number.", success: false }), { status: 400 });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return new Response(JSON.stringify({ message: "User already exists", success: false }), { status: 409 });
        }

        const hashPass = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashPass });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return new Response(JSON.stringify({ message: "User registered successfully!", user: user, token: token, success: true }), { status: 201 });
    } catch (error) {
        console.error("Registration error:", error); // Log the error for debugging
        return new Response(JSON.stringify({ message: "Server error", success: false }), { status: 500 });
    }
}
