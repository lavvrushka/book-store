# MERN Bookstore Application

## Overview

This project is a **Bookstore Application** developed using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). The application provides a fully functional web platform to manage a catalog of books with features for both authorized and unauthorized users.

Key functionalities include user authentication, CRUD operations, and integration with third-party APIs. The project emphasizes the use of modern JavaScript libraries and frameworks while following best practices for full-stack web development.

---

## Features

### General
- **Responsive Design**: A user-friendly and visually appealing interface using custom CSS.
- **Dynamic Time Zone Support**: Displays the current time and time zone for the user, along with the UTC timestamps for book records.
- **Data Validation**: Forms are validated on both the client and server sides.

### For Unauthorized Users
- View the book catalog with detailed information.
- Search and sort books by title, author, genre, or price.
- Access the login page to authenticate and gain additional permissions.

### For Authorized Users
- Perform **CRUD operations** (Create, Read, Update, Delete) on book records.
- Manage book stock, prices, and descriptions through React forms.
- Search and sort the catalog using advanced filtering options.

### Authentication
- Login using **email/password**.
- Support for OAuth authentication through **Google** and **Facebook** accounts.

### Data Management
- Uses **MongoDB** as the database, accessed and managed via Mongoose ORM.
- Populates the database with sample book data for demonstration purposes.

### Third-Party API Integration
- Weather API: Displays the current weather information for the user's location.
- Cat Facts API: Fetches and displays random facts about cats for user engagement.

### Components
- Built with a combination of **functional components**, **class components**, and **arrow functions**.
- Demonstrates the use of **props**, default values, event handling, and state management.
- Utilizes **React hooks** (e.g., `useState`, `useEffect`) to manage component lifecycle and data updates.

### Navigation
- Includes at least **four pages**:
  - **Home**: Overview of the application and latest updates.
  - **Catalog**: Displays the list of books with filtering and sorting options.
  - **Book Details**: Shows detailed information about a selected book.
  - **Admin Panel**: Provides authorized users with forms to manage book records.
- Navigation between pages is implemented with React's **React Router**.

---

## Technologies Used

### Frontend
- **React.js**: For building the user interface.
- **React Router**: For navigation between pages.
- **Custom CSS**: For styling and layout.

### Backend
- **Node.js**: Server-side runtime environment.
- **Express.js**: Web framework for building APIs and handling requests.
- **Mongoose**: For schema-based data modeling and database interactions.

### Database
- **MongoDB**: NoSQL database for storing book data and user credentials.

### APIs
- **Weather API**: For displaying real-time weather information.
- **Cat Facts API**: For generating fun and engaging content.

---

## Setup Instructions

### Prerequisites
1. Install **Node.js** and **npm**.
2. Install **MongoDB** and ensure it's running locally or provide a connection string to a remote instance.
