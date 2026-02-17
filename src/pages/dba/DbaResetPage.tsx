import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  ScrollText,
  Search,
  User,
} from 'lucide-react';
import { useDbaReset } from './hooks/useDbaReset';
import { DbaUnauthorizedScreen } from './components/DbaUnauthorizedScreen';
import { DbaLogsTab } from './components/DbaLogsTab';

const DbaResetPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const {
    isValidating,
    isAuthorized,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    selectedStudent,
    setSelectedStudent,
    handleSelectStudent,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    isResetting,
    handleReset,
  } = useDbaReset(token);

  // --- PANTALLA DE CARGA ---
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Validando acceso...</p>
        </div>
      </div>
    );
  }

  // --- PANTALLA DE NO AUTORIZADO ---
  if (!isAuthorized) {
    return <DbaUnauthorizedScreen />;
  }

  // --- PANTALLA PRINCIPAL ---
  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className={activeTab === 'logs' ? 'max-w-[90rem] mx-auto' : 'max-w-xl mx-auto'}>
        {/* Exit Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Salir</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-700/50">
            <KeyRound size={30} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Panel DBA
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Administración del sistema
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('passwords')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'passwords'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            <KeyRound size={16} />
            Contraseñas
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'logs'
              ? 'bg-emerald-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            <ScrollText size={16} />
            Logs de Admins
          </button>
        </div>

        {/* Tab: Contraseñas */}
        {activeTab === 'passwords' && (
          <>
            {/* Buscador */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar estudiante
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Expediente o nombre..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div
                      className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="mt-3 border border-gray-700 rounded-xl overflow-hidden">
                  {searchResults.map((s) => (
                    <button
                      key={s.studentId}
                      onClick={() => handleSelectStudent(s)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-800 border-b border-gray-700/50 last:border-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white font-medium">{s.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({s.studentId})</span>
                        </div>
                        <span className="text-xs text-gray-500">{s.career}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.email}</p>
                    </button>
                  ))}
                </div>
              )}

              {searchTerm.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
                <p className="text-gray-500 text-sm mt-3 text-center">
                  No se encontraron estudiantes.
                </p>
              )}
            </div>

            {/* Estudiante seleccionado + formulario */}
            {selectedStudent && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                {/* Info del estudiante */}
                <div className="flex items-start gap-4 mb-6 pb-5 border-b border-gray-800">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                    <User size={22} className="text-slate-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold">{selectedStudent.name}</h3>
                    <p className="text-gray-500 text-sm">Expediente: {selectedStudent.studentId}</p>
                    <p className="text-gray-500 text-sm truncate">{selectedStudent.email}</p>
                    <p className="text-gray-500 text-sm">
                      {selectedStudent.career} — Semestre {selectedStudent.semester}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-gray-500 hover:text-gray-300 text-sm shrink-0"
                  >
                    Cambiar
                  </button>
                </div>

                {/* Advertencia */}
                <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-800/40 rounded-xl p-3 mb-5">
                  <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-amber-400/90 text-xs">
                    La nueva contraseña reemplazará la actual del estudiante de forma inmediata. Esta acción no se puede
                    deshacer.
                  </p>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Confirmar contraseña
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetir contraseña"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">Las contraseñas no coinciden</p>
                    )}
                  </div>

                  <button
                    onClick={handleReset}
                    disabled={isResetting || newPassword.length < 8 || newPassword !== confirmPassword}
                    className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
                  >
                    {isResetting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </span>
                    ) : (
                      'Resetear Contraseña'
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab: Logs */}
        {activeTab === 'logs' && <DbaLogsTab />}
      </div>
    </div>
  );
};

export default DbaResetPage;