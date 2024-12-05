import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Catalog.css';

const Catalog = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('priceAsc');
    const [searchQuery, setSearchQuery] = useState('');
    const [formError, setFormError] = useState(''); // Состояние для ошибок валидации

    useEffect(() => {
        fetch('http://localhost:5000/api/books')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                return response.json();
            })
            .then((data) => {
                setBooks(data);
                setFilteredBooks(data);
            })
            .catch((err) => setError(err.message));
    }, []);

    const sortBooks = (books, sortOption) => {
        switch (sortOption) {
            case 'priceAsc':
                return [...books].sort((a, b) => a.price - b.price);
            case 'priceDesc':
                return [...books].sort((a, b) => b.price - a.price);
            case 'alphaAsc':
                return [...books].sort((a, b) => a.title.localeCompare(b.title));
            case 'alphaDesc':
                return [...books].sort((a, b) => b.title.localeCompare(a.title));
            default:
                return books;
        }
    };

    const filterBooks = (books, query) => {
        if (!query) return books;
        return books.filter((book) =>
            book.title.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;

        // Валидация поиска: не допускаем цифры или спецсимволы
        const isValid = /^[a-zA-Zа-яА-Я\s]*$/.test(query);
        if (!isValid) {
            setFormError('Поисковый запрос должен содержать только буквы и пробелы');
            return;
        }

        setFormError(''); // Очищаем ошибку, если данные валидны
        setSearchQuery(query);
        const filtered = filterBooks(books, query);
        setFilteredBooks(filtered);
    };

    if (error) {
        return <p className="error">{error}</p>;
    }

    const sortedBooks = sortBooks(filteredBooks, sortOption);

    return (
        <div className="catalog">
            <h1>Books</h1>

            <div className="catalog-header">
                {/* Поле для поиска */}
                <div className="search">
                    <label htmlFor="search">Поиск по названию:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Введите название книги..."
                    />
                    {formError && <p className="form-error">{formError}</p>} {/* Отображаем ошибку */}
                </div>

                {/* Селектор сортировки */}
                <div className="sort-options">
                    <label htmlFor="sort">Сортировать по:</label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="priceAsc">Цене (по возрастанию)</option>
                        <option value="priceDesc">Цене (по убыванию)</option>
                        <option value="alphaAsc">Алфавиту (A-Z)</option>
                        <option value="alphaDesc">Алфавиту (Z-A)</option>
                    </select>
                </div>
            </div>

            <div className="book-list">
                {sortedBooks.length > 0 ? (
                    sortedBooks.map((book) => (
                        <div className="book-card" key={book._id}>
                            <h2>{book.title}</h2>
                            <p>Автор: {book.author}</p>
                            <p>Цена: {book.price} руб.</p>
                            <p>{book.description}</p>
                            <Link to={`/book/${book._id}`} className="view-details-link">
                                Подробнее
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="no-results">Книги не найдены</p>
                )}
            </div>
        </div>
    );
};

export default Catalog;
