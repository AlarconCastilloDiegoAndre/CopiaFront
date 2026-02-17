import { useNavigate } from 'react-router-dom';
import type { EnrollmentRow, SortColumn, SortConfig } from '../../types/admin-dashboard.types';
import { TABLE_COLUMNS } from '../../constants/admin-dashboard.constants';
import EnrollmentsTableHeader from './EnrollmentsTableHeader';
import EnrollmentsTableFilters from './EnrollmentsTableFilters';
import EnrollmentsTableRow from './EnrollmentsTableRow';
import EnrollmentsTableEmpty from './EnrollmentsTableEmpty';
import SortableHeader from './SortableHeader';
import type { Career, Period } from '@types';

interface EnrollmentsTableProps {
  report: EnrollmentRow[];
  careers: Career[];
  groups: number[];
  periods: Period[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCareer: string;
  setSelectedCareer: (value: string) => void;
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
  selectedSubjectType: string;
  setSelectedSubjectType: (value: string) => void;
  meta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  page: number;
  setPage: (page: number) => void;
  sortConfig: SortConfig;
  onSort: (column: SortColumn) => void;
}

const EnrollmentsTable = ({
  report,
  careers,
  groups,
  periods,
  searchTerm,
  setSearchTerm,
  selectedCareer,
  setSelectedCareer,
  selectedGroup,
  setSelectedGroup,
  selectedPeriod,
  setSelectedPeriod,
  selectedSubjectType,
  setSelectedSubjectType,
  meta,
  page,
  setPage,
  sortConfig,
  onSort,
}: EnrollmentsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (enrollment: EnrollmentRow) => {
    const groupParam = enrollment.group ?? 'Mixto';
    navigate(
      `/admin/enrollments/details?careerSubjectId=${enrollment.careerSubjectId}&group=${groupParam}&type=${enrollment.type}`,
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Header con botón de exportar */}
      <EnrollmentsTableHeader
        searchTerm={searchTerm}
        selectedCareer={selectedCareer}
        selectedGroup={selectedGroup}
        selectedPeriod={selectedPeriod}
        selectedSubjectType={selectedSubjectType}
        sortConfig={sortConfig}
      />

      {/* Filtros */}
      <EnrollmentsTableFilters
        careers={careers}
        groups={groups}
        periods={periods}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCareer={selectedCareer}
        setSelectedCareer={setSelectedCareer}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedSubjectType={selectedSubjectType}
        setSelectedSubjectType={setSelectedSubjectType}
      />

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-main-color text-white font-semibold uppercase tracking-wider border-b border-gray-200">
            <tr>
              <SortableHeader
                label={TABLE_COLUMNS.CAREER}
                column="career"
                currentColumn={sortConfig.column}
                currentDirection={sortConfig.direction}
                onSort={onSort}
              />
              <SortableHeader
                label={TABLE_COLUMNS.SUBJECT}
                column="subject"
                currentColumn={sortConfig.column}
                currentDirection={sortConfig.direction}
                onSort={onSort}
              />
              <SortableHeader
                label={TABLE_COLUMNS.SEMESTER_GROUP}
                column="semester"
                currentColumn={sortConfig.column}
                currentDirection={sortConfig.direction}
                onSort={onSort}
                className="text-center"
              />
              <SortableHeader
                label={TABLE_COLUMNS.TYPE}
                column="type"
                currentColumn={sortConfig.column}
                currentDirection={sortConfig.direction}
                onSort={onSort}
                className="text-center"
              />
              <SortableHeader
                label={TABLE_COLUMNS.ENROLLED}
                column="totalStudents"
                currentColumn={sortConfig.column}
                currentDirection={sortConfig.direction}
                onSort={onSort}
                className="text-right"
              />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {report.length > 0 ? (
              report.map((enrollment) => (
                <EnrollmentsTableRow
                  key={enrollment.uniqueId}
                  enrollment={enrollment}
                  onClick={() => handleRowClick(enrollment)}
                />
              ))
            ) : (
              <EnrollmentsTableEmpty />
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        {/* Información de registros */}
        <div className="text-sm text-gray-600">
          Mostrando {report.length} de {meta?.totalItems || 0} registros
        </div>

        {/* Controles de paginación */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Primera
            </button>

            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Anterior
            </button>

            <span className="text-sm text-gray-600">
              Página {meta.currentPage} de {meta.totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= meta.totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Siguiente
            </button>

            <button
              onClick={() => setPage(meta.totalPages)}
              disabled={page === meta.totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Última
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsTable;