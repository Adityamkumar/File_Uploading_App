 import apminsight from 'apminsight';
 import app from './src/app.js';
 import { configDotenv } from 'dotenv'
import connectDB from './src/db/db.js';
configDotenv();

const PORT = process.env.PORT

connectDB()

app.listen(PORT, ()=>{
     console.log(`Sever is running on PORT: ${PORT}`)
})


