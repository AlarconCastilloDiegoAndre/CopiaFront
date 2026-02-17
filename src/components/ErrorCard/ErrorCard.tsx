import Card from '@components/Cards/Card';
import BackLink from '@components/BackLink';
import { CircleAlert } from 'lucide-react';

interface ErrorCardProps {
  error: string | Error;
  backTo?: string;
  backLabel?: string;
}

const ErrorCard = (
  {
    error,
    backTo,
    backLabel,
  }: ErrorCardProps) => {
  return (
    <div className="max-w-[80rem] mx-auto p-6">
      <Card className="overflow-hidden">
        <BackLink to={backTo} title={backLabel} />

        {/* Contenedor del error con diseño mejorado */}
        <div className="mt-2 relative">
          {/* Barra decorativa lateral */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-l" />

          {/* Contenido del error */}
          <div
            className="pl-6 pr-4 py-5 bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              {/* Icono */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center ring-4 ring-red-50">
                  <CircleAlert className="w-5 h-5 text-red-600" strokeWidth={2} />
                </div>
              </div>

              {/* Mensaje */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  Error al cargar
                </h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  {error.toString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorCard;