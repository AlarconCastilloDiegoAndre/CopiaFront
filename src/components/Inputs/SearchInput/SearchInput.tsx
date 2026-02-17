import { Search } from 'lucide-react';
import React from 'react';

type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'className'> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /**
   * Clase adicional aplicada al contenedor principal (útil para márgenes / layout desde el padre).
   */
  className?: string;
};

const SearchInput: React.FC<SearchInputProps> = (
  {
    value,
    onChange,
    placeholder = 'Buscar...',
    className = '',
    ...rest
  }) => {
  const wrapperClassName = `relative ${className}`.trim();

  return (
    <div className={wrapperClassName}>
      {/* Icono de búsqueda (posicionado absolute) */}
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base pointer-events-none"
        aria-hidden="true"
        size={18}
        strokeWidth={2.5}
      />

      {/* Input de búsqueda con padding-left para dejar espacio al icono */}
      <input
        type="search"
        className="
          w-full
          pl-10 pr-3 py-3
          bg-white
          border-2 border-gray-300
          text-gray-900
          rounded-md
          box-border
          focus:border-main-color/90 focus:outline-none
          placeholder-gray-500
          transition-colors
        "
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default SearchInput;