import express from 'express';
import User from '../models/User.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { body, validationResult } from 'express-validator';


const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
    try {
    
        console.log("mocha" + req.user.name + req.user.email);
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(user.phone)
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put(
    '/profile',
    [
        authenticateToken,
        body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('phone').isMobilePhone().withMessage('Invalid phone number'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone } = req.body;
        
        try {
            const updatedUser = await User.findOneAndUpdate(
                { email: req.user.email },
                { name, email, phone },
                { new: true, runValidators: true }
            );
            
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

export default router;