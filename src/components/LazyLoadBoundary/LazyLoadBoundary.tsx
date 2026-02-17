import { Component, type ReactNode } from 'react';
import Button from '@components/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * LazyLoadBoundary
 *
 * Error Boundary para manejar errores de carga de componentes lazy.
 * Útil cuando un chunk falla al cargar (conexión inestable, deploy en progreso, etc.)
 * Ofrece retry automático y UI amigable para el usuario.
 */
export class LazyLoadBoundary extends Component<Props, State> {
  private static MAX_RETRIES = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error) {
    // Log del error (puede enviarse a servicio de monitoring)
    console.error('LazyLoadBoundary caught error:', error);

    // Auto-retry si no excede el límite
    if (this.state.retryCount < LazyLoadBoundary.MAX_RETRIES) {
      setTimeout(() => {
        this.handleRetry();
      }, 1000 * (this.state.retryCount + 1)); // Retry con backoff
    }
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al cargar el contenido
            </h3>

            <p className="text-gray-600 mb-6">
              {this.state.retryCount >= LazyLoadBoundary.MAX_RETRIES
                ? 'No se pudo cargar la página después de varios intentos. Por favor, verifica tu conexión a internet y recarga la página.'
                : 'Hubo un problema al cargar esta sección. Reintentando...'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset} variant="primary">
                Reintentar Ahora
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="primary"
              >
                Recargar Página
              </Button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Detalles del error (dev only)
                </summary>
                <pre className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-auto">
                                    {this.state.error.message}
                                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
