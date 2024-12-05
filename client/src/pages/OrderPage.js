import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderPage.css';

function OrderPage() {
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState({});
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setError('Для оформления заказа необходимо авторизоваться');
            return;
        }

        // Получение корзины пользователя
        axios.get('http://localhost:5000/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            setCartItems(response.data.items);
        })
        .catch(() => {
            setError('Ошибка при загрузке корзины');
        });

        // Получение всех заказов пользователя
        axios.get('http://localhost:5000/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            setOrders(response.data);
        })
        .catch(() => {
            setError('Ошибка при загрузке заказов');
        });
    }, []);

    const validateOrderForm = () => {
        const errors = {};
        if (!shippingAddress.trim()) errors.shippingAddress = 'Адрес доставки обязателен';
        if (!paymentMethod.trim()) errors.paymentMethod = 'Способ оплаты обязателен';
        if (cartItems.length === 0) errors.cartItems = 'Корзина пуста';
        return errors;
    };

    const validateReview = (orderId, bookId) => {
        const reviewData = reviews[orderId]?.[bookId] || {};
        const errors = {};
        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            errors.rating = 'Оценка должна быть в пределах от 1 до 5';
        }
        if (!reviewData.comment || reviewData.comment.trim().length < 10) {
            errors.comment = 'Комментарий должен быть не менее 10 символов';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateOrderForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        const token = localStorage.getItem('jwt');
        const orderData = {
            shippingAddress,
            paymentMethod,
            items: cartItems.map(item => ({
                book: item.book._id,
                quantity: item.quantity,
            })),
            totalPrice: cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0),
        };

        axios.post('http://localhost:5000/api/orders', orderData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            setOrderSuccess(true);
            setShippingAddress('');
            setPaymentMethod('');
            setCartItems([]);
        })
        .catch(() => {
            setError('Ошибка оформления заказа');
        });
    };

    const handleReviewChange = (orderId, bookId, e) => {
        const { name, value } = e.target;
        setReviews(prevReviews => ({
            ...prevReviews,
            [orderId]: {
                ...prevReviews[orderId],
                [bookId]: {
                    ...prevReviews[orderId]?.[bookId],
                    [name]: value,
                },
            },
        }));
    };

    const handleSubmitReview = (orderId, bookId) => {
        const reviewErrors = validateReview(orderId, bookId);
        if (Object.keys(reviewErrors).length > 0) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [`${orderId}-${bookId}`]: reviewErrors,
            }));
            return;
        }

        const token = localStorage.getItem('jwt');
        const reviewPayload = {
            book: bookId,
            rating: reviews[orderId]?.[bookId]?.rating,
            comment: reviews[orderId]?.[bookId]?.comment,
        };

        axios.post('http://localhost:5000/api/reviews', reviewPayload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            alert('Отзыв оставлен');
            setReviews(prevReviews => ({
                ...prevReviews,
                [orderId]: {
                    ...prevReviews[orderId],
                    [bookId]: { rating: '', comment: '' },
                },
            }));
        })
        .catch(() => {
            setError('Ошибка при отправке отзыва');
        });
    };

    return (
        <div className="order-page-container">
            <h1>Оформление заказа</h1>
            {error && <p className="order-page-error">{error}</p>}
            {orderSuccess && <p className="order-page-success">Заказ успешно оформлен!</p>}

            <form onSubmit={handleSubmit} className="order-form">
                <label>
                    Адрес доставки:
                    <input 
                        type="text" 
                        value={shippingAddress} 
                        onChange={(e) => setShippingAddress(e.target.value)} 
                    />
                    {formErrors.shippingAddress && <p className="error">{formErrors.shippingAddress}</p>}
                </label>
                <br />
                <label>
                    Способ оплаты:
                    <input 
                        type="text" 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                    {formErrors.paymentMethod && <p className="error">{formErrors.paymentMethod}</p>}
                </label>
                <br />
                <button type="submit">Оформить заказ</button>
                {formErrors.cartItems && <p className="error">{formErrors.cartItems}</p>}
            </form>

            <h2>Корзина</h2>
            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p>Корзина пуста.</p>
                ) : (
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.book._id}>
                                <p>{item.book.title}</p>
                                <p>Количество: {item.quantity}</p>
                                <p>Цена: {item.book.price} руб.</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <h2>Мои заказы</h2>
            <div className="orders-list">
                {orders.length === 0 ? (
                    <p>У вас нет заказов.</p>
                ) : (
                    <ul>
                        {orders.map((order) => (
                            <li key={order._id}>
                                <p><strong>Заказ №{order._id}</strong></p>
                                <p>Адрес доставки: {order.shippingAddress}</p>
                                <p>Способ оплаты: {order.paymentMethod}</p>
                                <p>Общая стоимость: {order.totalPrice} руб.</p>
                                <ul className="order-item">
                                    {order.items.map((item) => (
                                        <li key={item.book}>
                                            <p>{item.book.title} (x{item.quantity})</p>
                                            <div>
                                                <label>Оценка (1-5):</label>
                                                <input 
                                                    type="number" 
                                                    name="rating" 
                                                    value={reviews[order._id]?.[item.book]?.rating || ''} 
                                                    onChange={(e) => handleReviewChange(order._id, item.book, e)}
                                                    min="1" 
                                                    max="5"
                                                />
                                                {formErrors[`${order._id}-${item.book}`]?.rating && (
                                                    <p className="error">{formErrors[`${order._id}-${item.book}`].rating}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label>Комментарий:</label>
                                                <textarea
                                                    name="comment"
                                                    value={reviews[order._id]?.[item.book]?.comment || ''}
                                                    onChange={(e) => handleReviewChange(order._id, item.book, e)}
                                                />
                                                {formErrors[`${order._id}-${item.book}`]?.comment && (
                                                    <p className="error">{formErrors[`${order._id}-${item.book}`].comment}</p>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => handleSubmitReview(order._id, item.book)}
                                            >
                                                Оставить отзыв
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default OrderPage;
