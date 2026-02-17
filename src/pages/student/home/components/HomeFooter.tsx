import { memo } from 'react';
import { ChevronsRight, RotateCcw, Loader2 } from 'lucide-react';

interface StudentHomeFooterProps {
  isDisabled: boolean;
  isSubmitting: boolean;
  totalAdelanto: number;
  totalRecursamiento: number;
  onAdvance: () => void;
  onRetake: () => void;
  onSubmit: () => void;
}

const FOOTER_WRAPPER_CLASSES =
  'fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10';
const PRIMARY_BUTTON_DISABLED = 'bg-gray-300 cursor-not-allowed text-gray-500';
const PRIMARY_BUTTON_ENABLED = 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xl';

const StudentHomeFooter = memo(({
  isDisabled,
  isSubmitting,
  totalAdelanto,
  totalRecursamiento,
  onAdvance,
  onRetake,
  onSubmit,
}: StudentHomeFooterProps) => {
  return (
    <div className={FOOTER_WRAPPER_CLASSES}>
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Botones secundarios */}
        <div className="flex gap-4 sm:gap-6 text-sm font-medium">
          <button
            onClick={onAdvance}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronsRight size={16} />
            <span>Adelanto</span>
            {totalAdelanto > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalAdelanto}
              </span>
            )}
          </button>

          <button
            onClick={onRetake}
            className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors"
          >
            <RotateCcw size={16} />
            <span>Recursamiento</span>
            {totalRecursamiento > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalRecursamiento}
              </span>
            )}
          </button>
        </div>

        {/* Botón principal */}
        <button
          onClick={onSubmit}
          disabled={isDisabled || isSubmitting}
          className={`
            w-full sm:w-auto font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform active:scale-95
            flex items-center justify-center gap-2
            ${isDisabled || isSubmitting ? PRIMARY_BUTTON_DISABLED : PRIMARY_BUTTON_ENABLED}
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Enviando...
            </>
          ) : (
            'Confirmar Pre-inscripción'
          )}
        </button>
      </div>
    </div>
  );
});

StudentHomeFooter.displayName = 'StudentHomeFooter';
export default StudentHomeFooter;