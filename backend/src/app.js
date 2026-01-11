import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.route.js'
import fileRouter from './routes/fileUpload.route.js'
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res)=>{
    res.send("Hello Server")
})

//Auth Route
app.use('/api/auth', authRouter)

//file upload route
app.use('/api', fileRouter)






export default app