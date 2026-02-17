import React from 'react';
import { IMaskInput } from 'react-imask';

// --- TIPOS ---
export type FormInputType =
  'text' |
  'password' |
  'number' |
  'select' |
  'date' |
  'email' |
  'tel';

export interface FormInputOption {
  value: any;
  label: string;
}

export interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: any;
  onChange: (value: any) => void;
  type?: FormInputType;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  mask?: string;
  options?: FormInputOption[];
  helperText?: string;
  showLabel?: boolean;
  autoFocus?: boolean;
}

// --- CLASES COMPARTIDAS ---
const inputClasses =
  (isError: boolean, isDisabled: boolean) => `
  w-full pl-3 pr-3 py-3
  bg-white border-2
  text-gray-900 text-sm rounded-md
  box-border focus:border-[#003d6b] focus:outline-none
  placeholder-gray-500 transition-colors
  ${isError ? 'border-red-500' : 'border-gray-300'} 
  ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
`;

// --- COMPONENTE ---
export const FormInput: React.FC<FormInputProps> = (
  {
    name,
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    disabled = false,
    error,
    required = false,
    mask,
    options = [],
    helperText,
    showLabel = true,
    autoFocus = false,
  }) => {
  const hasError = !!error;

  // --- RENDER SELECT ---
  if (type === 'select') {
    return (
      <div>
        {showLabel && label && (
          <label htmlFor={name} className="block text-md font-semibold text-gray-800 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {helperText && (
          <p className="text-sm text-gray-500 mb-2">
            {helperText}
          </p>
        )}

        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoFocus={autoFocus}
          className={inputClasses(hasError, disabled)}
        >
          <option value="" disabled>
            {placeholder || 'Selecciona una opción'}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }

  // --- RENDER MASKED INPUT ---
  if (mask) {
    return (
      <div>
        {showLabel && label && (
          <label htmlFor={name} className="block text-md font-semibold text-gray-800 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {helperText && (
          <p className="text-sm text-gray-500 mb-2">
            {helperText}
          </p>
        )}

        <IMaskInput
          id={name}
          name={name}
          mask={mask}
          value={value || ''}
          onAccept={(value: string) => onChange(value)}
          placeholder={placeholder}
          disabled={disabled}
          lazy={true}
          placeholderChar="_"
          autoFocus={autoFocus}
          className={inputClasses(hasError, disabled)}
        />

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }

  // --- RENDER STANDARD INPUT ---
  return (
    <div>
      {showLabel && label && (
        <label htmlFor={name} className="block text-md font-semibold text-gray-800 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {helperText && (
        <p className="text-sm text-gray-500 mb-2">
          {helperText}
        </p>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={inputClasses(hasError, disabled)}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};