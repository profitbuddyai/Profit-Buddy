import React from 'react';
import { IoInformation } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const InfoTooltip = ({ id, content }) => {
  return (
    <div className="inline-block">
      <div
        data-tooltip-id={id}
        className="w-[17px] h-[17px] text-[13px] rounded-full text-gray-500 border-gray-300 border-[1.8px] flex items-center justify-center cursor-pointer hover:bg-orange-100 hover:border-orange-300 hover:text-orange-900"
      >
        <IoInformation />
      </div>
      
      <Tooltip
        id={id}
        place="top"
        content={content}
        className="text-xs px-2 py-1"
        style={{
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: '4px',
          maxWidth: '200px',
          whiteSpace: 'normal',
          fontSize: '0.75rem',
        }}
      />
    </div>
  );
};

export default InfoTooltip;
