import { StudentLoginForm } from './StudentLoginForm.tsx';
import { StudentRegisterForm } from './StudentRegisterForm.tsx';
import { StudentForgotPasswordForm } from './StudentForgotPasswordForm.tsx';
import { useStudentAuth } from '../hooks/use-student-auth.ts';

export const StudentAuthPanel = () => {
  const {
    currentView,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    goToLogin,
    goToRegister,
    goToForgotPassword,
    studentLogin,
  } = useStudentAuth();

  return (
    <>
      {currentView === 'login' && (
        <StudentLoginForm
          onLogin={handleLogin}
          onToggleRegister={goToRegister}
          onToggleForgotPassword={goToForgotPassword}
        />
      )}
      {currentView === 'register' && (
        <StudentRegisterForm
          /*@ts-ignore */
          onRegister={handleRegister}
          onToggle={goToLogin}
          studentLogin={studentLogin}
        />
      )}
      {currentView === 'forgot-password' && (
        <StudentForgotPasswordForm
          onSubmit={handleForgotPassword}
          onToggle={goToLogin}
        />
      )}
    </>
  );
};