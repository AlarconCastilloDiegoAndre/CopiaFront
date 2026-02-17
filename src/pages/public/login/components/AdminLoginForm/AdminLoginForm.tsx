import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useAuth } from '@hooks/use-auth.ts';
import Button from '@components/Button';
import styles from './AdminLoginForm.module.css';

// Definir el tipo del formulario
type AdminLoginFormData = {
  username: string;
  password: string;
};

export const AdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  // Configurar React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AdminLoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      await adminLogin(data);
      navigate('/admin/dashboard');
    } catch (err: any) {
      // Establecer error general del formulario
      const msg = err.message || 'Usuario o contraseña incorrectos.';
      setError('root', {
        type: 'manual',
        message: msg,
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Acceso Administrativo</h2>
        <p className={styles.subtitle}>Solo personal autorizado</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Input de Usuario */}
        <div>
          <label htmlFor="username" className={styles.label}>
            Usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="usuario.escolares"
            className={styles.input}
            {...register('username', {
              required: 'El usuario es requerido',
              minLength: {
                value: 3,
                message: 'El usuario debe tener al menos 3 caracteres',
              },
            })}
          />
          {errors.username && (
            <p className={styles.errorField}>
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Input de Contraseña */}
        <div>
          <label htmlFor="admin-password" className={styles.label}>
            Contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={styles.input}
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorField}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error general del formulario */}
        {errors.root && (
          <p className={styles.error}>
            {errors.root.message}
          </p>
        )}

        {/* Botón de envío */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          Acceder al Panel
        </Button>
      </form>
    </div>
  );
};