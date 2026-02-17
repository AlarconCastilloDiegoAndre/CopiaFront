import { Disclosure } from '@headlessui/react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  badgeCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export const CollapsibleSection = (
  {
    title,
    badgeCount,
    defaultOpen = false,
    children,
    className = '',
  }: CollapsibleSectionProps) => {
  return (
    <Disclosure as="section" defaultOpen={defaultOpen} className={className}>
      {({ open }) => (
        <div
          className="bg-white rounded-lg p-2 shadow-sm transition-shadow duration-150 hover:bg-gray-50"
        >
          {/* Header del Acordeón */}
          <Disclosure.Button
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <span className="font-semibold text-gray-900">{title}</span>

              {/* Badge opcional */}
              {badgeCount !== undefined && (
                <span
                  className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-2 bg-[#002b4a] text-white rounded-full text-sm font-bold"
                >
                  {badgeCount}
                </span>
              )}
            </span>

            <span
              className={`text-gray-500 transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
            >
              <ChevronDown size={18} />
            </span>
          </Disclosure.Button>

          {/* Contenido */}
          <Disclosure.Panel className="mt-2 flex flex-col gap-2">
            {children}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
