import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  total?: number;
  icon: ReactNode;
  color: 'emerald' | 'blue' | 'amber';
}

const COLORS = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    text: 'text-emerald-700',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    text: 'text-blue-700',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    text: 'text-amber-700',
  },
};

export function StatCard(
  {
    label,
    value,
    total,
    icon,
    color,
  }: StatCardProps) {
  const styles = COLORS[color];

  return (
    <div className={`${styles.bg} ${styles.border} rounded-lg p-4 border`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded ${styles.iconBg}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${styles.text}`}>{value}</span>
        {total !== undefined && (
          <span className="text-sm text-gray-500">/ {total}</span>
        )}
      </div>
    </div>
  );
}
