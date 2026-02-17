# 📚 Pre-Altas Frontend

Sistema de gestión de pre-inscripciones académicas desarrollado con React, TypeScript y Vite.

## 📋 Descripción

Aplicación web para la gestión de pre-inscripciones (pre-altas) de estudiantes a materias universitarias. Permite a los administradores gestionar carreras, materias, periodos y inscripciones, mientras que los estudiantes pueden visualizar y seleccionar materias disponibles.

## ✨ Características

### 👨‍💼 Panel de Administración
- **Dashboard**: Visualización y gestión de inscripciones con filtros por periodo y tipo
- **Gestión de Carreras**: CRUD completo de carreras universitarias
- **Gestión de Materias**: Administración de materias por carrera y semestre
- **Gestión de Periodos**: Control de periodos académicos
- **Gestión de Estudiantes**: Visualización y administración de estudiantes
- **Asignación de Materias**: Vinculación de materias a carreras

### 👨‍🎓 Portal del Estudiante
- **Registro e Inicio de Sesión**: Autenticación segura
- **Selección de Materias**: Visualización y selección de materias disponibles
- **Perfil de Usuario**: Gestión de información personal

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | React 19 |
| **Lenguaje** | TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Estilos** | TailwindCSS 4 |
| **Estado del Servidor** | TanStack Query v5 |
| **Estado Global** | Zustand |
| **Formularios** | React Hook Form |
| **Enrutamiento** | React Router v7 |
| **HTTP Client** | Axios |
| **UI Components** | Headless UI, Lucide Icons |
| **Notificaciones** | Sonner |
| **Tablas** | TanStack Table |

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos (imágenes, logos)
├── components/      # Componentes reutilizables
│   ├── Button/
│   ├── Cards/
│   ├── Inputs/
│   ├── Layout/
│   ├── Tables/
│   └── ...
├── hooks/           # Custom hooks
├── lib/             # Utilidades y configuraciones
├── pages/           # Páginas de la aplicación
│   ├── admin/       # Páginas del administrador
│   │   ├── dashboard/
│   │   ├── careers/
│   │   ├── subjects/
│   │   ├── periods/
│   │   ├── students/
│   │   └── enrollments/
│   ├── student/     # Páginas del estudiante
│   │   ├── home/
│   │   └── profile/
│   └── public/      # Páginas públicas (login)
├── providers/       # Context providers
├── routes/          # Configuración de rutas
├── services/        # Servicios API
├── stores/          # Estado global (Zustand)
├── styles/          # Estilos globales
├── types/           # Definiciones de tipos TypeScript
└── utils/           # Funciones utilitarias
```

## 🚀 Instalación

### Prerrequisitos

- Node.js >= 18
- npm o pnpm

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/AlarconCastilloDiegoAndre/pre-altas-frontend
   cd pre-altas-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=http://localhost:3005/
   VITE_HOST=127.0.0.1
   VITE_PORT=8000
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:8000`

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila TypeScript y genera build de producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para análisis de código |

## 🔌 API Backend

Este frontend requiere el backend de pre-altas ejecutándose. Por defecto se conecta a:
- **URL Base**: `http://localhost:3005/`

Asegúrate de que el servidor backend esté corriendo antes de iniciar la aplicación.

## 🔐 Roles de Usuario

| Rol | Acceso |
|-----|--------|
| **Administrador** | Gestión completa del sistema (carreras, materias, periodos, inscripciones) |
| **Estudiante** | Visualización y selección de materias, gestión de perfil |

## 📱 Características Responsivas

La aplicación está diseñada para funcionar en:
- 💻 Escritorio
- 📱 Tablet
- 📲 Móvil

## 🎨 Características de UI/UX

- **Loading states**: Skeletons y spinners para mejor UX
- **Notificaciones toast**: Feedback visual de acciones
- **Modales de confirmación**: Prevención de acciones accidentales
- **Validación de formularios**: Validación en tiempo real

## 📄 Licencia

Este proyecto es privado y desarrollado como parte del servicio social.

---
