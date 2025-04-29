import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import book from '../models/Book.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();


router.post("/", protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        // upload the image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        // save to the database
        const newBook = new book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id, 
        });
        await newBook.save();
        res.status(201).json({
            message: "Book created successfully",
            book: {
                _id: newBook._id,
                title: newBook.title,
                caption: newBook.caption,
                rating: newBook.rating,
                image: newBook.image,
            },
        });

    } catch (error) {
        console.error("Error in book route", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
 });

 
 // Get all books
 // pagination => infinite loading
 router.get("/", protectRoute, async (req, res) => { 
    // example call from react native - frontend 
    // const response = await fetch('http://api.locolhost:3000/api/book?page=1&limit=5');
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await book.find()
        .sort({ createdAt: -1 })  //descending order
        .skip(skip)
        .limit(limit)
        .populate("user", "username porfileImage");



        const totalBooks = await book.countDocuments();
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil((await book.countDocuments()) / limit),
        });
    } catch (error) {
        console.error("Error in book route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// get recommended books by the logged in user
router.get("/recommended", protectRoute, async (req, res) => {
    try {
        const books = await book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        console.error("Error in book route", error);
        res.status(500).json({ message: "Internal server error" });
    }
}); 

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // check if the user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this book" });
        }

        // delete the image from cloudinary
        if(book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0]; // Extract public ID from URL
                await cloudinary.uploader.destroy(publicId);
                
            } catch (deleteError) {
                console.error("Error deleting image from Cloudinary:", deleteError);
                return res.status(500).json({ message: "Error deleting image from Cloudinary" });
                
            }
        }
        // delete the book from the database
        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error in book route", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
});

export default router;

