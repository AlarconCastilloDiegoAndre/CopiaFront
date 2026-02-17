import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import Button from '@components/Button';
import styles from '../styles/StudentAuth.module.css';

type StudentLoginFormData = {
  studentId: number;
  password: string;
};

type Props = {
  onLogin: (data: StudentLoginFormData) => Promise<void>;
  onToggleRegister: () => void;
  onToggleForgotPassword: () => void;
};

export const StudentLoginForm = (
  {
    onLogin,
    onToggleRegister,
    onToggleForgotPassword,
  }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<StudentLoginFormData>();

  const onSubmit = async (data: StudentLoginFormData) => {
    try {
      await onLogin(data);
    } catch (err: any) {
      const msg = err.message || 'Expediente o contraseña incorrectos.';
      setError('root', {
        type: 'manual',
        message: msg,
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Portal Estudiantes</h2>
        <p className={styles.subtitle}>Ingresa con tu expediente</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Expediente */}
        <div>
          <label htmlFor="studentId" className={styles.label}>Expediente</label>
          <input
            id="studentId"
            type="number"
            placeholder="Ej: 123456"
            className={`${styles.input} ${errors.studentId ? styles.error : ''}`}
            {...register('studentId', {
              required: 'El expediente es requerido',
              valueAsNumber: true,
            })}
          />
          {errors.studentId && <p className={styles.errorField}>{errors.studentId.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className={styles.label}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`${styles.input} ${errors.password ? styles.error : ''}`}
              {...register('password', { required: 'La contraseña es requerida' })}
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
          {errors.password && <p className={styles.errorField}>{errors.password.message}</p>}
        </div>

        {/* Link Olvidé mi contraseña */}
        <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={onToggleForgotPassword}
            className={styles.forgotPasswordLink}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {errors.root && <p className={styles.error}>{errors.root.message}</p>}

        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Iniciar sesión
        </Button>

        {/* Toggle a Registro */}
        <div className={styles.toggleContainer}>
          <p className={styles.toggleText}>¿No tienes una cuenta?</p>
          <button type="button" onClick={onToggleRegister} className={styles.toggleButton}>
            Registrarse aquí
          </button>
        </div>
      </form>
    </div>
  );
};