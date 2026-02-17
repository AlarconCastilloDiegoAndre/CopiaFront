import { useState } from 'react';
import { CheckCircle, BookOpen, ChevronsRight, RotateCcw, Download, Loader2 } from 'lucide-react';
import type { EnrollmentStatusResponse } from '@services/enrollments.service';
import { generateEnrollmentPDF } from '@utils/generateEnrollmentPDF';

interface Props {
  enrollmentStatus: EnrollmentStatusResponse;
  studentName: string;
  studentId?: number;
  careerName?: string;
  semester?: number;
  groupNo?: number;
}

export function EnrollmentConfirmed({ 
  enrollmentStatus, 
  studentName,
  studentId,
  careerName,
  semester,
  groupNo,
}: Props) {
  const { summary, enrollments, period } = enrollmentStatus;
  const [isExporting, setIsExporting] = useState(false);

  // Agrupar materias por tipo
  const normalSubjects = enrollments.filter((e) => e.type === 'NORMAL');
  const adelantoSubjects = enrollments.filter((e) => e.type === 'ADELANTO');
  const recursamientoSubjects = enrollments.filter((e) => e.type === 'RECURSAMIENTO');

  // Handler para exportar PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateEnrollmentPDF({
        studentName,
        studentId,
        careerName,
        semester,
        groupNo,
        periodId: period?.periodId || '',
        enrollments,
        summary,
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el comprobante. Intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header de éxito */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Inscripción Confirmada!
          </h1>

          <p className="text-gray-500 mb-4">
            {studentName}, tu inscripción para el periodo{' '}
            <span className="font-semibold text-gray-700">{period?.periodId}</span>{' '}
            ha sido registrada exitosamente.
          </p>

          {/* Resumen */}
          {summary && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen size={16} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700 uppercase">
                    Normales
                  </span>
                </div>
                <span className="text-2xl font-bold text-emerald-700">{summary.normal}</span>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ChevronsRight size={16} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase">
                    Adelanto
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-700">{summary.adelanto}</span>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <RotateCcw size={16} className="text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700 uppercase">
                    Recursamiento
                  </span>
                </div>
                <span className="text-2xl font-bold text-amber-700">{summary.recursamiento}</span>
              </div>
            </div>
          )}

          {/* Botón de exportar PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download size={20} />
                Descargar Comprobante
              </>
            )}
          </button>
        </div>

        {/* Lista de materias inscritas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Materias Inscritas ({enrollments.length})
          </h2>

          <div className="space-y-4">
            {/* Normales */}
            {normalSubjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-emerald-100 rounded">
                    <BookOpen size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">
                    Normales ({normalSubjects.length})
                  </span>
                </div>
                <ul className="space-y-1 ml-7">
                  {normalSubjects.map((e) => (
                    <li key={e.enrollmentId} className="text-sm text-gray-700">
                      • {e.subjectName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Adelanto */}
            {adelantoSubjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <ChevronsRight size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-700">
                    Adelanto ({adelantoSubjects.length})
                  </span>
                </div>
                <ul className="space-y-1 ml-7">
                  {adelantoSubjects.map((e) => (
                    <li key={e.enrollmentId} className="text-sm text-gray-700">
                      • {e.subjectName}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recursamiento */}
            {recursamientoSubjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-amber-100 rounded">
                    <RotateCcw size={14} className="text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-amber-700">
                    Recursamiento ({recursamientoSubjects.length})
                  </span>
                </div>
                <ul className="space-y-1 ml-7">
                  {recursamientoSubjects.map((e) => (
                    <li key={e.enrollmentId} className="text-sm text-gray-700">
                      • {e.subjectName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}