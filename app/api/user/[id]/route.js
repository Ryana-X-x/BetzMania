import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function GET(req, { params }) {
    await dbConnect();

    const { id } = params;
    console.log("Fetching user with ID:", id); 

    if (!id) {
        console.error("No ID provided"); 
        return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found for ID:", id);
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        console.log("User found:", user);
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);  
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
