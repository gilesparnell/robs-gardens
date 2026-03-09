import { useState, useCallback, useRef, useEffect } from 'react';
import { searchPostcodes, SearchResult } from '@/lib/postcodes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';

interface PostcodeSearchProps {
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
}

export function PostcodeSearch({
  onSelect,
  placeholder = 'Search postcode or suburb...',
}: PostcodeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await searchPostcodes(query);
        setResults(searchResults);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (error) {
        console.error('[PostcodeSearch] Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(results[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [isOpen, results, highlightedIndex]
  );

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && results.length > 0 && setIsOpen(true)}
          className="pl-10 h-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-md z-50 max-h-64 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No results found
            </div>
          ) : (
            <div className="divide-y divide-border">
              {results.map((result, index) => (
                <button
                  key={`${result.postcode}-${result.suburb}`}
                  onClick={() => handleSelect(result)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    index === highlightedIndex
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium">{result.suburb}</div>
                  <div className="text-xs text-muted-foreground">
                    {result.postcode} • {result.state}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
