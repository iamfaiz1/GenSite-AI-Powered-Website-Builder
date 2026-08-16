import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import websiteRouter from './routes/website.routes.js';
import paymentRouter from './routes/payment.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8000;



// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        process.env.FRONTEND_URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
}))

// Routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use('/api', paymentRouter);

// test
app.get('/', (req, res)=>{
    res.send('Hello World..server is running');
})


// Listening......
app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`);
    connectDb();
} )