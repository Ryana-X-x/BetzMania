// app/api/balance/deposit/route.js

import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function POST(req) {
    await dbConnect(); // Ensure database connection

    try {
        const { userId, amount } = await req.json(); // Parse the incoming request body

        console.log("Deposit Request Received:", { userId, amount });

        // Log userId to check its value
        console.log("userId:", userId);

        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found for ID:", userId);
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        user.balance += amount;
        await user.save();

        console.log("Deposit successful, new balance:", user.balance);
        return new Response(JSON.stringify({ balance: user.balance }), { status: 200 });
    } catch (error) {
        console.error("Deposit error:", error);
        return new Response(JSON.stringify({ message: "Failed to process deposit", error: error.message }), { status: 500 });
    }
}