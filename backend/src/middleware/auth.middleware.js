import jwt from 'jsonwebtoken';
import User from '../models/User.js';


// const response = await fetch('http://api.locolhost:3000/api/book', {
//     method: 'POST',
//     body: JSON.stringify({
//         title: "Book Title",
//         caption: "Book Caption",
//         rating: 
//         image: "http://example.com/image.jpg"
//     }),
//     headers: {
//         Authorization: `Bearer ${token}`
//     },    
// });


const protectRoute = async (req, res, next) => {
    try {
        // get token 
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "No authentication token , access denied" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "Token is not valid" });
        }

        req.user = user; 
        next(); 
        
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ message: "Internal server error" });
    }
};

export default protectRoute;