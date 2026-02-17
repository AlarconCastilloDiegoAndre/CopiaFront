import SearchInput from '@components/Inputs/SearchInput/SearchInput.tsx';
import {
  FILTER_LABELS,
  SUBJECT_TYPE_OPTIONS,
  SUBJECT_TYPE_LABELS,
} from '../../constants/admin-dashboard.constants.ts';
import CustomListbox from '@components/CustomListBox/CustomListBox.tsx';
import formatCareerId from '@utils/formatCareerId.ts';
import type { Career, Period } from '@types';

interface EnrollmentsTableFiltersProps {
  careers: Career[];
  groups: number[];
  periods: Period[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCareer: string;
  setSelectedCareer: (value: string) => void;
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
  selectedSubjectType: string;
  setSelectedSubjectType: (value: string) => void;
}

const EnrollmentsTableFilters = (
  {
    careers,
    groups,
    periods,
    searchTerm,
    setSearchTerm,
    selectedCareer,
    setSelectedCareer,
    selectedGroup,
    setSelectedGroup,
    selectedPeriod,
    setSelectedPeriod,
    selectedSubjectType,
    setSelectedSubjectType,
  }: EnrollmentsTableFiltersProps) => {
  // Preparar opciones para carreras
  const careerOptions = [
    { value: '', label: FILTER_LABELS.ALL_CAREERS },
    ...careers.map((c) => ({
      value: c.careerId,
      label: formatCareerId(c.careerId),
    })),
  ];

  // Preparar opciones para grupos
  const groupOptions = [
    { value: '', label: FILTER_LABELS.ALL_GROUPS },
    ...groups.map((g) => ({
      value: String(g),
      label: `G - ${g}`,
    })),
  ];

  // Preparar opciones para periodos
  const periodOptions = [
    { value: '', label: FILTER_LABELS.ALL_PERIODS },
    ...periods.map((p) => ({
      value: p.periodId,
      label: p.periodId,
    })),
  ];

  // Preparar opciones para tipo de materia
  const subjectTypeOptions = [
    { value: SUBJECT_TYPE_OPTIONS.ALL, label: SUBJECT_TYPE_LABELS.ALL },
    { value: SUBJECT_TYPE_OPTIONS.NORMAL, label: SUBJECT_TYPE_LABELS.NORMAL },
    { value: SUBJECT_TYPE_OPTIONS.ADELANTO, label: SUBJECT_TYPE_LABELS.ADELANTO },
    { value: SUBJECT_TYPE_OPTIONS.RECURSAMIENTO, label: SUBJECT_TYPE_LABELS.RECURSAMIENTO },
  ];

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200 space-y-3">
      {/* Fila 1: Buscador */}
      <div className="w-full">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={FILTER_LABELS.SEARCH_PLACEHOLDER}
          className="w-full"
        />
      </div>

      {/* Fila 2: Selectores en grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Filtro Carrera */}
        <CustomListbox
          value={selectedCareer}
          onChange={setSelectedCareer}
          options={careerOptions}
          className="w-full"
          buttonClassName="w-full shadow-sm"
          ariaLabel="Filtrar por carrera"
        />

        {/* Filtro Grupo */}
        <CustomListbox
          value={selectedGroup}
          onChange={setSelectedGroup}
          options={groupOptions}
          className="w-full"
          buttonClassName="w-full shadow-sm"
          ariaLabel="Filtrar por grupo"
        />

        {/* Filtro Periodo */}
        <CustomListbox
          value={selectedPeriod}
          onChange={setSelectedPeriod}
          options={periodOptions}
          className="w-full"
          buttonClassName="w-full shadow-sm"
          ariaLabel="Filtrar por periodo"
        />

        {/* Filtro Tipo de Materia */}
        <CustomListbox
          value={selectedSubjectType}
          onChange={setSelectedSubjectType}
          options={subjectTypeOptions}
          className="w-full"
          buttonClassName="w-full shadow-sm"
          ariaLabel="Filtrar por tipo de materia"
        />
      </div>
    </div>
  );
};

export default EnrollmentsTableFilters;