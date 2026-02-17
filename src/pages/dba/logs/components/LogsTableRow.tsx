import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { SubmissionLog } from '@services/dba.service';

interface LogsTableRowProps {
  log: SubmissionLog;
}

const LogsTableRow = ({ log }: LogsTableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Formatear timestamp
  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  // Determinar color basado en la acción
  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const hasDetails = log.changesJson !== null || log.reason !== null;

  return (
    <>
      <tr className="hover:bg-gray-800/50 transition-colors">
        {/* Expand button */}
        <td className="px-6 py-3">
          {hasDetails ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          ) : (
            <div className="w-[18px]" />
          )}
        </td>

        {/* Admin Username */}
        <td className="px-6 py-3 text-white font-medium">
          {log.adminUsername}
        </td>

        {/* Student ID */}
        <td className="px-6 py-3 text-gray-300 text-center">
          {log.studentId ?? '-'}
        </td>

        {/* Entity */}
        <td className="px-6 py-3">
          <span className="text-white font-mono text-xs px-2 py-1 rounded">
            {log.entity}
          </span>
        </td>

        {/* Entity ID */}
        <td className="px-6 py-3 text-gray-300 font-mono text-sm">
          {log.entityId || '-'}
        </td>

        {/* Action */}
        <td className="px-6 py-3 text-center">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getActionColor(log.action)}`}
          >
            {log.action}
          </span>
        </td>

        {/* Timestamp */}
        <td className="px-6 py-3 text-gray-300 text-sm font-mono">
          {formatTimestamp(log.ts)}
        </td>
      </tr>

      {/* Expanded details row */}
      {isExpanded && hasDetails && (
        <tr className="bg-gray-900/50">
          <td colSpan={7} className="px-6 py-4">
            <div className="space-y-3">
              {/* Reason */}
              {log.reason && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-1 uppercase">
                    Razón
                  </h4>
                  <p className="text-sm text-gray-300">{log.reason}</p>
                </div>
              )}

              {/* Changes JSON */}
              {log.changesJson && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-1 uppercase">
                    Cambios
                  </h4>
                  <pre
                    className="text-xs text-gray-300 bg-gray-950 p-3 rounded-md overflow-x-auto border border-gray-800">
                    {JSON.stringify(log.changesJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default LogsTableRow;
