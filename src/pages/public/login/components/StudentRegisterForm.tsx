import { Controller, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import Button from '@components/Button';
import CustomListbox from '@components/CustomListBox/CustomListBox';
import styles from '../styles/StudentAuth.module.css';
import { useCareersQuery } from '@hooks/use-careers-query.ts';
import { RegistrationSuccess } from './RegistrationSuccess';
import type { User } from '@types';

type RegisterFormData = {
  studentId: string;
  name: string;
  email: string;
  password: string;
  groupNo: string;
  semester: number;
  careerId: string;
};

type Props = {
  onRegister: (data: RegisterFormData) => Promise<any>;
  onToggle: () => void;
  studentLogin: (credentials: { studentId: number; password: string }) => Promise<User>;
};

// Opciones para semestre (1-12)
const SEMESTER_OPTIONS = Array.from({ length: 9 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}° Semestre`,
}));

export const StudentRegisterForm = ({ onRegister, onToggle, studentLogin }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegisterFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    defaultValues: {
      studentId: '',
      name: '',
      email: '',
      password: '',
      groupNo: '',
      semester: 1,
      careerId: '',
    },
  });
  const { data: careers, isLoading: loadingCareers } = useCareersQuery();

  const CAREER_OPTIONS = careers?.map(career => ({
    value: career.careerId,
    label: `${career.careerId} - ${career.name}`,
  })) || [];

  // Effect para hacer login después de mostrar pantalla de éxito
  useEffect(() => {
    if (showSuccess && registrationData) {
      const timer = setTimeout(async () => {
        try {
          await studentLogin({
            studentId: Number(registrationData.studentId),
            password: registrationData.password,
          });
        } catch (error) {
          console.error('Error en login post-registro:', error);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, registrationData, studentLogin]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await onRegister(data);
      // Guardar datos para login posterior
      setRegistrationData(data);
      // Mostrar pantalla de éxito
      setShowSuccess(true);
    } catch (err: any) {
      const msg = err.message || 'Error al registrarse';
      setError('root', { type: 'manual', message: msg });
    }
  };

  // Si el registro fue exitoso, mostrar pantalla de éxito
  if (showSuccess) {
    return <RegistrationSuccess />;
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Crear Cuenta</h2>
        <p className={styles.subtitle}>Completa tus datos escolares</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        {/* Expediente con IMask */}
        <div>
          <label htmlFor="studentId" className={styles.label}>Expediente</label>
          <Controller
            name="studentId"
            control={control}
            rules={{ required: 'El expediente es requerido' }}
            render={({ field }) => (
              <IMaskInput
                id="studentId"
                mask={Number}
                value={field.value}
                onAccept={(value) => field.onChange(value)}
                placeholder="20240001"
                className={`${styles.input} ${errors.studentId ? styles.inputError : ''}`}
                lazy={false}
              />
            )}
          />
          {errors.studentId && <p className={styles.errorField}>{errors.studentId.message}</p>}
        </div>

        {/* Nombre Completo */}
        <div>
          <label htmlFor="name" className={styles.label}>Nombre Completo</label>
          <input
            id="name"
            type="text"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Juan Pérez"
            {...register('name', { required: 'El nombre es requerido' })}
          />
          {errors.name && <p className={styles.errorField}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={styles.label}>Correo Institucional</label>
          <input
            id="email"
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="juan.perez@uaq.mx"
            autoComplete="new-email"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && <p className={styles.errorField}>{errors.email.message}</p>}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className={styles.label}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="••••••••"
              autoComplete="new-password"
              spellCheck={false}
              inputMode="text"
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
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
            <p className={styles.errorField}>{errors.password.message}</p>
          )}
        </div>

        {/* Grid: Semestre y Grupo */}
        <div className={styles.gridContainer}>
          {/* Semestre - CustomListbox */}
          <div>
            <label htmlFor="semester" className={styles.label}>Semestre</label>
            <Controller
              name="semester"
              control={control}
              rules={{ required: 'Requerido' }}
              render={({ field }) => (
                <CustomListbox
                  value={field.value}
                  onChange={field.onChange}
                  options={SEMESTER_OPTIONS}
                  placeholder="Selecciona"
                  buttonClassName={`w-full ${errors.semester ? styles.listboxError : ''}`}
                  ariaLabel="Seleccionar semestre"
                />
              )}
            />
            {errors.semester && <p className={styles.errorField}>{errors.semester.message}</p>}
          </div>

          {/* Grupo - IMask */}
          <div>
            <label htmlFor="groupNo" className={styles.label}>Grupo</label>
            <Controller
              name="groupNo"
              control={control}
              rules={{ required: 'Requerido' }}
              render={({ field }) => (
                <IMaskInput
                  id="groupNo"
                  mask={Number}
                  value={field.value}
                  onAccept={(value) => field.onChange(value)}
                  placeholder="10"
                  className={`${styles.input} ${errors.groupNo ? styles.inputError : ''}`}
                  lazy={false}
                />
              )}
            />
            {errors.groupNo && <p className={styles.errorField}>{errors.groupNo.message}</p>}
          </div>
        </div>

        {/* Clave Carrera - CustomListbox */}
        <div>
          <label htmlFor="careerId" className={styles.label}>Clave Carrera</label>
          <Controller
            name="careerId"
            control={control}
            rules={{ required: 'La carrera es requerida' }}
            render={({ field }) => (
              <CustomListbox
                value={field.value}
                onChange={field.onChange}
                options={CAREER_OPTIONS}
                placeholder="Selecciona tu carrera"
                buttonClassName={`w-full ${errors.careerId ? styles.listboxError : ''}`}
                ariaLabel="Seleccionar carrera"
                disabled={loadingCareers}
              />
            )}
          />
          {errors.careerId && <p className={styles.errorField}>{errors.careerId.message}</p>}
        </div>

        {/* Error general */}
        {errors.root && <p className={styles.error}>{errors.root.message}</p>}

        {/* Botón Submit */}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Registrarse
        </Button>

        {/* Toggle a Login */}
        <div className={styles.toggleContainer}>
          <p className={styles.toggleText}>¿Ya tienes cuenta?</p>
          <button type="button" onClick={onToggle} className={styles.toggleButton}>
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  );
};