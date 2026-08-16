import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {
    changes,
    getAll,
    generateWebsite,
    getWebsiteById,
    getWebsiteBySlug,
    deploy,
    deleteWebsiteById,
    makePrivate,
    makePublic,
    websiteRestore,
    moveToTrash,
    getAllInTrash,
    permanentDeleteAll,
    getPublicWebsites
} from '../controllers/website.controllers.js';



const websiteRouter = express.Router();

websiteRouter.post('/generate', isAuth, generateWebsite);
websiteRouter.put(`/update/:id`, isAuth, changes);
websiteRouter.get(`/getById/:id`, isAuth, getWebsiteById);
websiteRouter.get(`/getBySlug/:slug`, getWebsiteBySlug);
websiteRouter.get(`/getAll`, isAuth, getAll);
websiteRouter.get(`/getAllInTrash`, isAuth, getAllInTrash);
websiteRouter.get(`/deploy/:id`, isAuth, deploy);
websiteRouter.get(`/public`, getPublicWebsites);

websiteRouter.patch(`/make/:id/private`, isAuth, makePrivate);
websiteRouter.patch(`/make/:id/public`, isAuth, makePublic);
websiteRouter.patch(`/make/:id/delete`, isAuth, moveToTrash);
websiteRouter.patch(`/make/:id/restore`, isAuth, websiteRestore);

websiteRouter.delete(`/delete/:id`, isAuth, deleteWebsiteById);
websiteRouter.delete(`/deleteAll`, isAuth, permanentDeleteAll);


// ------------------------------------------------------------------------
// to update monogoDb data collections......

// import Website from '../models/website.model.js';
// websiteRouter.get("/migrate", async (req, res) => {
//     try {
//         const result = await Website.updateMany(
//             {
//                 deleted: { $exists: false }
//             },
//             {
//                 $set: {
//                     deleted: false
//                 }
//             }
//         );

//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });




export default websiteRouter;