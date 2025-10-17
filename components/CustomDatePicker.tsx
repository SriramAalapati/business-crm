import React, { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CustomDatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate || Date.now()));
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayDate(new Date(selectedDate || Date.now()));
  }, [selectedDate]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const today = new Date();

  const changeMonth = (offset: number) => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    onDateChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };
  
  const renderCalendar = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const blanks = Array(startDay).fill(null);
    const days = Array.from({ length: numDays }, (_, i) => i + 1);

    const selected = selectedDate ? new Date(selectedDate) : null;

    return (
        <>
            <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><FiChevronLeft /></button>
                <span className="font-semibold">{displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"><FiChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="font-medium text-gray-500 dark:text-gray-400">{d}</div>)}
                {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                {days.map(day => {
                    const isSelected = selected && selected.getDate() === day && selected.getMonth() === month && selected.getFullYear() === year;
                    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

                    let classes = "w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors ";
                    if (isSelected) {
                        classes += "bg-primary-500 text-white";
                    } else if (isToday) {
                        classes += "bg-gray-200 dark:bg-gray-600";
                    } else {
                         classes += "hover:bg-gray-100 dark:hover:bg-gray-600";
                    }

                    return <div key={day} onClick={() => handleDayClick(day)} className={classes}>{day}</div>
                })}
            </div>
        </>
    )
  }

  return (
    <div className="relative w-full" ref={datePickerRef}>
      <div className="relative">
        <input
          type="text"
          value={selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
          onFocus={() => setIsOpen(true)}
          readOnly
          className="w-full pl-10 pr-3 py-2 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          placeholder="Select a date"
        />
        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-600">
          {renderCalendar()}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
