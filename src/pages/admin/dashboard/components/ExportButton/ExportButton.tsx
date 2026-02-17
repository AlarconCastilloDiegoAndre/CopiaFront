import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Download, FileSpreadsheet, Filter, AlertCircle, X } from 'lucide-react';
import { api } from '@lib/axios';
import type { SortConfig } from '../../types/admin-dashboard.types';

interface ExportButtonProps {
  searchTerm: string;
  selectedCareer: string;
  selectedGroup: string;
  selectedPeriod: string;
  selectedSubjectType: string;
  sortConfig: SortConfig;
}

// Labels para mostrar en el modal
const SORT_COLUMN_LABELS: Record<string, string> = {
  career: 'Carrera',
  subject: 'Materia',
  semester: 'Semestre',
  type: 'Tipo',
  totalStudents: 'Inscritos',
};

const ExportButton = ({
  searchTerm,
  selectedCareer,
  selectedGroup,
  selectedPeriod,
  selectedSubjectType,
  sortConfig,
}: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Verificar si hay algún filtro aplicado
  const hasFilters = !!(searchTerm || selectedCareer || selectedGroup || selectedPeriod || selectedSubjectType);
  
  // Verificar si hay ordenamiento
  const hasSorting = !!sortConfig.column;

  // Construir lista de filtros activos para mostrar
  const getActiveFilters = () => {
    const filters: { label: string; value: string }[] = [];

    if (searchTerm) {
      filters.push({ label: 'Búsqueda', value: `"${searchTerm}"` });
    }
    if (selectedCareer) {
      filters.push({ label: 'Carrera', value: selectedCareer });
    }
    if (selectedGroup) {
      filters.push({ label: 'Grupo', value: `Grupo ${selectedGroup}` });
    }
    if (selectedPeriod) {
      filters.push({ label: 'Periodo', value: selectedPeriod });
    }
    if (selectedSubjectType) {
      filters.push({ label: 'Tipo', value: selectedSubjectType });
    }
    // Agregar ordenamiento a la lista
    if (sortConfig.column) {
      const columnLabel = SORT_COLUMN_LABELS[sortConfig.column] || sortConfig.column;
      const directionLabel = sortConfig.direction === 'asc' ? '↑ Ascendente' : '↓ Descendente';
      filters.push({ label: 'Ordenado por', value: `${columnLabel} (${directionLabel})` });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setShowConfirmModal(false);

      // Construir parámetros
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCareer) params.careerId = selectedCareer;
      if (selectedGroup) params.group = selectedGroup;
      if (selectedPeriod) params.periodId = selectedPeriod;
      if (selectedSubjectType) params.type = selectedSubjectType.toUpperCase();
      
      // Agregar ordenamiento
      if (sortConfig.column) {
        params.sortBy = sortConfig.column;
        params.sortOrder = sortConfig.direction;
      }

      // Hacer la petición con axios
      const response = await api.get('/enrollments/export', {
        params,
        responseType: 'blob',
      });

      // Crear el blob desde la respuesta
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscripciones_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();

      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error: any) {
      console.error('Error al exportar:', error);
      
      if (error.response?.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión de nuevo.');
      } else if (error.response?.status === 404) {
        alert('Endpoint no encontrado. Verifica la configuración del backend.');
      } else {
        alert('Error al exportar el archivo. Por favor intenta de nuevo.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        disabled={isExporting}
        className="
          flex items-center gap-2 px-4 py-2
          bg-green-600 text-white text-sm font-medium
          rounded-lg
          hover:bg-green-700
          disabled:bg-gray-400 disabled:cursor-not-allowed
          transition-colors
          shadow-sm
        "
        aria-label="Exportar a Excel"
      >
        <Download size={18} />
        {isExporting ? 'Exportando...' : 'Exportar Excel'}
      </button>

      {/* Modal de confirmación */}
      <Transition appear show={showConfirmModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileSpreadsheet size={22} className="text-green-700" />
                      </div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Exportar a Excel
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-4">
                    {(hasFilters || hasSorting) ? (
                      <>
                        {/* Con filtros u ordenamiento */}
                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <Filter size={20} className="text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Se exportarán los datos con los siguientes filtros:
                            </p>
                          </div>
                        </div>

                        {/* Lista de filtros */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                          {activeFilters.map((filter, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{filter.label}:</span>
                              <span className="font-medium text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                                {filter.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Sin filtros */}
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">
                              No hay filtros aplicados
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                              Se exportarán <strong>todos los registros</strong> del periodo activo.
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                      El archivo se descargará en formato Excel (.xlsx)
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="p-5 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Download size={18} />
                      {isExporting ? 'Exportando...' : 'Exportar'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ExportButton;