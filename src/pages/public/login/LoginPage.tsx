import { useState } from 'react';
import { AdminLoginForm } from './components/AdminLoginForm/AdminLoginForm';
import styles from './styles/LoginPage.module.css';
import { ADMIN_DATA, STUDENT_DATA } from './constants/loginConstants.ts';
import { InfoPanel } from '@pages/public/login/components/InfoPanel.tsx';
import { StudentAuthPanel } from '@pages/public/login/components/StudentAuthPanel.tsx';

export const LoginPage = () => {
  // Leer el último tipo de login desde localStorage
  const getInitialPanel = () => {
    const lastLoginType = localStorage.getItem('lastLoginType');
    // Si el último login fue como estudiante, mostrar el panel de estudiante (rightPanelActive)
    return lastLoginType === 'admin';
  };

  const [isPanelActive, setIsPanelActive] = useState(getInitialPanel);

  const togglePanel = () => {
    setIsPanelActive(!isPanelActive);
  };

  const cardClasses = `${styles.loginCard} ${isPanelActive ? styles.rightPanelActive : ''}`;

  return (
    <div className={styles.pageContainer}>
      <div className={cardClasses}>

        {/* Formularios (Admin y Estudiante) */}
        <div className={`${styles.formContainer} ${styles.adminFormContainer}`}>
          <AdminLoginForm />
        </div>
        <div className={`${styles.formContainer} ${styles.studentFormContainer}`}>
          <StudentAuthPanel />
        </div>

        {/* Overlay Container */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>

            {/* Panel Izquierdo (Admin Info) */}
            <div className={`${styles.overlayPanel} ${styles.overlayAdminPanel}`}>
              <InfoPanel
                {...ADMIN_DATA}
                onToggle={togglePanel}
              />
            </div>

            {/* Panel Derecho (Student Info) */}
            <div className={`${styles.overlayPanel} ${styles.overlayStudentPanel}`}>
              <InfoPanel
                {...STUDENT_DATA}
                onToggle={togglePanel}
              />
            </div>

          </div>
        </div>

        {/* Botón de móvil */}
        <div className={styles.mobileToggleContainer}>
          <button className={styles.mobileToggleButton} onClick={togglePanel}>
            {isPanelActive
              ? '¿Eres estudiante? Accede aquí'
              : '¿Eres administrador? Accede aquí'
            }
          </button>
        </div>

      </div>
    </div>
  );
};