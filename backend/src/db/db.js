import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

// const mongoUrl = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
     const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error:", error);
  }
};

export default connectDB;
