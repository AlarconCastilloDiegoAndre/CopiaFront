import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { FileSpreadsheet, Download, Upload, X, Info } from 'lucide-react';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
  isImporting: boolean;
}

export default function ImportExcelModal({ isOpen, onClose, onImport, isImporting }: ImportExcelModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImport(file);
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    // Crear plantilla desde el frontend
    const headers = ['subjectId', 'name'];
    const examples = [
      [2001, 'Administración'],
      [2002, 'Introducción a las Tecnologías de Información'],
      [2003, 'Ética y Legislación Informática'],
    ];

    // Usar una librería simple CSV como fallback, pero idealmente generar xlsx
    // Aquí creamos un CSV que Excel puede abrir
    const csvContent = [
      headers.join(','),
      ...examples.map(row => `${row[0]},"${row[1]}"`),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_materias.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileSpreadsheet size={22} className="text-green-700" />
                    </div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Importar Materias desde Excel
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                  {/* Formato requerido */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Info size={16} className="text-blue-600" />
                      Formato requerido del archivo
                    </h3>

                    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#1E3A5F] text-white">
                            <th className="px-4 py-2.5 text-left font-medium">subjectId</th>
                            <th className="px-4 py-2.5 text-left font-medium">name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2 text-blue-600 font-mono">2001</td>
                            <td className="px-4 py-2 text-gray-700">Administración</td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-white">
                            <td className="px-4 py-2 text-blue-600 font-mono">2002</td>
                            <td className="px-4 py-2 text-gray-700">Intro. a las TI</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-blue-600 font-mono">2003</td>
                            <td className="px-4 py-2 text-gray-700">Ética y Legislación</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Reglas */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-amber-800 mb-2">Consideraciones:</p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• El archivo debe ser <strong>.xlsx</strong> o <strong>.csv</strong></li>
                      <li>• Los encabezados deben ser exactamente: <code className="bg-amber-100 px-1 rounded text-xs">subjectId</code> y <code className="bg-amber-100 px-1 rounded text-xs">name</code></li>
                      <li>• No se permiten claves duplicadas en el archivo</li>
                      <li>• No se importarán materias con claves ya existentes</li>
                    </ul>
                  </div>

                  {/* Descargar plantilla */}
                  <button
                    onClick={handleDownloadTemplate}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-green-300 text-green-700 rounded-xl hover:bg-green-50 font-medium transition-colors"
                  >
                    <Download size={18} />
                    Descargar plantilla de ejemplo
                  </button>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".xlsx"
                    className="hidden"
                    disabled={isImporting}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f1724] text-white rounded-xl hover:bg-[#1a2744] font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Upload size={18} />
                    {isImporting ? 'Importando...' : 'Seleccionar archivo'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}