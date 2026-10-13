'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import Input from '../input/input';
import { usePathname } from 'next/navigation';

export default function SearchInput({
  placeholder,
  items = [],
  filterKeys = ['label'],
  onFilter,
  size = 'xsmall',
  className,
}) {
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  useEffect(() => {
    handleClear();
  }, [items, pathname]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => applyFilter(value));
  };

  const handleClear = () => {
    setQuery('');
    startTransition(() => onFilter?.(items));
  };

  const applyFilter = (value) => {
    if (!value.trim()) {
      onFilter?.(items);
      return;
    }

    const lowerQuery = value.toLowerCase();
    const filtered = items.filter((item) =>
      filterKeys.some((key) =>
        (item?.[key] || '').toLowerCase().includes(lowerQuery),
      ),
    );
    onFilter?.(filtered);
  };

  return (
    <Input
      type="text"
      value={query}
      onChange={handleChange}
      onClear={handleClear}
      placeholder={placeholder}
      prefix={<Search className="text-primary" size={16} />}
      size={size}
      className={className}
      inputDescription={false}
    />
  );
}
