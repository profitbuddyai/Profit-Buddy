import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { formatNumberWithCommas } from '../../Utils/NumberUtil';

const Rating = ({ rating = 0, count = 0 , className }) => {

  const stars = [];

  // Create 5 stars based on the rating value
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-accent" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-accent" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-accent" />);
    }
  }

  return (
    <div className={`flex items-end gap-2 py-0.5 text-secondary ${className}`}>
      <div className="flex text-[15px]">{stars}</div>
      <span className="text-[13px]/[13px] font-medium ">{`(${formatNumberWithCommas(count , 0 , false , true)})`}</span>
    </div>
  );
};

export default Rating;
