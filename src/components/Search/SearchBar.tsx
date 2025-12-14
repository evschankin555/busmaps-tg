import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  value?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  onFocus,
  placeholder = 'Найти место',
  value: controlledValue,
  className = '',
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch && value.trim()) {
        onSearch(value.trim());
      }
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-bar-container">
        <svg
          className="search-bar-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-bar-input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button
            className="search-bar-clear"
            onClick={() => {
              if (!isControlled) {
                setInternalValue('');
              }
              if (onSearch) {
                onSearch('');
              }
              inputRef.current?.focus();
            }}
            aria-label="Очистить"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

