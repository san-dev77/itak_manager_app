import React from "react";
import { createPortal } from "react-dom";
import { XCircle, X, AlertTriangle } from "lucide-react";
import Button from "./Button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  details?: string;
  statusCode?: number;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Erreur",
  message,
  details,
  statusCode,
}) => {
  if (!isOpen) return null;

  const getStatusColor = () => {
    if (!statusCode) return "bg-red-500";
    if (statusCode >= 500) return "bg-red-600";
    if (statusCode >= 400) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStatusText = () => {
    if (!statusCode) return "";
    switch (statusCode) {
      case 400:
        return "Requête invalide";
      case 401:
        return "Non autorisé";
      case 403:
        return "Accès interdit";
      case 404:
        return "Ressource non trouvée";
      case 409:
        return "Conflit";
      case 422:
        return "Données invalides";
      case 500:
        return "Erreur serveur";
      default:
        return `Erreur ${statusCode}`;
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${getStatusColor()} text-white p-4 rounded-t-lg flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {statusCode && (
                <p className="text-sm opacity-90">{getStatusText()}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-base leading-relaxed">
                  {message}
                </p>
                {details && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Détails techniques :
                    </p>
                    <p className="text-sm text-gray-700 font-mono break-words">
                      {details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button onClick={onClose} variant="primary">
              J'ai compris
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ErrorModal;

