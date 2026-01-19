 import app from './src/app.js';
 import { configDotenv } from 'dotenv'
import db from './src/db/db.js';
configDotenv();

const PORT = process.env.PORT


app.listen(PORT, ()=>{
     console.log(`Sever is running on PORT: ${PORT}`)
})


