import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = 'bebra';

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
    }),
    async (req, res) => {
        try {
          const displayName = req.user.name || "User";
          const email = req.user.email || "No email";
          const token = jwt.sign({ email: req.user.email, name: req.user.name }, JWT_SECRET, { expiresIn: '1h' });
          const redirectUrl = `http://localhost:3000/login?token=${encodeURIComponent(token)}&name=${encodeURIComponent(displayName)}&email=${encodeURIComponent(email)}`;
          res.redirect(redirectUrl);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

router.get('/logout', (req, res) => {
  try {
      res.status(200).json({ message: 'Logout successful.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error.' });
  }
});

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('http://localhost:3000/login');
};

router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    console.log("adaawffwa");

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("exists");
            return res.status(400).json({ error: 'User already exists.' });
        }

        const user = new User({
            name,
            email,
            phone,
            password,
        });

        await user.save();

        // Генерация токена
        const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully.', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isPasswordValid = password === user.password; 
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Генерация токена
        const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful.', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

export default router;
