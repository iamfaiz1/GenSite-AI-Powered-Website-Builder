import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;



// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', //adjust later
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

// Routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// test
app.get('/', (req, res)=>{
    res.send('Hello World..server is running');
})


// Listening......
app.listen(port, () =>{
    console.log(`Server is running on: http://localhost:${port}`);
    connectDb();
} )