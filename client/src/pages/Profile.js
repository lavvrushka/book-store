import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile from the server
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile.');
      }

      const data = await response.json();
      setUser(data);
      setFormData({ name: data.name, email: data.email, phone: data.phone });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile.');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setFormData({ name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email address.';
    }
    if (!formData.phone.match(/^\+?[1-9]\d{1,14}$/)) {
      newErrors.phone = 'Invalid phone number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = () => {
    if (validateForm()) {
      updateUserProfile();
    }
  };

  // Reset form on cancel
  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({ name: user.name, email: user.email, phone: user.phone });
    }
    setErrors({});
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-info">
        <div className="form-group">
          <label>Name:</label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error-input' : ''}
              />
              {errors.name && <small className="error-text">{errors.name}</small>}
            </>
          ) : (
            <span>{user.name}</span>
          )}
        </div>
        <div className="form-group">
          <label>Email:</label>
          {isEditing ? (
            <>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </>
          ) : (
            <span>{user.email}</span>
          )}
        </div>
        <div className="form-group">
          <label>Phone:</label>
          {isEditing ? (
            <>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error-input' : ''}
              />
              {errors.phone && <small className="error-text">{errors.phone}</small>}
            </>
          ) : (
            <span>{user.phone}</span>
          )}
        </div>
      </div>
      <div className="profile-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
