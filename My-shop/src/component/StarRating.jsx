import React, { useState, useEffect } from 'react';
import "../Styles/style.css";

function StarRating({ staticRating }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use provided rating or fallback to a default (0 instead of random to avoid "flicker")
  const rating = staticRating !== undefined ? staticRating : 0; 

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starStyle = { 
    fontSize: isMobile ? "14px" : "18px", 
    margin: "0",
    color: "#ffc107" // Standard gold color for stars
  };

  const emptyStarStyle = {
    ...starStyle,
    color: "#e4e5e9" // Light grey for empty stars to make them distinct
  };

  return (
    <div className="star-rating d-flex align-items-center">
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="material-icons" style={starStyle}>star</span>
      ))}
      
      {/* Half Star */}
      {hasHalfStar && (
        <span className="material-icons" style={starStyle}>star_half</span>
      )}
      
      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="material-icons" style={emptyStarStyle}>star_border</span>
      ))}
    </div>
  );
};

export default StarRating;
