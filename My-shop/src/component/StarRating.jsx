import React, { useState, useEffect } from 'react';
import "../Styles/style.css";

function StarRating({ staticRating }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rating = staticRating !== undefined ? staticRating : Math.floor(Math.random() * 11) / 2; 

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const totalStars = 5;

  const starStyle = { fontSize: isMobile ? "12px" : "18px", margin: "0 1px" };

  return (
    <div className="star-rating" style={{ display: 'flex', alignItems: 'center' }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-warning" style={starStyle}>&#9733;</span> 
      ))}
      {halfStar && <span className="text-warning" style={starStyle}>&#9733;</span>} 
      {[...Array(totalStars - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <span key={`empty-${i}`} className="text-warning" style={starStyle}>&#9734;</span> 
      ))}
    </div>
  );
};

export default StarRating;
