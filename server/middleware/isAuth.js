import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next)=>{
    try{
        const token = req.cokies.token
        if(!token){
            return res.status(401).json({message: 'token not found'});
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET); 
        req.user = await User.findById(decoded.id)
        next();
        
    }catch(err){
        return res.status(500).json({message: 'invalid token error'});
    }
    
}

export default isAuth;