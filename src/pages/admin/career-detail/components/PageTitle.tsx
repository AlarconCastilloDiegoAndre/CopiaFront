import BackLink from '@components/BackLink';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';
import { IoAdd } from 'react-icons/io5';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { HiDotsVertical } from 'react-icons/hi';
import formatCareerId from '@utils/formatCareerId.ts';
import type { Career } from '@types';
import { LuBookOpen } from 'react-icons/lu';
import React from 'react';

type PageTitleProps = {
  career: Career;
  count?: number;
  onEditCareer: (careerId: string, currentName: string) => void;
  onDeleteCareer: (careerId: string, name: string) => void;
};

const PageTitle: React.FC<PageTitleProps> = (
  {
    career,
    count,
    onEditCareer,
    onDeleteCareer,
  }) => {
  const navigate = useNavigate();

  const handleNavigateToAssign = () => {
    navigate(`/admin/careers/${career.careerId}/assign-subject`);
  };

  const formattedSubtitle = career.careerId
    ? `PLAN: ${formatCareerId(career.careerId)}`
    : undefined;

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Volver */}
      <BackLink to="/admin/careers" />

      {/* Contenedor principal */}
      <div className="w-full flex flex-col gap-3">

        {/* PageHeader con acciones */}
        <PageHeader
          title={`Materias asignadas - ${career.name}`}
          subtitle={formattedSubtitle}
          icon={<LuBookOpen color="black" size={30} />}
          iconBgColor="bg-[#037FFC]/30"
          className="min-w-0"
          actions={
            <div className="flex-shrink-0 flex items-center gap-2">
              <Button
                className="w-auto px-3 py-1.5 text-sm"
                type="button"
                onClick={handleNavigateToAssign}
                title="Asignar materias"
              >
                <IoAdd size={20} className="mr-2" />
                Asignar materias
              </Button>

              <Menu as="div" className="relative">
                <Menu.Button
                  className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-main-color/10 transition-colors focus-ring-global"
                  title="Opciones de gestion de carrera"
                >
                  <HiDotsVertical size={20} />
                </Menu.Button>

                <Menu.Items
                  className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10"
                >
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onEditCareer(career.careerId, career.name)}
                          className={`${
                            active ? 'bg-main-color/10 text-main-color' : 'text-main-color'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                        >
                          <MdEdit size={16} className="mr-2" />
                          Editar Carrera
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onDeleteCareer(career.careerId, career.name)}
                          className={`${
                            active ? 'bg-red-600/10 text-[#C91F1F]' : 'text-[#C91F1F]'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                        >
                          <MdDelete size={16} className="mr-2" />
                          Eliminar Carrera
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          }
        />

        {/* Badge de contador - Siempre debajo del PageHeader */}
        {typeof count === 'number' && (
          <div className="flex items-center gap-2">
            <p className="text-sm font-normal text-gray-600">Materias asignadas:</p>
            <span
              className="inline-flex items-center justify-center flex-shrink-0 min-w-[28px] h-[28px] px-2 bg-main-color text-white rounded-full font-bold text-sm"
              aria-live="polite"
              aria-atomic="true"
              title={`${count} materias asignadas`}
            >
              {count}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle;