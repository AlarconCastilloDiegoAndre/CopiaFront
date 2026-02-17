import { PiCalendarBlank } from 'react-icons/pi';

const EnrollmentsTableEmpty = () => {
  return (
    <tr>
      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 bg-gray-50/30">
        <div className="flex flex-col items-center gap-2">
          <PiCalendarBlank size={32} className="text-gray-300" />
          <p>No se encontraron resultados para esta búsqueda.</p>
        </div>
      </td>
    </tr>
  );
};

export default EnrollmentsTableEmpty;
