import React, { useState, useEffect } from 'react';

const Rating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            className={`text-xl sm:text-2xl transition-colors duration-200 focus:outline-none ${
              starValue <= (hoverRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-400'
            }`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
