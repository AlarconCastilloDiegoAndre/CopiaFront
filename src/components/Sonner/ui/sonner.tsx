import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import React from 'react';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"

      // AQUÍ AGREGAMOS LA CONFIGURACIÓN DE ESTILOS GLOBAL
      toastOptions={{
        classNames: {
          // !items-start: Fuerza la alineación arriba
          // !p-4: Asegura buen padding
          toast: 'group toast group-[.toaster]:!items-start group-[.toaster]:!p-4 bg-background text-foreground border-border shadow-lg -mr-5',

          // !mt-1: Baja un poquito el icono para centrarlo con la primera línea de texto
          icon: 'group-[.toaster]:!mt-1',

          description: 'group-[.toaster]:text-muted-foreground w-full',
          actionButton: 'group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground',
          cancelButton: 'group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground',
        },
      }}

      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };