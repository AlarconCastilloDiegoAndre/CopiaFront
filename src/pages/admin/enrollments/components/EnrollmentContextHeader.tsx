import type { EnrollmentContext } from '@types';
import { BookOpen } from 'lucide-react';
import PageHeader from '@components/PageHeader';
import Card from '@components/Cards/Card';
import BackLink from '@components/BackLink';
import SearchInput from '@components/Inputs/SearchInput';

interface EnrollmentContextHeaderProps {
  context: EnrollmentContext;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const EnrollmentContextHeader = (
  {
    context,
    searchTerm,
    setSearchTerm,
  }: EnrollmentContextHeaderProps) => {
  const getTypeBadgeClass = (type: string) => {
    const map: Record<string, string> = {
      NORMAL: 'bg-green-100 text-green-700',
      ADELANTO: 'bg-purple-100 text-purple-700 ',
      RECURSAMIENTO: 'bg-orange-100 text-orange-700',
    };
    return map[type] ?? 'bg-gray-100 text-gray-700';
  };

  const isNormal = context.type === 'NORMAL';
  const showSemester = isNormal && context.semester != null;
  const showGroup = context.group != null;

  return (
    <Card>
      <BackLink to="/admin/dashboard" />

      <PageHeader
        title={context.subject}
        subtitle={context.career}
        icon={<BookOpen size={30} />}
      />

      <div className="flex flex-wrap items-center gap-4 mt-4">
        {/* Tipo */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Tipo:</span>
          <span
            className={`
              inline-flex items-center px-3 py-1
              rounded text-sm font-medium
              ${getTypeBadgeClass(context.type)}
            `}
          >
            {context.type}
          </span>
        </div>

        {/* Semestre */}
        {showSemester && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Semestre:</span>
            <span className="text-sm font-semibold text-gray-700">
              {context.semester}°
            </span>
          </div>
        )}

        {/* Grupo */}
        {showGroup && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Grupo:</span>
            <span className="text-sm font-semibold text-gray-700">
              {context.group}
            </span>
          </div>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <label htmlFor="student-search" className="block text-sm font-semibold text-gray-700 mb-2">
          Buscar estudiante
        </label>
        <SearchInput
          id="student-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o expediente..."
          className="w-full"
        />

      </div>
    </Card>
  );
};

export default EnrollmentContextHeader;
