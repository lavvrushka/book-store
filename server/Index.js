import express from "express";
import cors from "cors";
import session from 'express-session';
import passport from './config/passport.js'; 
import connectDB from './config/db.js'; 
import authRoutes from './routes/authRoute.js'; 
import userRoutes from './routes/userRoute.js';
import bookRoutes from './routes/bookRoute.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoute.js';
import reviewRoutes from './routes/reviewRoute.js';

const app = express();
const PORT = 5000;

// Подключение к базе данных
await connectDB();

// Настройка CORS и парсинга JSON
app.use(cors());
app.use(express.json());

const slavonicSecret = 'bebra';

// Настройка сессий
app.use(session({
  secret: slavonicSecret,
  resave: false,
  saveUninitialized: false,
}));

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

// Использование маршрутов
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);


// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
