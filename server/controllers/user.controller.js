import {generateResponse} from '../config/openRouter.js'
import extractJson from '../utils/extractJson.js';



export const getCurrentUser = async (req, res)=>{
    try{
        if(!req.user){
            return res.json(null);
        }
        return res.json(req.user);
        
    }catch(error){
        res.status(500).json({message: `Get Current User Error: ${error.message}`});
    }
}

