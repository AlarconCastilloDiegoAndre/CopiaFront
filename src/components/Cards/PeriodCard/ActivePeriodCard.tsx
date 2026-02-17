import { FaCalendarAlt } from 'react-icons/fa';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { HiDotsVertical } from 'react-icons/hi';
import type { Period } from '@types';
import { formatDate } from '@utils/formatDate.ts';
import { TriangleAlert, SquarePen } from 'lucide-react';

interface ActivePeriodCardProps {
  period: Period;
  onEdit?: (period: Period) => void;
  onAdvanceSemester?: () => void;
}

const ActivePeriodCard = ({ period, onEdit, onAdvanceSemester }: ActivePeriodCardProps) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg w-full p-4 overflow-visible hover:bg-gray-50 transition-colors">
      {/* Contenido Principal */}
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4">

        {/* Icono y ID del Periodo - Ocupa tod el ancho en móvil */}
        <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-col sm:justify-center sm:gap-0 flex-shrink-0">
          <span className="text-xs font-medium uppercase text-gray-500 sm:mb-1 flex-shrink-0">Periodo</span>
          <div
            className="flex items-center justify-center gap-2 px-3 py-1 rounded-full flex-1 sm:flex-none bg-green-100 text-green-800">
            <FaCalendarAlt size={14} />
            <span className="text-sm font-semibold">{period.periodId}</span>
          </div>
        </div>

        {/* Fechas */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 flex-1 min-w-0">
          {/* Fecha Inicio */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <span className="text-xs font-medium uppercase text-gray-500 mb-1">Fecha de apertura</span>
            <span className="text-base font-semibold text-gray-900">
              {formatDate(period.startDate)}
            </span>
          </div>

          {/* Fecha Fin */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <span className="text-xs font-medium uppercase text-gray-500 mb-1">Fecha de cierre</span>
            <span className="text-base font-semibold text-gray-900">
              {formatDate(period.endDate)}
            </span>
          </div>
        </div>

        {/* Estado con Menú - Ocupa tod el ancho en móvil */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
          <div className="flex items-center gap-2 sm:flex-col sm:justify-center sm:gap-0 flex-1 sm:flex-none">
            <span className="text-xs font-medium uppercase text-gray-500 sm:mb-1 flex-shrink-0">Estado</span>
            <div
              className="flex items-center justify-center gap-2 px-3 py-1 rounded-full flex-1 sm:flex-none bg-green-100 border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">Activo</span>
            </div>
          </div>

          {/* Menú de Opciones */}
          {(onEdit || onAdvanceSemester) && (
            <Menu as="div" className="relative">
              <MenuButton className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                <HiDotsVertical size={20} className="text-gray-600" />
              </MenuButton>

              <MenuItems
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
              >
                <div className="py-1">
                  {onEdit && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={() => onEdit(period)}
                          className={`${focus ? 'bg-blue-50' : ''
                            } group flex w-full items-center gap-2 px-4 py-2.5 text-sm text-main-color border-l-4 border-main-color`}
                        >
                          <SquarePen size={18} className="flex-shrink-0" />
                          <span className="font-medium">Editar periodo</span>
                        </button>
                      )}
                    </MenuItem>
                  )}
                  {onAdvanceSemester && (
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={onAdvanceSemester}
                          className={`${focus ? 'bg-red-50' : ''
                            } group flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-700 border-l-4 border-red-500`}
                        >
                          <TriangleAlert size={18} className="flex-shrink-0" />
                          <span className="font-medium">Avanzar semestre</span>
                        </button>
                      )}
                    </MenuItem>
                  )}
                </div>
              </MenuItems>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivePeriodCard;