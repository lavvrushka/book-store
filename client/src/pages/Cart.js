import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Загружаем данные корзины
        const token = localStorage.getItem('jwt');
        if (!token) {
            alert('Для просмотра корзины необходимо авторизоваться');
            return;
        }

        fetch('http://localhost:5000/api/cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки корзины');
            }
            return response.json();
        })
        .then((data) => setCartItems(data.items)) // Получаем товары из корзины
        .catch((err) => setError(err.message));
    }, []);

    const handleRemoveFromCart = (bookId) => {
        const token = localStorage.getItem('jwt');
        fetch(`http://localhost:5000/api/cart/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                setCartItems((prevItems) => prevItems.filter(item => item.book._id !== bookId)); // Удаляем товар из списка
                alert('Товар удален из корзины');
            } else {
                alert('Ошибка при удалении товара из корзины');
            }
        })
        .catch((error) => {
            console.error('Ошибка при удалении товара из корзины:', error);
            alert('Ошибка при удалении товара из корзины');
        });
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="cart-page">
            <h1>Ваша корзина</h1>

            {cartItems.length === 0 ? (
                <p>Корзина пуста. Перейдите в каталог и добавьте товары.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.book._id} className="cart-item">
                            <div className="cart-item-info">
                                <h2>{item.book.title}</h2>
                                <p><strong>Автор:</strong> {item.book.author}</p>
                                <p><strong>Цена:</strong> {item.book.price} руб.</p>
                                <p><strong>Количество:</strong> {item.quantity}</p>
                            </div>
                            <button onClick={() => handleRemoveFromCart(item.book._id)} className="btn-remove">Удалить</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="cart-actions">
            <Link to="/order" className="btn-order">Перейти к заказам</Link>
            </div>
        </div>
    );
};

export default CartPage;
