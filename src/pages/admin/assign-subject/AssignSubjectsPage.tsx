import React from 'react';
import { Switch } from '@headlessui/react';
import { useAssignSubjectActions } from './hooks/use-assign-subject-actions.tsx';
import SelectedSubjectCard from './components/SelectedSubjectCard.tsx';
import Card from '@components/Cards/Card';
import PageTitle from './components/PageTitle.tsx';
import Button from '@components/Button';
import { Save } from 'lucide-react';

const AssignSubjectsPage: React.FC = () => {
  const {
    careerId,
    searchTerm,
    setSearchTerm,
    selectedSubjects,
    handleAddSubject,
    removeSelectedSubject,
    setSubjectSemester,
    searchResults,
    isSearching,
    isSaving,
    useSameSemester,
    setUseSameSemester,
    unifiedSemester,
    semesters,
    handleUnifiedSemesterChange,
    handleClearConfirm,
    handleSubmit,
  } = useAssignSubjectActions();

  return (
    <div className="max-w-[80rem] mx-auto p-6 text-[#0f1724]" aria-labelledby="assign-page-title">
      <form onSubmit={handleSubmit}>
        <Card>
          {/* Paso 1: Búsqueda y selección */}
          <PageTitle
            careerId={careerId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            isSearching={isSearching}
            handleAddSubject={handleAddSubject}
            selectedSubjects={selectedSubjects}
          />

          {/* Separador visual */}
          <div className="border-t border-gray-200 my-6" />

          {/* Paso 2: Materias a asignar */}
          <section aria-label="Materias seleccionadas">
            <div className="flex justify-between items-center gap-4 mb-4">
              <div className="text-sm font-semibold text-gray-700">2. Materias a asignar</div>

              <button
                type="button"
                onClick={handleClearConfirm}
                className="px-3 py-1.5 rounded-md text-sm bg-[#C91F1F] text-white hover:bg-[#C20324] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#005A9C]"
              >
                Limpiar
              </button>
            </div>

            {selectedSubjects.length === 0 ? (
              <div className="text-center p-4 text-sm text-gray-500 bg-gray-50 rounded-md">
                Aún no agregas materias.
              </div>
            ) : (
              <>
                {/* Checkbox para modo "mismo semestre" */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <Switch.Group>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Switch.Label className="text-sm font-medium text-gray-700 cursor-pointer">
                          Asignar todas las materias al mismo semestre
                        </Switch.Label>
                        <Switch.Description className="text-xs text-gray-500 mt-1">
                          Activa esta opción para asignar todas las materias seleccionadas al mismo semestre
                        </Switch.Description>
                      </div>

                      <Switch
                        checked={useSameSemester}
                        onChange={setUseSameSemester}
                        className={`${
                          useSameSemester ? 'bg-blue-600' : 'bg-gray-300'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring-global`}
                      >
                        <span
                          className={`${
                            useSameSemester ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </div>
                  </Switch.Group>

                  {/* Selector de semestre unificado (solo visible cuando está activo) */}
                  {useSameSemester && (
                    <div className="mt-3 flex items-center gap-2">
                      <label htmlFor="unified-semester" className="text-sm font-medium text-gray-700">
                        Semestre:
                      </label>
                      <select
                        id="unified-semester"
                        value={unifiedSemester}
                        onChange={(e) => handleUnifiedSemesterChange(Number(e.target.value))}
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus-ring-global"
                      >
                        {semesters.map((s) => (
                          <option key={s} value={s}>
                            Semestre {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <ul className="flex flex-col gap-2" role="list">
                  {selectedSubjects.map((sel) => (
                    <SelectedSubjectCard
                      key={sel.subject.subjectId}
                      subject={sel.subject}
                      semester={sel.semester}
                      setSubjectSemester={setSubjectSemester}
                      removeSelectedSubject={removeSelectedSubject}
                      isUnifiedSemester={useSameSemester}
                    />
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* Separador visual */}
          <div className="border-t border-gray-200 my-6" />

          {/* Paso 3: Guardar cambios */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-700 mb-2">3. Guardar cambios</div>

                {/* Resumen de materias seleccionadas */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Total de materias:</span>
                    <span
                      className="inline-flex items-center justify-center min-w-[28px] h-[28px] px-2 bg-main-color text-white rounded-full font-bold text-sm"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {selectedSubjects.length}
                    </span>
                  </div>

                  {useSameSemester && selectedSubjects.length > 0 && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <span className="hidden sm:inline">-</span>
                      <span>Todas las materias serán asignadas al semestre {unifiedSemester}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  disabled={isSaving || selectedSubjects.length === 0}
                  className="w-full sm:w-auto px-4 py-2"
                >
                  <Save />
                  <span className="ml-2">{isSaving ? 'Guardando...' : 'Guardar'}</span>
                </Button>
              </div>
            </div>
          </section>
        </Card>
      </form>
    </div>
  );
};

export default AssignSubjectsPage;