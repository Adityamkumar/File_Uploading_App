import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.route.js'
import fileRouter from './routes/fileUpload.route.js'
import shareFileRouter from './routes/shareFile.route.js'
import statsRoutes from './routes/stats.route.js'
import { globalErrorHandler } from './middlewares/error.middleware.js'
import cors from 'cors'

const app = express()
app.use(express.json()) 
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "https://droply-63.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman, curl, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true
  })
)
app.options(/.*/, cors());


app.get('/', (req, res)=>{
    setTimeout(()=>(res.send("Hello Server")), 4000)
})

//Auth Route
app.use('/api/auth',authRouter)

//file upload route
app.use('/api', fileRouter)

//share file route
app.use('/api', shareFileRouter)

//get fileStorage stats
app.use('/api', statsRoutes)

app.use(globalErrorHandler)






export default app