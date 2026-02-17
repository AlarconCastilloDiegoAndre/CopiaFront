import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Save, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import type { Student } from '@types';
import { useCareersQuery } from '@hooks/use-careers-query';
import CustomListbox from '@components/CustomListBox/CustomListBox';
import ConfirmStudentEditModal from './ConfirmStudentEditModal';

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (studentId: number, data: UpdateStudentData) => Promise<void>;
  isLoading?: boolean;
}

export interface UpdateStudentData {
  name: string;
  email: string;
  semester: number;
  groupNo: number;
  careerId: string;
  status: 'ACTIVO' | 'EGRESADO';
}

// Opciones para semestre (1-12)
const SEMESTER_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}° Semestre`,
}));

// Opciones para estatus
const STATUS_OPTIONS = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'EGRESADO', label: 'Egresado' },
];

const StudentEditModal = ({
  isOpen,
  onClose,
  student,
  onSave,
  isLoading = false,
}: StudentEditModalProps) => {
  // Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<UpdateStudentData | null>(null);

  // Obtener lista de carreras
  const { data: careers = [], isLoading: loadingCareers } = useCareersQuery();

  const CAREER_OPTIONS = careers?.map((career) => ({
    value: career.careerId,
    label: `${career.careerId} - ${career.name}`,
  })) || [];

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateStudentData>({
    defaultValues: {
      name: '',
      email: '',
      semester: 1,
      groupNo: 1,
      careerId: '',
      status: 'ACTIVO',
    },
  });

  // Cargar datos del estudiante cuando se abre el modal
  useEffect(() => {
    if (student && isOpen) {
      reset({
        name: student.name || '',
        email: student.email || '',
        semester: student.semester || 1,
        groupNo: student.groupNo || 1,
        careerId: student.career?.careerId || '',
        status: student.status || 'ACTIVO',
      });
    }
  }, [student, isOpen, reset]);

  // Manejar submit - mostrar confirmación
  const onSubmit = (data: UpdateStudentData) => {
    setPendingData(data);
    setShowConfirmModal(true);
  };

  // Confirmar y guardar
  const handleConfirmSave = async () => {
    if (!student || !pendingData) return;
    setShowConfirmModal(false);
    await onSave(student.studentId, pendingData);
    setPendingData(null);
  };

  // Cancelar confirmación
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setPendingData(null);
  };

  // Cerrar y resetear
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setPendingData(null);
      setShowConfirmModal(false);
    }
  };

  // Estilos
  const inputClasses =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm';
  const inputErrorClasses =
    'w-full px-4 py-2.5 border border-red-400 bg-red-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm';
  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1.5';
  const errorClasses = 'text-xs text-red-600 mt-1';

  return (
    <>
      {/* Modal Principal de Edición */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Editar Estudiante
                      </Dialog.Title>
                      {student && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          Expediente:{' '}
                          <span className="font-mono font-semibold">{student.studentId}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleClose}
                      disabled={isLoading}
                      className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors disabled:opacity-50"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {/* Nombre */}
                    <div>
                      <label htmlFor="name" className={labelClasses}>
                        Nombre Completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Juan Pérez"
                        className={errors.name ? inputErrorClasses : inputClasses}
                        {...register('name', {
                          required: 'El nombre es requerido',
                          minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                        })}
                      />
                      {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
                    </div>

                    {/* Correo */}
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Correo Electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className={errors.email ? inputErrorClasses : inputClasses}
                        {...register('email', {
                          required: 'El correo es requerido',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Correo electrónico inválido',
                          },
                        })}
                      />
                      {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                    </div>

                    {/* Carrera */}
                    <div>
                      <label htmlFor="careerId" className={labelClasses}>
                        Carrera
                      </label>
                      <Controller
                        name="careerId"
                        control={control}
                        rules={{
                          required: 'La carrera es requerida',
                          validate: (value) => value !== '' || 'Selecciona una carrera',
                        }}
                        render={({ field }) => (
                          <CustomListbox
                            value={field.value}
                            onChange={field.onChange}
                            options={CAREER_OPTIONS}
                            placeholder="Selecciona una carrera"
                            buttonClassName={`w-full ${errors.careerId ? 'border-red-400' : ''}`}
                            ariaLabel="Seleccionar carrera"
                            disabled={loadingCareers}
                          />
                        )}
                      />
                      {errors.careerId && <p className={errorClasses}>{errors.careerId.message}</p>}
                    </div>

                    {/* Grid: Semestre y Grupo */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Semestre */}
                      <div>
                        <label htmlFor="semester" className={labelClasses}>
                          Semestre
                        </label>
                        <Controller
                          name="semester"
                          control={control}
                          rules={{ required: 'Requerido' }}
                          render={({ field }) => (
                            <CustomListbox
                              value={field.value}
                              onChange={(val) => field.onChange(Number(val))}
                              options={SEMESTER_OPTIONS}
                              placeholder="Selecciona"
                              buttonClassName={`w-full ${errors.semester ? 'border-red-400' : ''}`}
                              ariaLabel="Seleccionar semestre"
                            />
                          )}
                        />
                        {errors.semester && <p className={errorClasses}>{errors.semester.message}</p>}
                      </div>

                      {/* Grupo */}
                      <div>
                        <label htmlFor="groupNo" className={labelClasses}>
                          Grupo
                        </label>
                        <input
                          id="groupNo"
                          type="number"
                          min={1}
                          placeholder="35"
                          className={errors.groupNo ? inputErrorClasses : inputClasses}
                          {...register('groupNo', {
                            required: 'Requerido',
                            min: { value: 1, message: 'Mínimo 1' },
                            valueAsNumber: true,
                          })}
                        />
                        {errors.groupNo && <p className={errorClasses}>{errors.groupNo.message}</p>}
                      </div>
                    </div>

                    {/* Estatus */}
                    <div>
                      <label htmlFor="status" className={labelClasses}>
                        Estatus
                      </label>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Requerido' }}
                        render={({ field }) => (
                          <CustomListbox
                            value={field.value}
                            onChange={field.onChange}
                            options={STATUS_OPTIONS}
                            placeholder="Selecciona estatus"
                            buttonClassName={`w-full ${errors.status ? 'border-red-400' : ''}`}
                            ariaLabel="Seleccionar estatus"
                          />
                        )}
                      />
                      {errors.status && <p className={errorClasses}>{errors.status.message}</p>}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-[#003d6b] text-white rounded-lg hover:bg-[#002d4f] font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Guardar Cambios
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de Confirmación */}
      <ConfirmStudentEditModal
        isOpen={showConfirmModal}
        onClose={handleCancelConfirm}
        onConfirm={handleConfirmSave}
        studentId={student?.studentId}
        data={pendingData}
      />
    </>
  );
};

export default StudentEditModal;