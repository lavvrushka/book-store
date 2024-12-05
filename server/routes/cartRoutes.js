
import express from 'express';
import Cart from '../models/Cart.js';
import authenticateToken from '../middleware/authenticateToken.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Отсутствует токен' });
    }

    try {
       
        const decoded = jwt.verify(token, 'bebra'); 
        const email = decoded.email; 

       
        const user = await User.findOne({ email: email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const userId = user._id;  

      
        let cart = await Cart.findOne({ user: userId }).populate('items.book');
        
    
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],  
            });
            await cart.save(); 
        }

        res.json(cart);  
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Неверный или просроченный токен' });
    }
});


// Добавление товара в корзину
router.post('/', authenticateToken, async (req, res) => {
    const authHeader = req.headers['authorization']; // Получаем токен из заголовка запроса
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем сам токен (формат: Bearer <token>)

    if (!token) {
        return res.status(401).json({ message: 'Отсутствует токен' });
    }

    try {
        // Расшифровываем токен и получаем данные пользователя (включая email)
        const decoded = jwt.verify(token, 'bebra'); // Здесь 'bebra' — это секретный ключ, который вы используете для подписи токенов
        const email = decoded.email; // Предполагаем, что email был добавлен в payload токена

        // Находим пользователя по email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const userId = user._id;  // Получаем id пользователя

        // Извлекаем данные товара из тела запроса
        const { bookId, quantity } = req.body;  // bookId и quantity должны передаваться в теле запроса

        if (!bookId || !quantity) {
            return res.status(400).json({ message: 'Недостаточно данных для добавления товара в корзину' });
        }

        // Ищем корзину пользователя
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Если корзина существует, обновляем её
            const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);

            if (itemIndex > -1) {
                // Если книга уже в корзине, увеличиваем количество
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Если книги нет в корзине, добавляем её
                cart.items.push({ book: bookId, quantity });
            }

            await cart.save();  // Сохраняем обновленную корзину
            return res.status(200).json(cart);  // Возвращаем обновленную корзину
        } else {
            // Если корзины нет, создаём новую
            const newCart = new Cart({
                user: userId,
                items: [{ book: bookId, quantity }],
            });

            await newCart.save();  // Сохраняем новую корзину
            return res.status(201).json(newCart);  // Возвращаем новую корзину
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка добавления товара в корзину' });  // Обрабатываем ошибки
    }
});



// Удаление товара из корзины по ID книги
router.delete('/:bookId', authenticateToken, async (req, res) => {
    const authHeader = req.headers['authorization']; // Получаем токен из заголовка запроса
    const token = authHeader && authHeader.split(' ')[1]; // Извлекаем сам токен (формат: Bearer <token>)

    if (!token) {
        return res.status(401).json({ message: 'Отсутствует токен' });
    }

    try {
        // Расшифровываем токен и получаем данные пользователя (включая email)
        const decoded = jwt.verify(token, 'bebra'); // Здесь 'bebra' — это секретный ключ, который вы используете для подписи токенов
        const email = decoded.email; // Предполагаем, что email был добавлен в payload токена

        // Находим пользователя по email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const userId = user._id;  // Получаем id пользователя

        // Извлекаем данные товара из параметров запроса
        const { bookId } = req.params;  // Получаем bookId из URL

        if (!bookId) {
            return res.status(400).json({ message: 'Не указан идентификатор книги для удаления' });
        }

        // Ищем корзину пользователя
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            // Находим индекс товара в корзине
            const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Товар не найден в корзине' });
            }

            // Удаляем товар из корзины
            cart.items.splice(itemIndex, 1);

            await cart.save();  // Сохраняем обновленную корзину
            return res.status(200).json(cart);  // Возвращаем обновленную корзину
        } else {
            return res.status(404).json({ message: 'Корзина не найдена' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при удалении товара из корзины' });  // Обрабатываем ошибки
    }
});




export default router;
