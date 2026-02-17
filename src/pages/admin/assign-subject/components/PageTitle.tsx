import React from 'react';
import BackLink from '@components/BackLink';
import PageHeader from '@components/PageHeader';
import type { Subject } from '@types';
import SubjectCard from '@components/Cards/SubjectCard';
import SearchInput from '@components/Inputs/SearchInput';
import { BookOpen } from 'lucide-react';

type SelectedSubject = {
  subject: Subject;
  semester?: number;
};

type Props = {
  careerId?: string | null;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  searchResults: Subject[];
  isSearching: boolean;
  handleAddSubject: (subject: Subject) => void;
  selectedSubjects: SelectedSubject[];
};

const PageTitle: React.FC<Props> = (
  {
    careerId,
    searchTerm,
    setSearchTerm,
    searchResults = [],
    isSearching = false,
    handleAddSubject,
    selectedSubjects = [],
  }) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <BackLink to={`/admin/careers/${careerId}`} />

      {/* Header con PageHeader component */}
      <PageHeader
        title={`Materias asignadas a plan - ${careerId}`}
        icon={<BookOpen size={30} color="black" />}
        iconBgColor="bg-[#037FFC]/30"
        iconSize="md"
      />

      {/* Buscador + dropdown */}
      <div className="w-full relative" aria-live="polite">
        <label htmlFor="subject-search" className="block text-sm font-semibold text-gray-700 mb-2">
          1. Buscar materia
        </label>

        <SearchInput
          id="subject-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o clave..."
          className="w-full"
        />

        {/* Desplegable de resultados */}
        {searchTerm && searchTerm.length > 2 && (
          <div className="absolute inset-x-0 -mt-0.5 z-30">
            <div
              className="bg-white -mt-1 border-2 border-t-0 border-gray-300 rounded-md rounded-t-none shadow-lg max-h-64 overflow-auto
              [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-main-color
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              {isSearching ? (
                <div className="p-3 text-sm text-gray-700">Buscando...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">No se encontraron materias.</div>
              ) : (
                <ul role="list" className="flex flex-col gap-1 p-2">
                  {searchResults.map((subject) => {
                    const isAdded = selectedSubjects.some((s) => s.subject.subjectId === subject.subjectId);
                    return (
                      <SubjectCard
                        key={subject.subjectId}
                        subject={subject}
                        showActions={false}
                        onClick={() => handleAddSubject(subject)}
                        isSelected={isAdded}
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle;