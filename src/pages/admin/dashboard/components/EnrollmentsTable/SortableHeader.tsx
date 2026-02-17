import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { SortColumn, SortDirection } from '../../types/admin-dashboard.types';

interface SortableHeaderProps {
  label: string;
  column: SortColumn;
  currentColumn: SortColumn;
  currentDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string;
}

const SortableHeader = ({
  label,
  column,
  currentColumn,
  currentDirection,
  onSort,
  className = '',
}: SortableHeaderProps) => {
  const isActive = currentColumn === column;

  return (
    <th className={`px-6 py-3 font-medium ${className}`}>
      <button
        onClick={() => onSort(column)}
        className="flex items-center gap-1.5 hover:text-blue-200 transition-colors group"
      >
        <span>{label}</span>
        <span className="flex items-center">
          {isActive ? (
            currentDirection === 'asc' ? (
              <ArrowUp size={14} className="text-blue-200" />
            ) : (
              <ArrowDown size={14} className="text-blue-200" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-white/50 group-hover:text-white/80" />
          )}
        </span>
      </button>
    </th>
  );
};

export default SortableHeader;