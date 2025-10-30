import React, { useRef, useEffect } from 'react';

interface MultipleSelectionFieldProps {
  label: string;
  options: string[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const MultipleSelectionField: React.FC<MultipleSelectionFieldProps> = ({
  label,
  options,
  selectedItems,
  onChange,
  placeholder = "Select an option...",
  required = false,
  error
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: string) => {
    if (!selectedItems.includes(item)) {
      onChange([...selectedItems, item]);
    }
  };

  const handleRemove = (item: string) => {
    onChange(selectedItems.filter(i => i !== item));
  };

  return (
    <div className="input-group-meta position-relative mb-25">
      <label>{label}{required && '*'}</label>
      
      {/* Selected Items */}
      <div className="selected-items mb-2">
        {selectedItems.map(item => (
          <span key={item} className="badge bg-primary me-2 mb-2 d-flex align-items-center" style={{ gap: 6, padding: '0.5em 0.75em' }}>
            {item}
            <button
              type="button"
              className="btn btn-sm btn-link text-white p-0 m-0 fw-bold"
              style={{ fontSize: '16px', lineHeight: 1, textDecoration: 'none' }}
              onClick={() => handleRemove(item)}
              aria-label={`Remove ${item}`}
              title={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown Select */}
      <div className="position-relative" ref={dropdownRef}>
        <select
          className="form-control"
          style={{ height: '60px', minHeight: '60px' }}
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleSelect(e.target.value);
              e.target.value = ""; // Reset select after selection
            }
          }}
        >
          <option value="">{placeholder}</option>
          {options
            .filter(option => !selectedItems.includes(option))
            .map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default MultipleSelectionField;