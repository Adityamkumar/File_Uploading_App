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
app.use(cookieParser())

const isProd = process.env.NODE_ENV === "production";

const allowedOrigins = isProd
  ? [process.env.CLIENT_URL_PROD]
  : [process.env.CLIENT_URL_DEV];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

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