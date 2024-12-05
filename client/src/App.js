import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import CRUDPage from './pages/CRUD';
import BookDetail from './pages/BookDetail';
import CartPage from './pages/Cart';
import OrderPage from './pages/OrderPage';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/crud" exact element={<CRUDPage/>} />
          <Route path="/book/:bookId" element={<BookDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
