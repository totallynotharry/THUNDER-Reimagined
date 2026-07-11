'use client';

import { useState } from 'react';
import { Search, Settings, X } from 'lucide-react';
import { useSearchStore } from '@/lib/store';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export default function SearchBar({
  onSearch,
  showSettings = true,
  onSettingsClick,
}: SearchBarProps) {
  const { query, setQuery } = useSearchStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center gap-2 bg-dark-800 rounded-lg border-2 transition-all ${isFocused ? 'border-thunder-500' : 'border-dark-700'}`}>
        <Search className="w-5 h-5 text-dark-400 ml-3" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search games, apps, tools..."
          className="flex-1 bg-transparent py-2 px-2 text-white placeholder-dark-400 focus:outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="text-dark-400 hover:text-white transition mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {showSettings && (
          <button
            onClick={onSettingsClick}
            className="text-dark-400 hover:text-white transition mr-2"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}