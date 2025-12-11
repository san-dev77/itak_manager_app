import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorHandlerProps {
  children: ReactNode;
}

interface ErrorHandlerState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorHandler extends Component<ErrorHandlerProps, ErrorHandlerState> {
  private refreshTimeout: NodeJS.Timeout | null = null;

  constructor(props: ErrorHandlerProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidMount() {
    // Écouter les erreurs non capturées
    window.addEventListener("error", this.handleGlobalError);
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    // Nettoyer les listeners
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
    
    // Nettoyer le timeout si présent
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorHandlerState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("❌ Erreur capturée par ErrorHandler:", error);
    console.error("📋 Détails:", errorInfo);

    // Vérifier si c'est l'erreur spécifique de removeChild
    if (this.isRemoveChildError(error)) {
      console.warn("⚠️ Erreur removeChild détectée, rafraîchissement de la page dans 1 seconde...");
      this.refreshPage();
    } else {
      // Pour les autres erreurs, on peut aussi rafraîchir ou afficher un message
      this.setState({
        error,
        errorInfo,
      });
    }
  }

  handleGlobalError = (event: ErrorEvent) => {
    const error = event.error || new Error(event.message);
    
    if (this.isRemoveChildError(error)) {
      console.warn("⚠️ Erreur removeChild détectée (global), rafraîchissement de la page dans 1 seconde...");
      event.preventDefault(); // Empêcher l'affichage par défaut
      this.refreshPage();
    }
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = event.reason;
    
    if (error instanceof Error && this.isRemoveChildError(error)) {
      console.warn("⚠️ Erreur removeChild détectée (promise), rafraîchissement de la page dans 1 seconde...");
      event.preventDefault(); // Empêcher l'affichage par défaut
      this.refreshPage();
    }
  };

  isRemoveChildError = (error: Error | unknown): boolean => {
    if (!(error instanceof Error)) return false;
    
    const errorMessage = error.message || "";
    const errorStack = error.stack || "";
    
    return (
      errorMessage.includes("removeChild") ||
      errorMessage.includes("Failed to execute 'removeChild'") ||
      errorStack.includes("removeChild") ||
      errorStack.includes("commitDeletionEffectsOnFiber")
    );
  };

  refreshPage = () => {
    // Attendre un peu avant de rafraîchir pour éviter les boucles
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    this.refreshTimeout = setTimeout(() => {
      console.log("🔄 Rafraîchissement de la page...");
      window.location.reload();
    }, 1000);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Si c'est une erreur removeChild, on ne montre rien car la page va se rafraîchir
      if (this.isRemoveChildError(this.state.error)) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Rafraîchissement de la page...
              </h2>
              <p className="text-gray-600">
                La page va se rafraîchir automatiquement dans quelques instants.
              </p>
            </div>
          </div>
        );
      }

      // Pour les autres erreurs, afficher un message
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Une erreur s'est produite
                </h2>
                <p className="text-sm text-gray-600">
                  {this.state.error.message || "Erreur inconnue"}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Rafraîchir la page
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Détails techniques
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48">
                  {this.state.error?.stack}
                  {"\n\n"}
                  {this.state.errorInfo.componentStack}
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

export default ErrorHandler;

