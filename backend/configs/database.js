import { connect } from "mongoose";
const { MONGO_URL } = process.env;

async function connectDatabase() {
    try {
        await connect(MONGO_URL);
        console.log("Database connected✅");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDatabase;
