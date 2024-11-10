import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function POST(req) {
    await dbConnect();

    const { userId, amount } = await req.json();

    try {
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        if (user.balance < amount) {
            return new Response(JSON.stringify({ message: "Insufficient funds" }), { status: 400 });
        }

        user.balance -= amount; // Deduct the amount
        await user.save();

        return new Response(JSON.stringify({ message: "Withdrawal successful", balance: user.balance }), { status: 200 });
    } catch (error) {
        console.error("Error during withdrawal:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
