import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const mongoUrl = process.env.MONGODB_URI;

const db = async () => {
  try {
    const connection = await mongoose.connect(mongoUrl);
    console.log(
      `\n MongoDB connected !!  DB HOST: ${connection.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB connection error:", error);
    process.exit(1);
  }
};

export default db;
