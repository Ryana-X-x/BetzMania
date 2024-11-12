
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function GET(req, { params }) {
    await dbConnect();
  
    const { id } = params;
    if (!id) {
        return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

// PUT method to update user balance
export async function PUT(req, { params }) {
    await dbConnect();

    const { id } = params;
    const { balance } = await req.json();  // Get the balance from the request body

    if (!id || balance === undefined) {
        return new Response(JSON.stringify({ message: "User ID and balance are required" }), { status: 400 });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        user.balance = balance;  // Update balance
        await user.save();  // Save the updated user

        return new Response(JSON.stringify({ message: "Balance updated", user }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to update balance" }), { status: 500 });
    }
}
