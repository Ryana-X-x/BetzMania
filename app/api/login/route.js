import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    await dbConnect();

    const { email, password } = await req.json(); // Ensure to parse the request body

    if (!email || !password) {
        return new Response(
            JSON.stringify({ message: "Email and password are required.", success: false }),
            { status: 400 }
        );
    }

    try {
        // Look for the user with the given email
        let user = await User.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found", success: false }),
                { status: 404 }
            );
        }

        // Compare entered password with stored hash
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return new Response(
                JSON.stringify({ message: "Invalid password", success: false }),
                { status: 401 }
            );
        }

        // Generate JWT token with user ID
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '365d', // Token expiry
        });

        // Return success with message and token, along with basic user info (excluding password)
        return new Response(
            JSON.stringify({
                message: `Welcome ${user.name}`,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    balance: user.balance,
                },
                success: true,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error); // Log error for debugging
        return new Response(
            JSON.stringify({ message: "Internal server error", success: false }),
            { status: 500 }
        );
    }
}