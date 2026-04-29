import React from "react";

const StarRating = ({ value = 0, onChange, readonly = false, size = "md" }) => {
  const sizeClass = size === "sm" ? "text-base" : size === "lg" ? "text-3xl" : "text-xl";

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          className={`transition-transform ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-125"
          } ${star <= value ? "text-yellow-400" : "text-gray-600"}`}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
