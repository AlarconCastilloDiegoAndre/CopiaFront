import { useNavigate } from 'react-router-dom';
import { PiWarningCircle } from 'react-icons/pi';

const NoPeriodAlert = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4
        rounded-r-lg flex items-start gap-3 text-amber-900
         shadow-sm animate-fade-in
         my-5
         ">
      <PiWarningCircle size={24} className="flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold">No hay un periodo activo.</p>
        <p className="text-sm text-amber-800">
          Los alumnos no podrán inscribir materias hasta que inicies un nuevo periodo en la sección de{' '}
          <button
            className="font-semibold underline hover:text-amber-950 cursor-pointer"
            onClick={() => navigate('/admin/periods')}
          >
            Gestión de Periodos
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default NoPeriodAlert;
