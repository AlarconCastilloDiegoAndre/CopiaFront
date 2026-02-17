import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { Student } from '@types';
import TableSkeleton from '@components/Tables/TableSkeleton';
import { Pencil } from 'lucide-react';

// Helper para definir columnas con tipado
const columnHelper = createColumnHelper<Student>();

// Definición de columnas
const columns = [
  // 1. Expediente
  columnHelper.accessor('studentId', {
    header: 'Expediente',
    cell: (info) => (
      <span className="font-mono font-bold text-gray-600">
        {info.getValue()}
      </span>
    ),
  }),

  // 2. Nombre del alumno
  columnHelper.accessor('name', {
    header: 'Nombre',
    cell: (info) => (
      <span className="font-medium text-gray-900">
        {info.getValue()}
      </span>
    ),
  }),

  // 3. Carrera
  columnHelper.accessor('career.name', {
    header: 'Carrera',
  }),

  // 4. Semestre
  columnHelper.accessor('semester', {
    header: 'Semestre',
    cell: (info) => <div className="text-center">{info.getValue()} °</div>,
  }),

  // 5. Grupo
  columnHelper.accessor('groupNo', {
    header: 'Grupo',
    cell: (info) => <div className="text-center">{info.getValue()}</div>,
  }),

  // 6. Estatus
  columnHelper.accessor('status', {
    header: 'Estatus',
    cell: (info) => {
      const status = info.getValue();
      const colors = {
        ACTIVO: 'bg-green-100 text-green-800',
        EGRESADO: 'bg-blue-100 text-blue-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status]}`}>
          {status}
        </span>
      );
    },
  }),

  // 7. Correo
  columnHelper.accessor('email', {
    header: 'Correo',
    cell: (info) => <span className="text-gray-500">{info.getValue()}</span>,
  }),
];

interface StudentsTableProps {
  data: Student[];
  isLoading?: boolean;
  onRowClick?: (student: Student) => void;
}

const StudentsTable = ({ data, isLoading = false, onRowClick }: StudentsTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <TableSkeleton columns={7} rows={8} showFilters={false} />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-main-color text-white font-semibold uppercase tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                {/* Columna extra para acciones */}
                <th className="px-4 py-3 text-center w-16">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`even:bg-gray-50 odd:bg-white transition-colors ${
                    onRowClick 
                      ? 'hover:bg-blue-50 cursor-pointer' 
                      : 'hover:bg-blue-100'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {/* Botón de editar */}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick?.(row.original);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar estudiante"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500 italic">
                  No se encontraron estudiantes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;