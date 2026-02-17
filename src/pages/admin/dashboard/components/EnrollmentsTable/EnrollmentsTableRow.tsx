import type { EnrollmentRow } from '../../types/admin-dashboard.types.ts';
import formatCareerId from '@utils/formatCareerId.ts';

interface EnrollmentsTableRowProps {
  enrollment: EnrollmentRow;
  onClick: () => void;
}

const EnrollmentsTableRow = ({ enrollment, onClick }: EnrollmentsTableRowProps) => {
  const hideSemesterGroup =
    enrollment.semester == null || enrollment.group == null;

  return (
    <tr
      onClick={onClick}
      className="
        cursor-pointer
        transition-colors
        hover:bg-blue-50
        even:bg-gray-50
        odd:bg-white
      "
    >
      {/* 1. CARRERA */}
      <td className="px-4 py-3">
        <span
          className="
            inline-flex items-center px-2 py-1
            rounded text-xs font-medium
            bg-main-color text-white
          "
          title={enrollment.career}
        >
          {formatCareerId(enrollment.career)}
        </span>
      </td>

      {/* 2. MATERIA */}
      <td className="px-4 py-3">
        <span className="text-main-color text-base font-semibold">
          {enrollment.subject}
        </span>
      </td>

      {/* 3. SEMESTRE / GRUPO */}
      <td className="px-4 py-3 text-center">
        {!hideSemesterGroup && (
          <span className="text-gray-500 text-sm font-semibold">
            {enrollment.semester}° / {enrollment.group}
          </span>
        )}
      </td>

      {/* 4. TIPO */}
      <td className="px-4 py-3 text-center">
        <span
          className={`
            inline-flex items-center px-2 py-1
            rounded text-xs font-medium
            ${
            enrollment.type === 'NORMAL'
              ? 'bg-green-100 text-green-700'
              : enrollment.type === 'ADELANTO'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-orange-100 text-orange-700'
          }
          `}
        >
          {enrollment.type === 'RECURSAMIENTO' ? 'RECURSAMIENTO' : enrollment.type}
        </span>
      </td>

      {/* 5. TOTAL ESTUDIANTES */}
      <td className="px-4 py-3 text-right">
        <span className="
          inline-flex items-center px-3 py-1
          rounded-full text-sm font-medium
          bg-blue-100 text-blue-700
        ">
          {enrollment.totalStudents}
        </span>
      </td>
    </tr>
  );
};


export default EnrollmentsTableRow;