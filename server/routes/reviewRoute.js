import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

const router = express.Router();


router.post('/', async (req, res) => {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Отсутствует токен' });
    }

    try {
       
        const decoded = jwt.verify(token, 'bebra'); 
        console.log('Декодированные данные пользователя:', decoded); 

        let { book, rating, comment } = req.body;
        console.log(req.body);

        const bookObj = await Book.findOne({ _id: book });

        if (!bookObj || !rating) {
            return res.status(400).json({ message: 'Необходимо указать книгу и рейтинг' });
        }
        book = bookObj;

        const user = await User.findOne({ email: decoded.email }); 
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

     
        const newReview = new Review({
            user: user._id,
            book,
            rating,
            comment
        });

     
        await newReview.save();

        return res.status(201).json({ message: 'Отзыв успешно добавлен', review: newReview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при добавлении отзыва' });
    }
});


router.get('/book/:bookId', async (req, res) => {
    const { bookId } = req.params; 

    try {
       
        const reviews = await Review.find({ book: bookId })
            .populate('user', 'email') 
            .populate('book', 'title') 
            .sort({ createdAt: -1 }); 

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'Отзывов для этой книги нет' });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ошибка при получении отзывов' });
    }
});


export default router;
