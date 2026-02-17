import { ShieldAlert } from 'lucide-react';

export const DbaUnauthorizedScreen = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Acceso Denegado</h1>
        <p className="text-gray-400 text-sm">
          El token proporcionado no es válido o no fue proporcionado.
        </p>
      </div>
    </div>
  );
};
