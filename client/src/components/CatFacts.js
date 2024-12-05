import React, { useEffect, useState } from 'react';
import './CatFacts.css'; 

const CatFacts = () => {
    const [fact, setFact] = useState(null); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchCatFact = async () => {
            try {
                const response = await fetch('https://catfact.ninja/fact');
                if (!response.ok) {
                    throw new Error('Failed to fetch cat fact');
                }

                const data = await response.json();
                setFact(data.fact); 
            } catch (err) {
                setError(err.message); 
            }
        };

        
        fetchCatFact();
    }, []); 

    return (
        <div className="cat-facts">
            <h3>Random Cat Fact</h3>
            {error ? (
                <p className="error">Error: {error}</p>
            ) : fact ? (
                <p>{fact}</p>
            ) : (
                <p>Loading cat fact...</p>
            )}
        </div>
    );
};

export default CatFacts;
