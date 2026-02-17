import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmStudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentId?: number;
  data: {
    name: string;
    email: string;
    semester: number;
    groupNo: number;
    careerId: string;
    status: 'ACTIVO' | 'EGRESADO';
  } | null;
}

const ConfirmStudentEditModal = ({
  isOpen,
  onClose,
  onConfirm,
  studentId,
  data,
}: ConfirmStudentEditModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
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
              <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                {/* Icono */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <AlertTriangle size={28} className="text-amber-600" />
                  </div>
                </div>

                {/* Título */}
                <Dialog.Title className="text-lg font-bold text-gray-900 text-center">
                  ¿Confirmar cambios?
                </Dialog.Title>

                {/* Mensaje */}
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-600">
                    Estás a punto de actualizar los datos del estudiante con expediente{' '}
                    <span className="font-semibold font-mono text-gray-900">{studentId}</span>.
                  </p>
                </div>

                {/* Resumen de cambios */}
                {data && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nombre:</span>
                      <span className="font-medium text-gray-900 truncate ml-2 max-w-[180px]">
                        {data.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Correo:</span>
                      <span className="font-medium text-gray-900 truncate ml-2 max-w-[180px]">
                        {data.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Carrera:</span>
                      <span className="font-medium text-gray-900">{data.careerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Semestre:</span>
                      <span className="font-medium text-gray-900">{data.semester}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Grupo:</span>
                      <span className="font-medium text-gray-900">{data.groupNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estatus:</span>
                      <span
                        className={`font-medium ${
                          data.status === 'ACTIVO' ? 'text-green-700' : 'text-blue-700'
                        }`}
                      >
                        {data.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2.5 bg-[#003d6b] text-white rounded-xl hover:bg-[#002d4f] font-medium transition-colors text-sm"
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
  );
};

export default ConfirmStudentEditModal;