import { useState, useRef, useEffect } from 'react';
import { useSuburbAutocomplete } from '@/hooks/useSuburbAutocomplete';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface SuburbAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suburb: string, postcode: string) => void;
  onMapClick?: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * Autocomplete component for Australian suburbs
 * Shows suggestions as user types, with postcode displayed
 * Includes optional map selection button
 */
export function SuburbAutocomplete({
  value,
  onChange,
  onSelect,
  onMapClick,
  placeholder = 'Type suburb name...',
  className,
}: SuburbAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useSuburbAutocomplete(value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [results.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && value) setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[highlightedIndex]) {
          const { suburb, postcode } = results[highlightedIndex];
          onSelect(suburb, postcode);
          setIsOpen(false);
          onChange('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => value && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
          autoComplete="off"
        />
        {onMapClick && (
          <button
            type="button"
            onClick={onMapClick}
            className="px-3 py-2 border border-input rounded-md hover:bg-accent transition-colors"
            title="Select from map"
            aria-label="Select from map"
          >
            <MapPin className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-input rounded-md shadow-lg overflow-hidden">
          {results.map(({ suburb, postcode }, index) => (
            <button
              key={`${suburb}-${postcode}`}
              type="button"
              onClick={() => {
                onSelect(suburb, postcode);
                setIsOpen(false);
                onChange('');
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors ${
                index === highlightedIndex
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <span className="font-medium">{suburb}</span>
              <span className="text-xs text-muted-foreground">{postcode}</span>
            </button>
          ))}
          {results.length > 0 && (
            <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground bg-muted/50">
              {results.length} result{results.length !== 1 ? 's' : ''} • Press Enter to select
            </div>
          )}
        </div>
      )}

      {isOpen && value.trim().length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-input rounded-md shadow-lg p-4 text-center text-sm text-muted-foreground">
          No suburbs found matching "{value}"
        </div>
      )}
    </div>
  );
}
