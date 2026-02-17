import { CalendarClock, Info, CalendarDays, AlertTriangle } from 'lucide-react';
import type { Period } from '@types'; // Asegúrate de importar tu tipo

interface Props {
  activePeriod?: Period;
}

export function EnrollmentClosed({ activePeriod }: Props) {
  // Determinar el estado actual
  const now = new Date();

  // Si no hay periodo, es mantenimiento
  if (!activePeriod) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <div
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema en Mantenimiento</h2>
          <p className="text-gray-500">No hay un ciclo escolar activo en este momento.</p>
        </div>
      </div>
    );
  }

  const start = new Date(activePeriod.startDate);
  const isUpcoming = now < start; // ¿Es antes de que empiece?

  // Formateador de fecha amigable
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC', // Importante para que no reste horas
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">

        {/* --- ENCABEZADO --- */}
        <div
          className="w-16 bg-gray-100 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ">
          {/* Cambiamos icono según el caso: Reloj si espera, Calendario si cerró */}
          {isUpcoming ?
            <CalendarDays size={32} className="text-blue-800 " />
            :
            <CalendarClock size={32} className="text-orange-500" />}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {isUpcoming ? 'Próximamente' : 'Inscripciones Cerradas'}
        </h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          {isUpcoming ? (
            <>
              Las inscripciones para el ciclo <span
              className="font-semibold text-gray-700">{activePeriod.periodId}</span> aún no comienzan.
            </>
          ) : (
            <>
              El periodo de inscripciones para el ciclo <span
              className="font-semibold text-gray-700">{activePeriod.periodId}</span> ha finalizado.
            </>
          )}
        </p>

        {/* --- ZONA DE INFORMACIÓN --- */}
        {isUpcoming ? (
          // CASO A: Aún no empieza -> Mostramos FECHA
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              Apertura de inscripciones
            </p>
            <p className="text-lg font-medium text-black capitalize">
              {start.toLocaleDateString('es-MX', dateOptions)}
            </p>
          </div>
        ) : (
          // CASO B: Ya terminó -> Mostramos AYUDA
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-left flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-800 text-sm mb-1 text-left">
                ¿Necesitas inscribirte?
              </h3>
              <p className="text-sm text-black leading-relaxed text-justify pr-2">
                Si no realizaste tu registro a tiempo, deberás contactar a la <strong>Coordinación de tu
                Carrera</strong> para revisar tu situación académica.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}