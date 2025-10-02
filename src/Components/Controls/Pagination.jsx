import React from 'react';
import Button from './Button';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";

const Pagination = ({ currentPage, totalCount, limit, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / limit);
  if (totalPages < 2) return null;

  const getItems = (total, current) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }

    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const items = getItems(totalPages, currentPage);

  // compute showing range text
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(totalCount, currentPage * limit);

  return (
    <div className='mt-6 flex flex-col gap-3 w-full items-center px-4 md:px-8'>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          label={<FaChevronLeft />}
          action={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant='secondary'
          corner='full'
          size='large'
          className='!px-2'
        />

        <div className='flex gap-2 items-center'>
          {items.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className='px-0 text-lg text-secondary/60 select-none'>
                  ......
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <Button
                label={p}
                key={p}
                action={() => onPageChange(p)}
                size='small'
                variant='medium'
                className={`!px-3 !text-lg ${isActive ? '!text-accent' : '!text-secondary/60'}`}
              />
            );
          })}
        </div>

        <Button
          label={<FaChevronRight />}
          action={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant='secondary'
          corner='full'
          size='large'
          className='!px-2'
        />
      </div>

      <p className='text-secondary/80 font-medium text-base'>
        Showing <b className='fontDmmono'>{startItem} - {endItem}</b> out of <b className='fontDmmono'>{totalCount}</b> items
      </p>
    </div>
  );
};

export default Pagination;
