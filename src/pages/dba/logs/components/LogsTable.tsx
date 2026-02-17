import type { SubmissionLog } from '@services/dba.service';
import LogsTableRow from './LogsTableRow';
import { FileText } from 'lucide-react';

interface LogsTableProps {
  logs: SubmissionLog[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  total: number;
}

const LogsTable = (
  {
    logs,
    isLoading,
    page,
    setPage,
    limit,
    total,
  }: LogsTableProps) => {
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500 mb-4"></div>
            <p className="text-gray-400">Cargando logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead
            className="bg-gray-800 text-gray-300 font-semibold uppercase tracking-wider border-b border-gray-700 text-xs">
          <tr>
            <th className="px-6 py-3 w-10"></th>
            <th className="px-6 py-3 font-medium">Admin</th>
            <th className="px-6 py-3 font-medium text-center">
              Student ID
            </th>
            <th className="px-6 py-3 font-medium">Entidad</th>
            <th className="px-6 py-3 font-medium">Entity ID</th>
            <th className="px-6 py-3 font-medium text-center">Acción</th>
            <th className="px-6 py-3 font-medium">Timestamp</th>
          </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
          {logs.length > 0 ? (
            logs.map((log) => <LogsTableRow key={log.logId} log={log} />)
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-12">
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                    <FileText size={30} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    No se encontraron logs
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Intenta ajustar los filtros para ver más resultados
                  </p>
                </div>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      {logs.length > 0 && (
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center">
          {/* Información de registros */}
          <div className="text-sm text-gray-400">
            Mostrando {logs.length} de {total} registros
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 text-gray-300 transition-colors"
              >
                Primera
              </button>

              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 text-gray-300 transition-colors"
              >
                Anterior
              </button>

              <span className="text-sm text-gray-400">
                  Página {page} de {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 text-gray-300 transition-colors"
              >
                Siguiente
              </button>

              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 text-gray-300 transition-colors"
              >
                Última
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LogsTable;
