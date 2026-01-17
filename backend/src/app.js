import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.route.js'
import fileRouter from './routes/fileUpload.route.js'
import shareFileRouter from './routes/shareFile.route.js'
import { globalErrorHandler } from './middlewares/error.middleware.js'
import cors from 'cors'

const app = express()
app.use(express.json()) 
app.use(express.urlencoded({ extended: true}))

app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true
}))

app.use(cookieParser())

app.get('/', (req, res)=>{
    res.send("Hello Server")
})

//Auth Route
app.use('/api/auth',authRouter)

//file upload route
app.use('/api', fileRouter)

//share file route
app.use('/api', shareFileRouter)


app.use(globalErrorHandler)






export default app