import jwt  from 'jsonwebtoken';
import User from '../models/user.model.js'; 

import dotenv from 'dotenv';
dotenv.config();

export const googleAuth = async (req, res)=>{
    try{
        const {name , email, avatar} = req.body;
        if(!email){
            return res.status(400).json({message: 'Email is required'});
        }

        const user = await User.findOne({ email });
        if(!user){
            const user = await User.create({ name, email, avatar });
        }
        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        // fix before production
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production 
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
        })

        return res.status(200).json(user);

    } catch(error){
        res.status(500).json({message: `Google Auth Error: ${error.message}`});
    }
}


// Logout user
export const logOut = async (req, res) => {
    try {
        return res.clearCookie('token',{
            httpOnly: true,
            secure: false, // Set to true in production 
            sameSite: 'strict'
        })
        
    } catch (error) {
        res.status(500).json({ message: `Logout Error: ${error.message}` });
    }
};