import { BookOpen, ChevronsRight, RotateCcw } from 'lucide-react';
import { StatCard } from './StatCard';
import { memo } from 'react';

interface StudentHomeSummaryProps {
  totalSubjects: number;
  totalNormal: number;
  totalAdelanto: number;
  totalRecursamiento: number;
}

const SUMMARY_CARD_CLASSES =
  '  \'bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8 w-full sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto';

const HomeSummary = memo(
  ({
     totalSubjects,
     totalNormal,
     totalAdelanto,
     totalRecursamiento,
   }: StudentHomeSummaryProps) => {
    const totalSelected = totalNormal + totalAdelanto + totalRecursamiento;

    return (
      <div className={SUMMARY_CARD_CLASSES}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <BookOpen className="mr-2" size={28} />
              Pre-inscripción
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Selecciona las asignaturas que cursarás este semestre
            </p>
          </div>

          {/* Total general */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Total seleccionadas:</span>
            <span className="text-2xl font-bold text-gray-900">{totalSelected}</span>
          </div>
        </div>

        {/* Stats por tipo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Normales"
            value={totalNormal}
            total={totalSubjects}
            icon={<BookOpen size={16} className="text-emerald-600" />}
            color="emerald"
          />

          <StatCard
            label="Adelanto"
            value={totalAdelanto}
            icon={<ChevronsRight size={16} className="text-blue-600" />}
            color="blue"
          />

          <StatCard
            label="Recursamiento"
            value={totalRecursamiento}
            icon={<RotateCcw size={16} className="text-amber-600" />}
            color="amber"
          />
        </div>
      </div>
    );
  });

HomeSummary.displayName = 'HomeSummary';
export default HomeSummary;