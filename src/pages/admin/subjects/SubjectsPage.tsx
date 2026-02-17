import { IoAdd } from 'react-icons/io5';
import { ArrowUpFromLine, BookOpen } from 'lucide-react';
import Card from '@components/Cards/Card';
import PageHeader from '@components/PageHeader';
import SearchInput from '@components/Inputs/SearchInput';
import Button from '@components/Button';
import { useSubjectsActions } from './hooks/use-subjects-actions.tsx';
import { SubjectList } from './components/SubjectList.tsx';
import ErrorCard from '@components/ErrorCard';
import { useState } from 'react';
import { importSubjectsExcelService } from '@services/subjects.service';
import { toast } from 'sonner';
import ImportExcelModal from './components/ImportExcelModal.tsx';

const SubjectsPage = () => {
  const {
    subjects,
    isLoading,
    searchTerm,
    setSearchTerm,
    hasNextPage,
    fetchNextPage,
    scrollToSubjectId,
    clearScrollTarget,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleDeleteClick,
    error,
    refetch,
  } = useSubjectsActions();

  const [isImporting, setIsImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Manejador para cuando se selecciona el archivo desde el modal
  const handleImportFile = async (file: File) => {
    setIsImporting(true);

    try {
      const result = await importSubjectsExcelService(file);
      
      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold text-base">Importación exitosa</p>
          <p className="text-sm">
            Se importaron <strong>{result.inserted}</strong> de <strong>{result.totalRows}</strong> materias
          </p>
        </div>
      );
      
      refetch();
      setShowImportModal(false);
    } catch (err: any) {
      console.error('Error al importar:', err);
      
      if (err?.errors && Array.isArray(err.errors)) {
        toast.error(
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            <p className="font-bold text-base">
              {err.message || 'Errores en el archivo'}
            </p>
            <div className="text-sm space-y-1">
              {err.errors.slice(0, 5).map((error: any, idx: number) => (
                <div key={idx} className="border-l-2 border-red-400 pl-2">
                  <strong>Fila {error.row}:</strong> {error.message}
                </div>
              ))}
              {err.errors.length > 5 && (
                <p className="text-xs opacity-75 mt-2">
                  ... y {err.errors.length - 5} errores más
                </p>
              )}
            </div>
          </div>,
          { duration: 8000 }
        );
      } else if (err?.subjectIds?.length) {
        toast.error(
          <div className="flex flex-col gap-1">
            <p className="font-bold text-base">Claves duplicadas</p>
            <p className="text-sm">
              Las siguientes claves ya existen en el sistema:
            </p>
            <p className="text-sm font-mono bg-red-100 p-2 rounded">
              {err.subjectIds.join(', ')}
            </p>
          </div>,
          { duration: 6000 }
        );
      } else if (err?.message) {
        toast.error(
          <div className="flex flex-col gap-1">
            <p className="font-bold text-base">Error al importar</p>
            <p className="text-sm">{err.message}</p>
          </div>
        );
      } else {
        toast.error(
          <div className="flex flex-col gap-1">
            <p className="font-bold text-base">Error al importar</p>
            <p className="text-sm">
              Verifica que el archivo tenga el formato correcto (.xlsx) con las columnas: <strong>subjectId</strong> y <strong>name</strong>
            </p>
          </div>
        );
      }
    } finally {
      setIsImporting(false);
    }
  };

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <main className="max-w-[80rem] mx-auto p-6 text-[#0f1724]">
      <Card>
        <PageHeader
          title="Gestión de Materias"
          icon={<BookOpen />}
          actions={
            <div className="flex sm:flex-row items-stretch gap-3 flex-col">
              <Button 
                onClick={handleOpenCreateModal} 
                className="px-4 py-2 min-w-[11rem]"
              >
                <IoAdd size={20} className="mr-2" />
                Crear Materia
              </Button>

              <Button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 min-w-[11rem]"
                disabled={isImporting}
                isLoading={isImporting}
              >
                <ArrowUpFromLine size={20} className="mr-2" />
                {isImporting ? 'Importando...' : 'Importar Excel'}
              </Button>
            </div>
          }
        />
        
        <SearchInput
          id="subject-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o clave..."
          className="w-full mt-4"
        />
      </Card>

      <div className="mt-4">
        <SubjectList
          isLoading={isLoading}
          subjects={subjects}
          searchTerm={searchTerm}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          handleOpenEditModal={handleOpenEditModal}
          handleDeleteClick={handleDeleteClick}
          scrollToSubjectId={scrollToSubjectId}
          clearScrollTarget={clearScrollTarget}
        />
      </div>

      {/* Modal de importación */}
      <ImportExcelModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportFile}
        isImporting={isImporting}
      />
    </main>
  );
};

export default SubjectsPage;