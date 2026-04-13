import express from 'express';
import isAuth from '../middleware/isAuth.js';

const userRouter = express.Router();

userRouter.get('/me',isAuth, getCurrentUser);

export default userRouter;