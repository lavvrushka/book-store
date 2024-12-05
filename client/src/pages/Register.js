import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const user = { name, email, password, phone };

        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Registration failed');
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem('jwt', data.token);
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Registration failed.');
            });
    };

    return (
        <div className="register">
            <form onSubmit={handleFormSubmit}>
                <h2>Register</h2>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <button className='register-button' type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
