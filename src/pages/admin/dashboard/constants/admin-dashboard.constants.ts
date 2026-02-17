// Constantes para la tabla de inscripciones
export const TABLE_COLUMNS = {
  CAREER: 'Carrera',
  SEMESTER_GROUP: 'Semestre/grupo',
  SUBJECT: 'Materia',
  TYPE: 'Tipo',
  ENROLLED: 'Inscritos',
} as const;

// Columnas ordenables
export const SORTABLE_COLUMNS = {
  CAREER: 'career',
  SUBJECT: 'subject',
  SEMESTER: 'semester',
  TYPE: 'type',
  ENROLLED: 'totalStudents',
} as const;

// Opciones para el tipo de materia
export const SUBJECT_TYPE_OPTIONS = {
  ALL: '',
  NORMAL: 'normal',
  ADELANTO: 'adelanto',
  RECURSAMIENTO: 'recursamiento',
} as const;

// Etiquetas para el tipo de materia
export const SUBJECT_TYPE_LABELS = {
  ALL: 'Todos los Tipos',
  NORMAL: 'Normal',
  ADELANTO: 'Adelanto',
  RECURSAMIENTO: 'Recursamiento',
} as const;

// Etiquetas para los filtros
export const FILTER_LABELS = {
  ALL_CAREERS: 'Todas las Carreras',
  ALL_GROUPS: 'Todos',
  ALL_PERIODS: 'Todos los Periodos',
  SEARCH_PLACEHOLDER: 'Buscar materia...',
} as const;