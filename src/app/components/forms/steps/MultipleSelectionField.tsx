import React, { useState, useRef, useEffect } from 'react';

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
  placeholder = "Search and select options...",
  required = false,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedItems.includes(option)
  );

  const handleSelect = (item: string) => {
    if (!selectedItems.includes(item)) {
      onChange([...selectedItems, item]);
    }
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRemove = (item: string) => {
    onChange(selectedItems.filter(i => i !== item));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="input-group-meta position-relative mb-25">
      <label>{label}{required && '*'}</label>
      
      {/* Selected Items */}
      <div className="selected-items mb-2">
        {selectedItems.map(item => (
          <span key={item} className="badge bg-primary me-2 mb-2" style={{ fontSize: '0.9em' }}>
            {item}
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              style={{ fontSize: '0.7em' }}
              onClick={() => handleRemove(item)}
            ></button>
          </span>
        ))}
      </div>

      {/* Search Input and Dropdown */}
      <div className="position-relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        {isOpen && filteredOptions.length > 0 && (
          <div 
            className="position-absolute w-100 bg-white border rounded-bottom py-2 shadow-sm" 
            style={{ 
              maxHeight: '200px', 
              overflowY: 'auto', 
              zIndex: 1000,
              top: '100%'
            }}
          >
            {filteredOptions.map(option => (
              <div
                key={option}
                className="px-3 py-1 cursor-pointer hover:bg-light"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelect(option)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default MultipleSelectionField;