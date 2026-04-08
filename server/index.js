import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// test
app.get('/', (req, res)=>{
    res.send('Hello World..server is running');
})


app.listen(port, () =>{
    console.log(`Server is running on: http://localhost:${port}`);
    connectDb();
} )