import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { changes, getAll,generateWebsite, getWebsiteById } from '../controllers/website.controllers.js';



const websiteRouter = express.Router();

websiteRouter.post('/generate',isAuth, generateWebsite);
websiteRouter.put(`/update/:id`,isAuth, changes);
websiteRouter.get(`/getById/:id`,isAuth, getWebsiteById);
websiteRouter.get(`/getAll`,isAuth, getAll);
websiteRouter.get(`/deploy/:id`,isAuth, deploy);




export default websiteRouter;