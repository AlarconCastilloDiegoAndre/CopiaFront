import { Lock, Eye, EyeOff, Save, Loader2, AlertCircle } from 'lucide-react';
import { useChangePassword } from '@hooks/use-change-password';

interface ChangePasswordFormProps {
  changePasswordService: (params: { currentPassword: string; newPassword: string }) => Promise<any>;
  minPasswordLength: number;
  buttonColor?: 'blue' | 'slate';
}

export const ChangePasswordForm = ({
  changePasswordService,
  minPasswordLength,
  buttonColor = 'blue',
}: ChangePasswordFormProps) => {
  const {
    showPasswordForm,
    setShowPasswordForm,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    hasChanges,
    handleSubmit,
    handleCancel,
    isLoading,
    fieldError,
    errorMessage,
    isSameAsCurrentPassword,
  } = useChangePassword({ changePasswordService, minPasswordLength });

  const buttonStyles =
    buttonColor === 'blue'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-slate-800 hover:bg-slate-900';

  // Estilos para inputs con error
  const getInputStyles = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    const hasError = fieldError === field;
    const baseStyles = 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 transition-colors';
    
    if (hasError) {
      return `${baseStyles} border-red-400 bg-red-50 focus:ring-red-500 focus:border-red-500`;
    }
    
    // Validación en tiempo real: nueva contraseña igual a actual
    if (field === 'newPassword' && isSameAsCurrentPassword) {
      return `${baseStyles} border-amber-400 bg-amber-50`;
    }
    
    // Validación: confirmar contraseña no coincide
    if (field === 'confirmPassword' && confirmPassword && newPassword !== confirmPassword) {
      return `${baseStyles} border-red-300 bg-red-50`;
    }
    
    return `${baseStyles} border-gray-300`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Lock size={20} className="text-blue-600" />
          Seguridad
        </h2>

        {!showPasswordForm && (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Cambiar contraseña
          </button>
        )}
      </div>

      {showPasswordForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contraseña actual */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={getInputStyles('currentPassword')}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldError === 'currentPassword' && (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <AlertCircle size={12} />
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={getInputStyles('newPassword')}
                  placeholder="••••••••"
                  minLength={minPasswordLength}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldError === 'newPassword' ? (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <AlertCircle size={12} />
                  {errorMessage}
                </p>
              ) : isSameAsCurrentPassword ? (
                <p className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                  <AlertCircle size={12} />
                  La nueva contraseña debe ser diferente a la actual
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Mínimo {minPasswordLength} caracteres</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={getInputStyles('confirmPassword')}
                placeholder="••••••••"
                required
              />
              {fieldError === 'confirmPassword' ? (
                <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <AlertCircle size={12} />
                  {errorMessage}
                </p>
              ) : confirmPassword && newPassword !== confirmPassword ? (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle size={12} />
                  Las contraseñas no coinciden
                </p>
              ) : null}
            </div>
          </div>

          {/* Error general (sin campo específico) */}
          {fieldError === null && errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                !hasChanges ||
                isLoading ||
                newPassword !== confirmPassword ||
                newPassword.length < minPasswordLength ||
                isSameAsCurrentPassword
              }
              className={`flex-1 px-4 py-2 ${buttonStyles} text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500">
          Puedes cambiar tu contraseña en cualquier momento para mantener tu cuenta segura.
        </p>
      )}
    </div>
  );
};