import mongoose from "mongoose";

export async function connectDb() {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/RecruitX";
        if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
            console.log("DB Warning: MONGODB_URI is not set to a valid mongodb:// or mongodb+srv:// URI");
            return;
        }
        await mongoose.connect(uri);
    } catch (Error) {
        console.log("DB Error: " + Error.message);
    }
}