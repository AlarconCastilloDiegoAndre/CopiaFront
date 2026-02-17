import { useCareerActions } from '@pages/admin/careers/hooks/use-career-actions.tsx';
import { useCareerDetailActions } from './hooks/use-career-detail-actions.tsx';
import SemesterSection from './components/SemesterSection.tsx';
import ListSkeleton from '@components/Lists/ListSkeleton';
import SearchInput from '@components/Inputs/SearchInput';
import PageTitle from './components/PageTitle.tsx';
import ErrorCard from '@components/ErrorCard';
import { useParams } from 'react-router-dom';
import BackLink from '@components/BackLink';
import Card from '@components/Cards/Card';
import { useState } from 'react';

const CareerDetailPage = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    isLoading,
    error,
    career,
    groupedAssignments,
    handleRemoveClick,
    handleEditClick,
  } = useCareerDetailActions(careerId, searchTerm);

  const {
    handleEditCareerClick,
    handleDeleteCareerClick,
  } = useCareerActions();

  if (isLoading) {
    return (
      <main className="max-w-[80rem] mx-auto p-6">
        <Card className="mb-4">
          <div className="h-20 flex items-center">
            <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded"></div>
          </div>
        </Card>
        <ListSkeleton variant="card" items={5} />
      </main>
    );
  }

  // Mostrar error de carga en la página
  if (error) {
    return (<ErrorCard error={error} backTo="/admin/careers" />
    );
  }

  if (!career) {
    return (
      <div className="max-w-[80rem] mx-auto p-6 text-[#0f1724]">
        <div className="text-red-700 p-6 bg-white border rounded-lg">
          Carrera no encontrada
        </div>
        <BackLink to="/admin/careers" title="Volver a clarreras" />
      </div>
    );
  }

  const semesters = Object.keys(groupedAssignments).map(Number).sort((a, b) => a - b);
  const isSearching = searchTerm.length > 0;
  const totalAssigned = Object.values(groupedAssignments).reduce(
    (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
    0,
  );

  return (
    <main className="max-w-[80rem] mx-auto p-6 text-[#0f1724]" aria-labelledby="career-title">
      <Card>
        <PageTitle
          career={career}
          count={totalAssigned}
          onEditCareer={handleEditCareerClick}
          onDeleteCareer={handleDeleteCareerClick}
        />
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar materia por nombre o clave..."
          className="w-full pt-2"
        />
      </Card>

      <div className="flex flex-col gap-6 pt-4">
        {semesters.length > 0 ? (
          semesters.map((semester, index) => {
            const items = groupedAssignments[semester] || [];
            const defaultOpen = isSearching ? true : index === 0;

            return (
              <SemesterSection
                key={semester}
                semester={semester}
                items={items}
                defaultOpen={defaultOpen}
                careerId={career.careerId}
                onRemoveSubject={handleRemoveClick}
                onEditSubject={handleEditClick}
              />
            );
          })
        ) : (
          <div className="text-center p-8 bg-white rounded-md text-gray-500">
            {searchTerm ? (
              <p>No se encontraron materias con el término &quot;{searchTerm}&quot;.</p>
            ) : (
              <p>No hay materias asignadas a esta carrera.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CareerDetailPage;