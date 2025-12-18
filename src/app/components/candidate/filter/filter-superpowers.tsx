import React, { useEffect, useState } from "react";
import Select from 'react-select';

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  onChange: (values: string[]) => void;
  value: string[];
}

const FilterSuperpowers = ({ onChange, value }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          // Filter categories that are active (not just editor type)
          const activeCategories = data.data
            .filter((cat: any) => cat.is_active)
            .map((cat: any) => ({
              id: cat.id,
              name: cat.category_name.replace(/\s+/g, ' ').trim(),
              description: cat.description
            }));
          setCategories(activeCategories);
        } else {
          throw new Error('Invalid category data received');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error instanceof Error ? error.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const options = categories.map(category => ({
    value: category.name.trim(),
    label: category.name.trim(),
  }));

  // Match selected values with options (trim both sides for comparison)
  const selectedOptions = options.filter(option => 
    value.some(v => v.trim() === option.value.trim())
  );

  return (
    <div>
      <Select
        isMulti
        isLoading={loading}
        options={options}
        value={selectedOptions}
        onChange={(selectedOptions) => {
          onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
        }}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder={loading ? "Loading superpowers..." : "Select superpowers"}
        isDisabled={loading}
      />
      {error && <div className="text-danger mt-2 small">{error}</div>}
    </div>
  );
};

export default FilterSuperpowers;