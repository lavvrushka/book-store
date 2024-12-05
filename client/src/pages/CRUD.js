import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CRUDPage.module.css';

const CRUDPage = () => {
    const [books, setBooks] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        price: 0,
        stock: 0,
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        setIsAuthenticated(!!token);
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error.message);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Название обязательно';
        if (!formData.author.trim()) errors.author = 'Автор обязателен';
        if (!formData.genre.trim()) errors.genre = 'Жанр обязателен';
        if (formData.price <= 0) errors.price = 'Цена должна быть больше нуля';
        if (formData.stock < 0) errors.stock = 'Количество не может быть отрицательным';
        return errors;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrEditBook = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return; 

        const token = localStorage.getItem('jwt');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (currentBook) {
                await axios.put(`http://localhost:5000/api/books/${currentBook._id}`, formData, { headers });
                setCurrentBook(null);
            } else {
                await axios.post('http://localhost:5000/api/books', formData, { headers });
            }
            setFormData({ title: '', author: '', genre: '', description: '', price: 0, stock: 0 });
            fetchBooks();
        } catch (error) {
            console.error('Error saving book:', error.response?.data || error.message);
        }
    };

    const handleDeleteBook = async (id) => {
        const token = localStorage.getItem('jwt');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`, { headers });
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error.response?.data || error.message);
        }
    };

    const handleEditClick = (book) => {
        setCurrentBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre,
            description: book.description,
            price: book.price,
            stock: book.stock,
        });
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

   
    const formatDateUTC = (dateString) => {
        const date = new Date(dateString);
        return date.toUTCString();
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Список книг</h1>
            <ul className={styles.list}>
                {books.map((book) => (
                    <li className={styles.item} key={book._id}>
                        <strong>{book.title}</strong> — {book.author} ({book.genre})
                        <p><strong>Дата добавления (локальное время):</strong> {formatDate(book.createdAt)}</p>
                        <p><strong>Дата добавления (UTC):</strong> {formatDateUTC(book.createdAt)}</p>
                        {isAuthenticated && (
                            <>
                                <button className={styles.button} onClick={() => handleEditClick(book)}>
                                    Редактировать
                                </button>
                                <button className={styles.button} onClick={() => handleDeleteBook(book._id)}>
                                    Удалить
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {isAuthenticated && (
                <div>
                    <h2 className={styles.subtitle}>
                        {currentBook ? 'Редактировать книгу' : 'Добавить книгу'}
                    </h2>
                    <form className={styles.form} onSubmit={handleAddOrEditBook}>
                        <input
                            className={styles.input}
                            type="text"
                            name="title"
                            placeholder="Название"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        {formErrors.title && <p className={styles.error}>{formErrors.title}</p>}
                        <input
                            className={styles.input}
                            type="text"
                            name="author"
                            placeholder="Автор"
                            value={formData.author}
                            onChange={handleInputChange}
                            required
                        />
                        {formErrors.author && <p className={styles.error}>{formErrors.author}</p>}
                        <input
                            className={styles.input}
                            type="text"
                            name="genre"
                            placeholder="Жанр"
                            value={formData.genre}
                            onChange={handleInputChange}
                            required
                        />
                        {formErrors.genre && <p className={styles.error}>{formErrors.genre}</p>}
                        <textarea
                            className={styles.textarea}
                            name="description"
                            placeholder="Описание"
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                        <input
                            className={styles.input}
                            type="number"
                            name="price"
                            placeholder="Цена"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                        {formErrors.price && <p className={styles.error}>{formErrors.price}</p>}
                        <input
                            className={styles.input}
                            type="number"
                            name="stock"
                            placeholder="Количество"
                            value={formData.stock}
                            onChange={handleInputChange}
                            required
                        />
                        {formErrors.stock && <p className={styles.error}>{formErrors.stock}</p>}
                        <button className={styles.submitButton} type="submit">
                            {currentBook ? 'Сохранить изменения' : 'Добавить'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CRUDPage;
