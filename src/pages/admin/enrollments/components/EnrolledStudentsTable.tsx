import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { EnrolledStudent } from '@types';
import TableSkeleton from '@components/Tables/TableSkeleton';

// Helper para definir columnas con tipado
const columnHelper = createColumnHelper<EnrolledStudent>();

// Función para generar columnas dinámicamente según el tipo
const getColumns = (type?: string) => {
  const baseColumns = [
    columnHelper.accessor('studentId', {
      header: 'Expediente',
      cell: (info) => (
        <span className="font-mono font-bold text-gray-600">
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: (info) => (
        <span className="font-medium text-gray-900">
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.accessor('email', {
      header: 'Correo',
      cell: (info) => (
        <span className="text-gray-500">
          {info.getValue()}
        </span>
      ),
    }),
  ];

  // Solo agregar columna de Grupo si NO es tipo NORMAL
  if (type && type !== 'NORMAL') {
    baseColumns.push(
      columnHelper.accessor('groupNo', {
        header: 'Grupo',
        cell: (info) => (
          <div className="text-center">
            {info.getValue()}
          </div>
        ),
      })
    );
  }

  // Agregar columna de Estado al final
  baseColumns.push(
    columnHelper.accessor('state', {
      header: 'Estado',
      cell: (info) => {
        const state = info.getValue();

        const colors: Record<string, string> = {
          BORRADOR: 'bg-yellow-100 text-yellow-800',
          CONFIRMADO: 'bg-green-100 text-green-800',
          CANCELADO: 'bg-red-100 text-red-800',
        };

        return (
          <span
            className={`
              px-2 py-1 rounded-full text-xs font-bold
              ${colors[state] ?? 'bg-gray-100 text-gray-800'}
            `}
          >
            {state}
          </span>
        );
      },
    })
  );

  return baseColumns;
};

interface EnrolledStudentsTableProps {
  data: EnrolledStudent[];
  type?: string;
  isLoading?: boolean;
}

const EnrolledStudentsTable = (
  {
    data,
    type,
    isLoading = false,
  }: EnrolledStudentsTableProps) => {
  const columns = getColumns(type);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <TableSkeleton
        columns={5}
        rows={8}
        showFilters={false}
      />
    );
  }

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-main-color text-white font-semibold uppercase tracking-wider">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.length ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="even:bg-gray-50 odd:bg-white hover:bg-blue-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500 italic"
                >
                  No hay estudiantes inscritos en esta materia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrolledStudentsTable;
