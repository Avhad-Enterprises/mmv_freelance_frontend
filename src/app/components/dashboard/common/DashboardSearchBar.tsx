'use client';
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import search from "@/assets/dashboard/images/icon/icon_10.svg";

interface DashboardSearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  debounceMs?: number;
}

const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  debounceMs = 300
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    setDebounceTimeout(newTimeout);
  }, [debounceTimeout, debounceMs, onSearch]);

  const handleClear = () => {
    setSearchValue('');
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    onSearch(searchValue);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`dashboard-search-bar ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        marginBottom: '1.5rem'
      }}
    >
      <div className="search-input-wrapper" style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        border: '2px solid #E8ECF2',
        borderRadius: '12px',
        padding: '0.5rem 1rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="form-control border-0"
          style={{
            flex: 1,
            fontSize: '14px',
            color: '#244034',
            backgroundColor: 'transparent',
            outline: 'none',
            boxShadow: 'none',
            padding: '0.5rem 0',
            paddingRight: searchValue ? '2.5rem' : '0'
          }}
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-btn"
            style={{
              position: 'absolute',
              right: '3.5rem',
              background: 'none',
              border: 'none',
              color: '#6c757d',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#244034'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
        )}
        <button
          type="submit"
          className="search-btn"
          style={{
            background: 'none',
            border: 'none',
            padding: '0.25rem 0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '0.5rem'
          }}
        >
          <Image 
            src={search} 
            alt="search" 
            className="lazy-img" 
            style={{ width: '20px', height: '20px' }}
          />
        </button>
      </div>

      <style jsx>{`
        .search-input-wrapper:focus-within {
          border-color: #31795A !important;
          box-shadow: 0 4px 12px rgba(49, 121, 90, 0.15) !important;
        }
        
        .search-input-wrapper input::placeholder {
          color: #9ca3af;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .dashboard-search-bar {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </form>
  );
};

export default DashboardSearchBar;
