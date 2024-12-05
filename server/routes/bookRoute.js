import express from 'express';
import Book from '../models/Book.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const book = await Book.findById(id); 
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


router.post(
    '/',
    authenticateToken, 
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('author').not().isEmpty().withMessage('Author is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('stock').isNumeric().withMessage('Stock must be a number'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, author, genre, description, price, stock, coverImage, publishedYear, publisher } = req.body;

        try {
            const newBook = new Book({
                title,
                author,
                genre,
                description,
                price,
                stock,
                coverImage,
                publishedYear,
                publisher,
            });

            await newBook.save(); 
            res.status(201).json(newBook); 
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
);


router.put(
    '/:id',
    authenticateToken, 
    async (req, res) => {
        const { id } = req.params;
        const { title, author, genre, description, price, stock, coverImage, publishedYear, publisher } = req.body;

        try {
            const updatedBook = await Book.findByIdAndUpdate(
                id,
                { title, author, genre, description, price, stock, coverImage, publishedYear, publisher, updatedAt: Date.now() },
                { new: true } 
            );

            if (!updatedBook) {
                return res.status(404).json({ error: 'Book not found' });
            }

            res.json(updatedBook); 
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
);


router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;
