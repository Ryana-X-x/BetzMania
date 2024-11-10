import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
    if (connection.isConnected) {
        // If already connected, do nothing
        return;
    }

    // Connect to MongoDB
    const db = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Update the connection status
    connection.isConnected = db.connection.readyState; // Correctly access readyState
}

export default dbConnect;
