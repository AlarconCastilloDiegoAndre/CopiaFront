import { memo, useState } from 'react';
import { useEnrollmentSelection } from '@hooks/use-enrollment-selection';
import ErrorCard from '@components/ErrorCard';
import ListSkeleton from '@components/Lists/ListSkeleton';

import HomeSummary from './components/HomeSummary';
import HomeSubjectList from './components/HomeSubjectList';
import HomeFooter from './components/HomeFooter';
import SubjectSelectionModal from './components/SubjectSelectionModal';
import { EnrollmentClosed } from './components/EnrollmentClosed';
import { EnrollmentConfirmed } from './components/EnrollmentConfirmed';

import { usePeriodsQuery } from '@hooks/use-periods-query';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle } from 'lucide-react';

const StudentHome = memo(() => {
  const enrollment = useEnrollmentSelection();
  const { data: periods = [] } = usePeriodsQuery();
  const activePeriod = periods.find((p) => p.active);

  // Estado del modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Validación de fechas
  const isEnrollmentOpen = (() => {
    if (!activePeriod) return false;

    const now = new Date();
    const start = new Date(activePeriod.startDate);
    const end = new Date(activePeriod.endDate);
    end.setHours(23, 59, 59, 999);

    return now >= start && now <= end;
  })();

  // Error
  if (enrollment.error) {
    return <ErrorCard error={enrollment.error} />;
  }

  // Loading
  if (enrollment.isLoading || !enrollment.student) {
    return (
      <div className="min-h-screen bg-gray-50 pb-40 sm:pb-24">
        <div className="max-w-3xl mx-auto pt-8 px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8 h-40 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          <ListSkeleton variant="card" items={5} />
        </div>
      </div>
    );
  }

  // Inscripciones cerradas
  if (!isEnrollmentOpen) {
    return <EnrollmentClosed activePeriod={activePeriod} />;
  }

  // Ya tiene inscripción confirmada
  if (enrollment.hasConfirmedEnrollment && enrollment.enrollmentStatus) {
    return (
      <EnrollmentConfirmed
        enrollmentStatus={enrollment.enrollmentStatus}
        studentName={enrollment.student.name}
        studentId={enrollment.student.studentId}
        careerName={enrollment.student.career?.name}
        semester={enrollment.student.semester}
        groupNo={enrollment.student.groupNo}
      />
    );
  }

  // Handler: abre el modal de confirmación
  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  // Handler: confirma y envía
  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    enrollment.handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-40 sm:pb-24">
      <div className="max-w-3xl mx-auto pt-8 px-4">
        {/* Resumen con las 3 categorías */}
        <HomeSummary
          totalSubjects={enrollment.currentSemesterSubjects.length}
          totalNormal={enrollment.totalNormal}
          totalAdelanto={enrollment.totalAdelanto}
          totalRecursamiento={enrollment.totalRecursamiento}
        />

        {/* Lista de materias del semestre actual */}
        <HomeSubjectList
          items={enrollment.currentSemesterSubjects}
          semester={enrollment.student.semester}
          selectedIds={enrollment.normalIds}
          onToggle={enrollment.toggleNormal}
          isMaxReached={enrollment.isMaxReached}
          maxSubjects={enrollment.maxSubjects}
          totalSelected={enrollment.totalSelected}
        />
      </div>

      {/* Footer con acciones */}
      <HomeFooter
        isDisabled={enrollment.totalSelected === 0}
        isSubmitting={enrollment.isSubmitting}
        totalAdelanto={enrollment.totalAdelanto}
        totalRecursamiento={enrollment.totalRecursamiento}
        onAdvance={enrollment.openAdelantoModal}
        onRetake={enrollment.openRecursamientoModal}
        onSubmit={handleConfirmClick}
      />

      {/* Modal de confirmación */}
      <Transition appear show={showConfirmModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                  {/* Icono */}
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <AlertTriangle size={32} className="text-amber-600" />
                    </div>
                  </div>

                  {/* Título */}
                  <Dialog.Title className="text-lg font-bold text-gray-900 text-center">
                    ¿Confirmar pre-inscripción?
                  </Dialog.Title>

                  {/* Mensaje */}
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      Estás a punto de confirmar tu inscripción con{' '}
                      <span className="font-semibold text-gray-900">{enrollment.totalSelected} materia{enrollment.totalSelected !== 1 ? 's' : ''}</span>.
                    </p>
                    <p className="text-sm text-red-600 font-semibold mt-3">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>

                  {/* Resumen */}
                  <div className="mt-4 bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
                    {enrollment.totalNormal > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Normales</span>
                        <span className="font-semibold text-emerald-700">{enrollment.totalNormal}</span>
                      </div>
                    )}
                    {enrollment.totalAdelanto > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adelanto</span>
                        <span className="font-semibold text-blue-700">{enrollment.totalAdelanto}</span>
                      </div>
                    )}
                    {enrollment.totalRecursamiento > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recursamiento</span>
                        <span className="font-semibold text-amber-700">{enrollment.totalRecursamiento}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-1 flex justify-between font-semibold">
                      <span className="text-gray-700">Total</span>
                      <span className="text-gray-900">{enrollment.totalSelected}</span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmSubmit}
                      className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de Adelanto */}
      <SubjectSelectionModal
        isOpen={enrollment.isAdelantoModalOpen}
        onClose={enrollment.closeAdelantoModal}
        title="Solicitar Adelanto"
        description="Selecciona las materias de semestres superiores que deseas adelantar. Solo puedes adelantar hasta 2 semestres arriba de tu semestre actual."
        type="adelanto"
        subjects={enrollment.adelantoSubjects}
        selectedIds={enrollment.adelantoIds}
        onToggle={enrollment.toggleAdelanto}
        studentSemester={enrollment.student.semester}
        isMaxReached={enrollment.isMaxReached}
        maxSubjects={enrollment.maxSubjects}
        totalSelected={enrollment.totalSelected}
      />

      {/* Modal de Recursamiento */}
      <SubjectSelectionModal
        isOpen={enrollment.isRecursamientoModalOpen}
        onClose={enrollment.closeRecursamientoModal}
        title="Solicitar Recursamiento"
        description="Selecciona las materias de semestres anteriores que necesitas recursar."
        type="recursamiento"
        subjects={enrollment.recursamientoSubjects}
        selectedIds={enrollment.recursamientoIds}
        onToggle={enrollment.toggleRecursamiento}
        studentSemester={enrollment.student.semester}
        isMaxReached={enrollment.isMaxReached}
        maxSubjects={enrollment.maxSubjects}
        totalSelected={enrollment.totalSelected}
      />
    </div>
  );
});

StudentHome.displayName = 'StudentHome';
export default StudentHome;