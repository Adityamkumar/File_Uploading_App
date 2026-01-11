import mongoose from "mongoose";
import {configDotenv} from "dotenv";
configDotenv()

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)

const db = mongoose.connection;


db.on('connected',()=>{
    console.log("Connected to MongoDB Server...")
})

db.on('error',(err)=>{
    console.log("MongoDB connection error",err)
})

db.on('disconnected',()=>{
    console.log("MongoDB server disconnected..")
})

export default db;