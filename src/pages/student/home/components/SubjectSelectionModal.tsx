import { Fragment, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ChevronsRight, RotateCcw, AlertCircle } from 'lucide-react';
import SelectableSubjectCard from '@components/Cards/SubjectCard/SelectableSubjectCard';
import type { CareerSubject } from '@types';

interface SubjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: 'adelanto' | 'recursamiento';
  subjects: CareerSubject[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  studentSemester: number;
  isMaxReached?: boolean;
  maxSubjects?: number;
  totalSelected?: number;
}

export default function SubjectSelectionModal({
  isOpen,
  onClose,
  title,
  description,
  type,
  subjects,
  selectedIds,
  onToggle,
  studentSemester,
  isMaxReached = false,
  maxSubjects = 8,
  totalSelected = 0,
}: SubjectSelectionModalProps) {
  // Agrupar materias por semestre
  const groupedSubjects = useMemo(() => {
    const groups: Record<number, CareerSubject[]> = {};

    subjects.forEach((subject) => {
      const sem = subject.semester;
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(subject);
    });

    // Ordenar semestres
    const sortedSemesters = Object.keys(groups)
      .map(Number)
      .sort((a, b) => (type === 'adelanto' ? a - b : b - a));

    return sortedSemesters.map((sem) => ({
      semester: sem,
      subjects: groups[sem],
    }));
  }, [subjects, type]);

  const iconColor = type === 'adelanto' ? 'text-blue-600' : 'text-amber-600';
  const iconBg = type === 'adelanto' ? 'bg-blue-100' : 'bg-amber-100';
  const Icon = type === 'adelanto' ? ChevronsRight : RotateCcw;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all max-h-[85vh] flex flex-col">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <Dialog.Title className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    <div className={`p-2 rounded-lg ${iconBg}`}>
                      <Icon className={iconColor} size={24} />
                    </div>
                    {title}
                  </Dialog.Title>

                  <button
                    className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* DESCRIPCIÓN */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm text-gray-600">{description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <p className="text-xs text-gray-500">
                      Tu semestre actual: <span className="font-semibold">{studentSemester}°</span>
                    </p>
                    {/* Indicador de límite */}
                    <p className={`text-xs font-medium ${isMaxReached ? 'text-amber-600' : 'text-gray-500'}`}>
                      Materias seleccionadas: <span className="font-semibold">{totalSelected}/{maxSubjects}</span>
                    </p>
                  </div>
                </div>

                {/* Banner de límite alcanzado */}
                {isMaxReached && (
                  <div className="mx-6 mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle size={18} className="text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-700">
                      Has alcanzado el límite de <strong>{maxSubjects} materias</strong>. 
                      Deselecciona alguna para agregar más.
                    </p>
                  </div>
                )}

                {/* CONTENIDO - LISTA DE MATERIAS */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {groupedSubjects.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No hay materias disponibles</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {groupedSubjects.map(({ semester, subjects: semSubjects }) => (
                        <div key={semester}>
                          {/* Header del semestre */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              {semester}° Semestre
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-500">
                              {semSubjects.length} materia{semSubjects.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Lista de materias del semestre */}
                          <ul className="space-y-2">
                            {semSubjects.map((cs) => {
                              const isSelected = selectedIds.has(cs.career_subject_id);
                              // Deshabilitar si se alcanzó el límite y no está seleccionada
                              const isDisabled = isMaxReached && !isSelected;

                              return (
                                <SelectableSubjectCard
                                  key={cs.career_subject_id}
                                  subject={cs.subject}
                                  isSelected={isSelected}
                                  onToggle={() => onToggle(cs.career_subject_id)}
                                  disabled={isDisabled}
                                />
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{selectedIds.size}</span> materia
                      {selectedIds.size !== 1 ? 's' : ''} seleccionada{selectedIds.size !== 1 ? 's' : ''} en {type}
                    </p>

                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Confirmar Selección
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}