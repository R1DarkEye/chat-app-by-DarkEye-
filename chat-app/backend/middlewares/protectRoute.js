import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    const token = req.cookies.token
try{
    if(!token){
        return res.status(401).json({message:'Not  authorized, protected route'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded).select('-password')
    if (!user) {
        return res.status(401).json({message:'Not  authorized, protected route'})
    }
    req.user = user
    next()
}catch{
    return res.status(401).json({message:'Not authorized, protected route'})
}
}