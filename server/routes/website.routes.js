import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { generateWebsite, getWebsiteById } from '../controllers/website.controllers.js';



const websiteRouter = express.Router();

websiteRouter.post('/generate',isAuth, generateWebsite);
websiteRouter.get(`/getById/:id`,isAuth, getWebsiteById);


export default websiteRouter;