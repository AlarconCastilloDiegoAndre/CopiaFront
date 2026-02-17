import { useDbaLogs } from '../logs/hooks/useDbaLogs';
import LogsTableFilters from '../logs/components/LogsTableFilters';
import LogsTable from '../logs/components/LogsTable';

export const DbaLogsTab = () => {
  const {
    adminUsername,
    setAdminUsername,
    studentId,
    setStudentId,
    entity,
    setEntity,
    entityId,
    setEntityId,
    action,
    setAction,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    page,
    setPage,
    limit,
    total,
    logs,
    isLoading,
    applyFilters,
    clearFilters,
  } = useDbaLogs();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">
          Logs de Administradores
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Historial de acciones realizadas por los administradores
        </p>
      </div>

      {/* Filtros */}
      <LogsTableFilters
        adminUsername={adminUsername}
        setAdminUsername={setAdminUsername}
        studentId={studentId}
        setStudentId={setStudentId}
        entity={entity}
        setEntity={setEntity}
        entityId={entityId}
        setEntityId={setEntityId}
        action={action}
        setAction={setAction}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Tabla */}
      <LogsTable
        logs={logs}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        limit={limit}
        total={total}
      />
    </div>
  );
};

