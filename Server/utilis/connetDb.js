import mongoose from "mongoose";

export async function connectDb() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
    } catch (Error) {
        console.log("DB Error: " + Error.message);
    }
}