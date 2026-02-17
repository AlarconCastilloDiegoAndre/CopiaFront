import { Fragment, useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

interface ListboxOptionType {
  value: string | number;
  label: string;
}

interface CustomListboxProps {
  value: string | number;
  onChange: (value: any) => void;
  options: ListboxOptionType[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  disabled?: boolean;
  showCheckmark?: boolean;
  ariaLabel?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

const CustomListbox = (
  {
    value,
    onChange,
    options,
    placeholder = 'Seleccionar...',
    className = '',
    buttonClassName = '',
    optionsClassName = '',
    disabled = false,
    showCheckmark = false,
    ariaLabel,
    onOpenChange,
  }: CustomListboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  return (
    <div className={`relative ${className}`}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => {
          // Sincronizamos el estado open con el padre si se proporciona callback
          useEffect(() => {
            if (isOpen !== open) {
              setIsOpen(open);
              onOpenChange?.(open);
            }
          }, [open]);

          return (
            <>
              <ListboxButton
                className={`flex items-center justify-between gap-2 px-3 py-2 border rounded-lg border-gray-300 text-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003d6b] ${buttonClassName}`}
                aria-label={ariaLabel}
              >
                <span className="block truncate text-left flex-1">{displayValue}</span>
                <ChevronDown className="text-gray-500 flex-shrink-0" size={16} />
              </ListboxButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <ListboxOptions
                  className={`absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-[9999] max-h-60 overflow-auto ${optionsClassName}`}
                >
                  {options.map((option) => (
                    <ListboxOption key={option.value} value={option.value} as={Fragment}>
                      {({ active, selected }) => (
                        <div
                          className={`px-3 py-2 flex items-center justify-between cursor-pointer text-sm border-l-2 transition-all ${selected
                              ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                              : 'border-transparent'
                            } ${active && !selected ? 'bg-gray-50' : ''}`}
                        >
                          <span className="block truncate">{option.label}</span>
                          {showCheckmark && selected && (
                            <Check className="text-blue-600 flex-shrink-0" size={16} />
                          )}
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </>
          );
        }}
      </Listbox>
    </div>
  );
};

export default CustomListbox;