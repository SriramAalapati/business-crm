import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pageNumbers = getPageNumbers();
  
  const baseClass = "flex items-center justify-center px-3 h-8 text-sm font-medium border";
  const defaultClass = "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const activeClass = "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
  const disabledClass = "text-gray-400 bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500";


  return (
    <nav className="flex items-center justify-between" aria-label="Pagination">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
        </span>
        <ul className="inline-flex -space-x-px text-sm">
            <li>
                <button onClick={handlePrevious} disabled={currentPage === 1} className={`${baseClass} ml-0 rounded-l-lg ${currentPage === 1 ? disabledClass : defaultClass}`}>
                    <FiChevronLeft className="w-4 h-4"/>
                </button>
            </li>
            {pageNumbers.map((page, index) => (
                <li key={index}>
                    {typeof page === 'number' ? (
                        <button onClick={() => onPageChange(page)} className={`${baseClass} ${currentPage === page ? activeClass : defaultClass}`}>
                            {page}
                        </button>
                    ) : (
                        <span className={`${baseClass} ${defaultClass}`}>...</span>
                    )}
                </li>
            ))}
            <li>
                <button onClick={handleNext} disabled={currentPage === totalPages} className={`${baseClass} rounded-r-lg ${currentPage === totalPages ? disabledClass : defaultClass}`}>
                    <FiChevronRight className="w-4 h-4"/>
                </button>
            </li>
        </ul>
    </nav>
  );
};

export default Pagination;