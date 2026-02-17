import { Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '@hooks/use-auth.ts';
import { getDefaultRoute } from '@utils/navigation';
import type { User } from '@types';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Memoized Header component to prevent logo re-renders
const LayoutHeader = React.memo<{ user: User | null }>(({ user }) => {
  return (
    <header
      className="bg-main-color text-white py-3 px-4 sm:py-[15px] sm:px-[40px] flex flex-col sm:flex-row items-center shadow-md flex-shrink-0">
      {/* Contenedor de logos: centra en móvil, se alinea a la izquierda en sm+ */}
      <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
        <Link to={getDefaultRoute(user)} className="flex items-center no-underline flex-shrink-0">
          <img
            src="/src/assets/logo/uaq-logo.webp"
            alt="Logo UAQ"
            loading="lazy"
            className="h-8 sm:h-[60px] m-0 object-contain"
          />

          {/* LÍNEA VERTICAL: solo visible en pantallas sm+ */}
          <div className="hidden sm:block w-px h-[45px] bg-white/50 mx-4" aria-hidden="true" />

          <img
            src="/src/assets/logo/escudo_FIF.webp"
            alt="Logo FIF"
            loading="lazy"
            className="h-8 sm:h-[60px] object-contain"
          />
        </Link>
      </div>

      {/* Título: separado en móvil (debajo) y alineado a la izquierda en sm+ */}
      <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left">
        <span className="text-[1rem] sm:text-[1.25rem] font-medium uppercase tracking-wide">
          Universidad Autónoma de Querétaro
        </span>
      </div>
    </header>
  );
});

LayoutHeader.displayName = 'LayoutHeader';

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-[#f0f4f8]">
      <LayoutHeader user={user} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;