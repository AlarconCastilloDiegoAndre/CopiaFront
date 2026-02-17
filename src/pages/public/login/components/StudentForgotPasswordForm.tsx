import { IoInformationCircle } from 'react-icons/io5';
import styles from '../styles/StudentAuth.module.css';

type Props = {
  onSubmit: (studentId: number) => Promise<void>;
  onToggle: () => void;
};

export const StudentForgotPasswordForm = ({ onToggle }: Props) => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recuperar Contraseña</h2>
        <p className={styles.subtitle}>¿Olvidaste tu contraseña?</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Icono */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IoInformationCircle size={56} color="#003366" />
        </div>

        {/* Mensaje */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '0.5rem',
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#1E40AF',
              fontWeight: 600,
              fontSize: '0.9375rem',
              margin: '0 0 0.5rem 0',
            }}
          >
            Contacta al coordinador de tu carrera
          </p>
          <p
            style={{
              color: '#3B82F6',
              fontSize: '0.8125rem',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Para restablecer tu contraseña, acude directamente con el coordinador
            de tu carrera o envíale un correo electrónico solicitando el cambio.
          </p>
        </div>

        {/* Nota adicional */}
        <p
          style={{
            color: '#6B7280',
            fontSize: '0.8125rem',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          El coordinador verificará tu identidad y realizará el restablecimiento
          de tu contraseña.
        </p>

        {/* Volver al Login */}
        <div className={styles.toggleContainer}>
          <p className={styles.toggleText}>¿Recordaste tu contraseña?</p>
          <button type="button" onClick={onToggle} className={styles.toggleButton}>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};