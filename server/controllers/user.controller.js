export const getCurrentUser = async (req, res)=>{
    try{
        if(!req.user){
            return res.json({user: null});
        }
        return res.json({user: req.user});
        
    }catch(error){
        res.status(500).json({message: `Get Current User Error: ${error.message}`});
    }
}