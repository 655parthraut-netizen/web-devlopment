import React from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <div className="p-6 rounded-none border border-gray-100 bg-gray-50/50 flex flex-col gap-3 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display font-extrabold text-black text-sm uppercase">
            {review.author || 'Anonymous'}
          </h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {review.date ? new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Verified Purchase'}
          </p>
        </div>
        
        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 text-black">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < (review.rating || 5) ? 'fill-current' : 'text-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed font-normal">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
