import { useState } from 'react';
import SearchInput from '@components/Inputs/SearchInput/SearchInput.tsx';
import Button from '@components/Button';
import StudentsTable from './components/StudentsTable.tsx';
import StudentEditModal from './components/StudentEditModal.tsx';
import { useStudents } from './hooks/use-students.ts';
import PageHeader from '@components/PageHeader';
import Card from '@components/Cards/Card';
import { GraduationCap } from 'lucide-react';
import ErrorCard from '@components/ErrorCard';
import Label from '@components/Label';
import type { Student } from '@types';

const StudentsPage = () => {
  const {
    students,
    meta,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    error,
    updateStudent,
    isUpdating,
  } = useStudents();

  // Estado del modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Handler para abrir el modal con un estudiante
  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  // Handler para guardar cambios
  const handleSaveStudent = async (studentId: number, data: any) => {
    await updateStudent({ studentId, data });
    handleCloseModal();
  };

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <div className="max-w-[80rem] mx-auto p-6 text-[#0f1724]">
      <Card>
        <PageHeader
          title="Directorio de estudiantes"
          icon={<GraduationCap size={30} />}
        />
        <Label htmlFor="student-search" className="mt-4">Buscar estudiante</Label>
        <SearchInput
          id="student-search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nombre, expediente o correo..."
          className="w-full pt-2"
        />
      </Card>

      <div className="flex flex-col gap-6 pt-4">
        <StudentsTable 
          data={students} 
          isLoading={isLoading} 
          onRowClick={handleRowClick}
        />

        {/* Paginación Simple */}
        {meta && !isLoading && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              Página {meta.currentPage} de {meta.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      <StudentEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        student={selectedStudent}
        onSave={handleSaveStudent}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default StudentsPage;