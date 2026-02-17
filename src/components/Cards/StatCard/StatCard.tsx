import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
  path: string;
}

/**
 * StatCard
 * Componente reutilizable para mostrar estadísticas
 * @param label - Etiqueta descriptiva de la estadística
 * @param value - Valor numérico o texto a mostrar
 * @param icon - Ícono de lucide-react
 * @param color - Color del fondo del ícono (por defecto: blue)
 */
const StatCard: React.FC<StatCardProps> = (
  {
    label,
    value,
    icon: Icon,
    color = 'blue',
    path,
  }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <Link to={path}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StatCard;