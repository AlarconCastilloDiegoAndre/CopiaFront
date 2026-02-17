import { IoCheckmarkCircle } from 'react-icons/io5';
import styles from '../styles/StudentAuth.module.css';

export const RegistrationSuccess = () => {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <IoCheckmarkCircle className={styles.successIcon} />
        <h2 className={styles.successTitle}>¡Cuenta creada con éxito!</h2>
        <p className={styles.successSubtitle}>
          Te estamos redirigiendo a tu panel de estudiante...
        </p>
      </div>
    </div>
  );
};
