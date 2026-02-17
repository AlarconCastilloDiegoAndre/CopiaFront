import { useCareerActions } from './hooks/use-career-actions.tsx';
import CardSkeleton from '@components/Cards/CardSkeleton';
import CareerCard from '@components/Cards/CareerCard';
import SearchInput from '@components/Inputs/SearchInput';
import Label from '@components/Label/Label.tsx';
import PageHeader from '@components/PageHeader';
import ErrorCard from '@components/ErrorCard';
import { Plus, Route } from 'lucide-react';
import Card from '@components/Cards/Card';
import Button from '@components/Button';

/**
 * CareersPage - Página principal para gestionar planes de estudio y carreras
 * - Muestra la lista de carreras.
 */
const CareersPage = () => {
  const {
    filteredCareers,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    handleCreateClick,
  } = useCareerActions();

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <main className="max-w-[80rem] mx-auto p-6" aria-labelledby="career-list">
      <Card>
        <PageHeader
          title="Planes de estudio"
          icon={<Route size={35} strokeWidth={1.5} />}
          actions={
            <Button onClick={handleCreateClick} className="px-4 py-2">
              <Plus size={20} className="mr-2" />
              Agregar plan de estudios
            </Button>
          }
        />

        <Label htmlFor="career-search" className="mt-4">Carreras</Label>
        <SearchInput
          id="career-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o plan..."
          className="w-full"
        />
      </Card>

      <div className="flex flex-col gap-4 mt-4">
        {isLoading ? (
          <CardSkeleton variant="career" count={6} />
        ) : filteredCareers.length > 0 ? (
          filteredCareers.map((career) => (
            <CareerCard
              key={career.careerId}
              career={career}
              href={`/admin/careers/${career.careerId}`}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Route className="text-gray-600" size={50} />
            </div>
            <p className="text-gray-600">
              {searchTerm
                ? 'No se encontraron carreras con ese criterio.'
                : 'No hay carreras disponibles.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CareersPage;