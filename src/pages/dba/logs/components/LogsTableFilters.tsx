interface LogsTableFiltersProps {
  adminUsername: string;
  setAdminUsername: (value: string) => void;
  studentId: string;
  setStudentId: (value: string) => void;
  entity: string;
  setEntity: (value: string) => void;
  entityId: string;
  setEntityId: (value: string) => void;
  action: string;
  setAction: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}


const LogsTableFilters = (
  {
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
    applyFilters,
    clearFilters,
  }: LogsTableFiltersProps) => {
  return (
    <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700 space-y-3">
      {/* Fila 1: Inputs de texto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Admin Username */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Admin Username
          </label>
          <input
            type="text"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            placeholder="Buscar por admin..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>

        {/* Student ID */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Student ID
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Buscar por estudiante..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>

        {/* Entity ID */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Entity ID
          </label>
          <input
            type="text"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="Buscar por entity ID..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:border-blue-500 focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>
      </div>

      {/* Fila 2: Selectores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {/* Entity */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Entidad
          </label>
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
          >
            <option value="">Todas las entidades</option>
            <option value="AUTH">AUTH</option>
            <option value="CAREER-SUBJECTS">CAREER-SUBJECTS</option>
            <option value="CAREERS">CAREERS</option>
            <option value="PERIODS">PERIODS</option>
            <option value="ENROLLMENTS">ENROLLMENTS</option>
            <option value="SUBJECTS">SUBJECTS</option>
          </select>
        </div>

        {/* Action */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Acción
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
          >
            <option value="">Todas las acciones</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      </div>

      {/* Fila 3: Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* From Date */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Desde
          </label>
          <input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Hasta
          </label>
          <input
            type="datetime-local"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Fila 4: Botones */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={applyFilters}
          className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors text-sm font-normal shadow-sm"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={clearFilters}
          className="px-6 py-2.5 bg-transparent border-2 border-gray-600 hover:border-gray-500 hover:bg-gray-800/50 text-gray-300 rounded-md transition-colors text-sm font-medium"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default LogsTableFilters;

