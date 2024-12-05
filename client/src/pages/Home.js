import React from 'react';
import './Home.css';
import WeatherComponent from '../components/weathercomp';
import CatFacts from '../components/CatFacts';

const Home = () => {
    const currentDate = new Date();

    
    const formattedDate = currentDate.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    
    const utcDate = currentDate.toUTCString();

    
    const tableDateLocal = new Date().toLocaleString('en-US', { timeZone }); 
    const tableDateUTC = new Date().toUTCString(); 

    console.log('Home component loaded');
    return (
        <div className="home">
            <h2>Welcome to the Bookstore</h2>
            <p>Explore our vast collection of books and find your next favorite read.</p>
            <p>Discover genres from fiction to non-fiction, and everything in between.</p>
            
            <div className="date-time-info">
                <p><strong>Current Date:</strong> {formattedDate}</p>
                <p><strong>Time Zone:</strong> {timeZone}</p>
                <p><strong>Current Date in UTC:</strong> {utcDate}</p>
                <p><strong>Date for Table (Local Time Zone):</strong> {tableDateLocal}</p>
                <p><strong>Date for Table (UTC):</strong> {tableDateUTC}</p>
            </div>

            <WeatherComponent/>
            <CatFacts/>
        </div>
    );
};

export default Home;
