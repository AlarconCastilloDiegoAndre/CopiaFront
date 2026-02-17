import { useEnrollmentDetails } from './hooks/use-enrollment-details.ts';
import EnrollmentContextHeader from './components/EnrollmentContextHeader.tsx';
import EnrolledStudentsTable from './components/EnrolledStudentsTable.tsx';
import ErrorCard from '@components/ErrorCard';
import Card from '@components/Cards/Card';
import PageHeader from '@components/PageHeader';
import { Users } from 'lucide-react';

const EnrollmentDetailsPage = () => {
  const {
    context,
    students,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    hasValidParams
  } = useEnrollmentDetails();

  // Si no hay parámetros válidos
  if (!hasValidParams) {
    return (
      <div className="max-w-[80rem] mx-auto p-6">
        <ErrorCard
          error="Parámetros inválidos. Asegúrate de acceder a esta página desde el dashboard."
        />
      </div>
    );
  }

  // Si hay error en la petición
  if (error) {
    return (
      <div className="max-w-[80rem] mx-auto p-6">
        <ErrorCard error={error} />
      </div>
    );
  }

  return (
    <div className="max-w-[80rem] mx-auto p-6 text-[#0f1724]">
      {/* Header con contexto */}
      {context && (
        <EnrollmentContextHeader
          context={context}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {/* Tabla de estudiantes */}
      <div className="mt-6">
        <Card>
          <PageHeader
            title="Estudiantes Inscritos"
            icon={<Users size={30} />}
          />
          <div className="mt-4">
            <EnrolledStudentsTable
              data={students}
              type={context?.type}
              isLoading={isLoading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnrollmentDetailsPage;
