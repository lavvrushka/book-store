import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'; 

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

        const { shippingAddress, paymentMethod, totalPrice } = req.body;

        if (!shippingAddress || !paymentMethod || !totalPrice) {
            return res.status(400).json({ message: 'Отсутствуют данные для оформления заказа' });
        }
        const user = await User.findOne({ email: decoded.email });
        const userId = user._id;

        console.log(userId);

        const cart = await Cart.findOne({ user: userId });
        console.log('Корзина пользователя:', cart); 

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Корзина пуста' });
        }


        const order = new Order({
            user: userId,
            shippingAddress,
            paymentMethod,
            items: cart.items,
            totalPrice,
            status: 'Pending',
        });

        await order.save();


        cart.items = [];
        await cart.save();

        res.status(201).json(order);  
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при оформлении заказа' });
    }
});


router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Отсутствует токен' });
    }

    try {
     
        const decoded = jwt.verify(token, 'bebra');
        console.log('Декодированные данные пользователя:', decoded); 
        const user = await User.findOne({ email: decoded.email });
        const userId = user._id;

        const orders = await Order.find({ user: userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Заказы не найдены' });
        }

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при получении заказов' });
    }
});



export default router;
