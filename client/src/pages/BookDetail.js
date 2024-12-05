import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Для получения параметров маршрута
import './BookDetail.css';

const BookDetail = () => {
    const { bookId } = useParams(); // Получаем параметр ID книги из URL
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Проверка авторизации
    const [isInCart, setIsInCart] = useState(false); // Проверка, добавлен ли товар в корзину
    const [reviews, setReviews] = useState([]); // Состояние для хранения отзывов

    useEffect(() => {
        // Проверка авторизации (например, по токену в localStorage)
        const token = localStorage.getItem('jwt');
        setIsAuthenticated(!!token); // Если токен есть, пользователь авторизован

        // Загружаем данные о книге
        fetch(`http://localhost:5000/api/books/${bookId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных о книге');
                }
                return response.json();
            })
            .then((data) => setBook(data))
            .catch((err) => setError(err.message));

        // Загружаем отзывы для книги
        fetch(`http://localhost:5000/api/reviews/book/${bookId}`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setReviews(data); // Если данные - массив, сохраняем их
                } else {
                    console.error('Ожидался массив, получен другой формат:', data);
                    setReviews([]); // Если формат неверный, устанавливаем пустой массив
                }
            })
            .catch((err) => console.error('Ошибка загрузки отзывов:', err));
    }, [bookId]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            alert('Для добавления в корзину необходимо авторизоваться');
            return;
        }

        const token = localStorage.getItem('jwt');
        fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bookId, quantity: 1 }),
        })
            .then((response) => {
                if (response.ok) {
                    setIsInCart(true);
                    alert('Товар добавлен в корзину!');
                } else {
                    alert('Ошибка при добавлении товара в корзину');
                }
            })
            .catch((error) => {
                console.error('Ошибка при добавлении товара в корзину:', error);
                alert('Ошибка при добавлении товара в корзину');
            });
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating); // Полные звезды
        const halfStar = rating % 1 !== 0; // Половинка звезды
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Пустые звезды

        return (
            <>
                {Array(fullStars).fill('★').map((star, index) => (
                    <span key={`full-${index}`} className="star full">{star}</span>
                ))}
                {halfStar && <span className="star half">☆</span>}
                {Array(emptyStars).fill('☆').map((star, index) => (
                    <span key={`empty-${index}`} className="star empty">{star}</span>
                ))}
            </>
        );
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!book) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="book-detail">
            <h1>{book.title}</h1>
            <p><strong>Автор:</strong> {book.author}</p>
            <p><strong>Жанр:</strong> {book.genre}</p>
            <p><strong>Описание:</strong> {book.description}</p>
            <p><strong>Цена:</strong> {book.price} руб.</p>
            <p><strong>Количество в наличии:</strong> {book.stock}</p>

            {isAuthenticated && !isInCart && (
                <button onClick={handleAddToCart} className="btn-buy">Купить</button>
            )}

            {isInCart && <p>Товар уже в корзине</p>}

            <h2>Отзывы</h2>
            {reviews.length === 0 ? (
                <p>Нет отзывов для этой книги.</p>
            ) : (
                <ul>
                    {reviews.map((review) => (
                        <li key={review._id}>
                            <p>
                                <strong>Рейтинг:</strong> {renderStars(review.rating)}
                            </p>
                            <p>{review.comment}</p>
                            <p><strong>Автор отзыва:</strong> {review.user?.email || 'Аноним'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookDetail;
