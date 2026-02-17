import { PiChalkboardTeacher } from 'react-icons/pi';
import ExportButton from '../ExportButton';
import type { SortConfig } from '../../types/admin-dashboard.types';

interface EnrollmentsTableHeaderProps {
  searchTerm: string;
  selectedCareer: string;
  selectedGroup: string;
  selectedPeriod: string;
  selectedSubjectType: string;
  sortConfig: SortConfig;
}

const EnrollmentsTableHeader = ({
  searchTerm,
  selectedCareer,
  selectedGroup,
  selectedPeriod,
  selectedSubjectType,
  sortConfig,
}: EnrollmentsTableHeaderProps) => {
  return (
    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
      <div className="flex items-center gap-2">
        <PiChalkboardTeacher size={24} className="text-[#003d6b]" />
        <h2 className="text-lg font-bold text-gray-800">Inscripciones por Materia</h2>
      </div>

      {/* Botón de exportar */}
      <ExportButton
        searchTerm={searchTerm}
        selectedCareer={selectedCareer}
        selectedGroup={selectedGroup}
        selectedPeriod={selectedPeriod}
        selectedSubjectType={selectedSubjectType}
        sortConfig={sortConfig}
      />
    </div>
  );
};

export default EnrollmentsTableHeader;