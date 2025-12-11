import React, { useEffect, useState } from "react";
import {
  X,
  Receipt,
  User,
  Calendar,
  CreditCard,
  Building2,
} from "lucide-react";
import QRCode from "qrcode";
import logoItak from "../../assets/logo itak.png";

interface Payment {
  id: string;
  studentFeeId: string;
  paymentDate: string;
  amount: number;
  method: string;
  receivedBy: string;
  status: string;
  studentFee: {
    id: string;
    studentId: string;
    feeTypeId: string;
    academicYearId: string;
    amountAssigned: string;
    amountPaid: string;
    dueDate: string;
    status: string;
  };
  receivedByUser: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface StudentInfo {
  name: string;
  matricule: string;
  class: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  studentInfo: StudentInfo | null;
  feeTypeInfo?: {
    name: string;
    amountDefault: number;
  } | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  payment,
  studentInfo,
  feeTypeInfo,
}) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");

  useEffect(() => {
    if (payment && studentInfo && feeTypeInfo) {
      // Générer les données pour le QR code
      const qrData = {
        facture: {
          numero: payment.id.slice(-8).toUpperCase(),
          date: payment.paymentDate,
          montant: payment.amount,
          etudiant: studentInfo.name,
          matricule: studentInfo.matricule,
          typeFrais: feeTypeInfo.name,
          institution: "Cyber School",
        },
      };

      // Générer le QR code
      QRCode.toDataURL(JSON.stringify(qrData), {
        width: 120,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then(setQrCodeDataURL)
        .catch(console.error);
    }
  }, [payment, studentInfo, feeTypeInfo]);

  if (!isOpen || !payment || !studentInfo) return null;

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("fr-FR");
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMethodText = (method: string): string => {
    const methods: Record<string, string> = {
      cash: "Espèces",
      bank_transfer: "Virement bancaire",
      mobile_money: "Mobile Money",
      card: "Carte bancaire",
    };
    return methods[method] || method;
  };

  const getStatusText = (status: string): string => {
    const statuses: Record<string, string> = {
      successful: "Réussi",
      failed: "Échoué",
      pending: "En attente",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      successful: "text-green-600 bg-green-100",
      failed: "text-red-600 bg-red-100",
      pending: "text-yellow-600 bg-yellow-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header compact */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-300">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Reçu de paiement
              </h2>
              <p className="text-xs text-gray-600">Reçu officiel ITAK</p>
              {studentInfo && (
                <p className="text-xs font-semibold text-blue-600 mt-1">
                  Étudiant: {studentInfo.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Invoice Content compact */}
        <div className="p-6 relative">
          {/* Filigrane ITAK centré avec logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 z-50">
            <div className="flex flex-col items-center justify-center">
              <img
                src={logoItak}
                alt="UPCD - ITAK Logo"
                className="w-64 h-64 object-contain"
              />
              <div className="text-6xl font-black text-blue-400 transform -rotate-12 mt-4">
                UPCD - ITAK
              </div>
            </div>
          </div>

          {/* Header de la facture compact */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-white p-1 shadow-sm">
                  <img
                    src={logoItak}
                    alt="ITAK Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-900">ITAK</h1>
                  <p className="text-sm font-semibold text-gray-700">
                    Institut de Technologie et d'Administration du Kankan
                  </p>
                  <p className="text-xs text-gray-600">
                    Système de gestion intégré
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center space-x-4">
                <div>
                  <div className="text-lg font-black text-gray-800">REÇU</div>
                  <div className="text-xs font-mono text-gray-600">
                    N° {payment.id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatDate(payment.paymentDate)}
                  </div>
                </div>
                {qrCodeDataURL && (
                  <div className="flex flex-col items-center">
                    <img
                      src={qrCodeDataURL}
                      alt="QR Code Reçu"
                      className="w-16 h-16 border border-gray-300 rounded"
                    />
                    <div className="text-xs text-gray-500 mt-1">QR Code</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations de l'étudiant compact */}
          <div className="relative z-10 mb-6">
            <div className="bg-gray-50/80 border-2 border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-black text-gray-800 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-700" />
                INFORMATIONS ÉTUDIANT
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Nom
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {studentInfo.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Matricule
                  </div>
                  <div className="text-sm font-bold text-gray-900 font-mono">
                    {studentInfo.matricule}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Classe
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {studentInfo.class}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Détails du paiement compact */}
          <div className="relative z-10 mb-6">
            <div className="bg-white/90 border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100/90 px-4 py-3 border-b-2 border-gray-300">
                <h3 className="text-sm font-black text-gray-800 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-700" />
                  DÉTAILS DU PAIEMENT
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Type de frais
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {feeTypeInfo?.name || "Type de frais"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Montant assigné
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatAmount(
                          Number(payment.studentFee.amountAssigned)
                        )}{" "}
                        FCFA
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Montant payé
                      </div>
                      <div className="text-lg font-black text-green-600">
                        {formatAmount(payment.amount)} FCFA
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Méthode
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {getMethodText(payment.method)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Date
                      </div>
                      <div className="text-sm font-bold text-gray-900 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(payment.paymentDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Statut
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations du receveur et résumé compact */}
          <div className="relative z-10 mb-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Receveur */}
              <div className="bg-gray-50/80 border-2 border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-black text-gray-800 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-700" />
                  REÇU PAR
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {payment.receivedByUser.firstName}{" "}
                      {payment.receivedByUser.lastName}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {payment.receivedByUser.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Résumé financier */}
              <div className="bg-gray-50/80 border-2 border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-black text-gray-800 mb-3">
                  RÉSUMÉ FINANCIER
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Assigné:</span>
                    <span className="font-bold text-gray-900">
                      {formatAmount(Number(payment.studentFee.amountAssigned))}{" "}
                      FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Payé:</span>
                    <span className="font-bold text-green-600">
                      {formatAmount(payment.amount)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-gray-300 pt-2">
                    <span className="text-gray-600">Restant:</span>
                    <span className="font-bold text-red-600">
                      {formatAmount(
                        Number(payment.studentFee.amountAssigned) -
                          payment.amount
                      )}{" "}
                      FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer compact */}
          <div className="relative z-10 border-t-2 border-gray-300 pt-4">
            <div className="text-center text-xs text-gray-600">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Building2 className="w-3 h-3" />
                <span className="font-semibold">
                  UPCD - ITAK - Institut de Technique de l'Antidote de Kati
                </span>
              </div>
              <p>Facture générée automatiquement par le système de gestion</p>
            </div>
          </div>
        </div>

        {/* Actions compact */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t-2 border-gray-300 bg-gray-100">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              // Modifier le titre de la page pour l'impression
              const originalTitle = document.title;
              document.title = `Facture_${studentInfo?.name.replace(
                /\s+/g,
                "_"
              )}_${payment.id.slice(-8).toUpperCase()}`;

              // Imprimer
              window.print();

              // Restaurer le titre original
              setTimeout(() => {
                document.title = originalTitle;
              }, 1000);
            }}
            className="px-4 py-1.5 bg-gray-800 text-white rounded text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center space-x-2"
          >
            <Receipt className="w-3 h-3" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
