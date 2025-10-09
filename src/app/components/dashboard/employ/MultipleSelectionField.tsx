"use client";
import React, { type FC } from 'react';

const styles = {
  option: {
    padding: '8px 15px',
    border: '1px solid #dee2e6',
    borderRadius: '20px',
    margin: '0 8px 8px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8f9fa',
    color: '#495057',
    fontSize: '14px',
  },
  selectedOption: {
    backgroundColor: '#0c6efd',
    color: 'white',
    borderColor: '#0c6efd',
  }
};

interface Props {
  label: string;
  options: string[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
  required?: boolean;
  error?: string;
}

const MultipleSelectionField: FC<Props> = ({ label, options, selectedItems, onChange, required, error }) => {
  const handleSelect = (option: string) => {
    const newSelection = selectedItems.includes(option)
      ? selectedItems.filter(item => item !== option)
      : [...selectedItems, option];
    onChange(newSelection);
  };

  return (
    <div className="input-group-meta position-relative mb-25">
      <label>{label}{required && '*'}</label>
      <div className="d-flex flex-wrap pt-2">
        {options.map(option => (
          <div
            key={option}
            onClick={() => handleSelect(option)}
            style={{
              ...styles.option,
              ...(selectedItems.includes(option) ? styles.selectedOption : {}),
            }}
          >
            {option}
          </div>
        ))}
      </div>
      {error && <div className="error mt-2">{error}</div>}
    </div>
  );
};

export default MultipleSelectionField;