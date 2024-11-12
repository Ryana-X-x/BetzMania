import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function POST(req, { params }) {
    const { id } = params;  
    const { gameOutcome, amount } = await req.json();  

    await dbConnect();  

    try {
        const user = await User.findById(id);  // Find the user by ID
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        // Update balance based on win or lose outcome
        if (gameOutcome === 'win') {
            user.balance += amount;
        } else if (gameOutcome === 'lose') {
            user.balance -= amount;
        } else {
            return new Response(JSON.stringify({ message: "Invalid game outcome" }), { status: 400 });
        }

        // Save the updated balance
        await user.save();

        // Respond with the updated balance
        return new Response(JSON.stringify({ balance: user.balance }), { status: 200 });
    } catch (error) {
        console.error("Error updating balance:", error);
        return new Response(JSON.stringify({ message: "Failed to update balance" }), { status: 500 });
    }
}
