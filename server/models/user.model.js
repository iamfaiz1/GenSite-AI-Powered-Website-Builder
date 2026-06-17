import mongoose from 'mongoose';

// User Model
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    avatar:{
        type: String,
    },
    credits:{
        type: Number,
        default: 10,
        min: 0
    },
    plan:{
        type: String,
        default: 'free'
    },

}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;