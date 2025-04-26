import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';




const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
}


router.post("/register", async (req , res) => {
    try{
        console.log("Register route hit");
        console.log(req.body);
        //check if user already exists
        const {email,username,password} = req.body;
        if (!email || !username || !password){
            return res.status(400).json({message: "Please fill in all fields"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        if(!username.length > 2){
            return res.status(400).json({message: "Username must be at least 3 characters"});
        }   

        //check if user already exists
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"});
        }   

        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message: "Username already exists"});
        }

        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
        

        //create new user
        const user = new User({
            email,
            username,
            password,
            profileImage,
        });
        
        
        await user.save();
        console.log("User created");
        const token = generateToken(user._id);
        console.log("Token generated");
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
        console.log("User saved");

    }catch(error){
        console.log("Error in register route", error);
        res.status(500).json({message: "Internal server error"});

    }
});

router.post("/login", async (req , res) => {
    res.send("login");
});

export default router;