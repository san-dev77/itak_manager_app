import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { User, CheckCircle } from "lucide-react";
import { apiService, type StaffWithUser } from "../../services/api";

interface StudentFee {
  id: string;
  studentId: string;
  feeTypeId: string;
  academicYearId: string;
  amountAssigned: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "overdue";
  feeType: {
    id: string;
    name: string;
  };
  academicYear: {
    id: string;
    name: string;
  };
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
}

interface StudentPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  studentFees: StudentFee[];
  payments: Array<{
    id: string;
    studentFeeId: string;
    amount: number;
    status: string;
  }>;
  onSuccess?: () => void;
}

const StudentPaymentModal: React.FC<StudentPaymentModalProps> = ({
  isOpen,
  onClose,
  student,
  studentFees,
  payments,
  onSuccess,
}) => {
  const [selectedFeeId, setSelectedFeeId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [method, setMethod] = useState<"cash" | "bank_transfer" | "mobile_money" | "card">("cash");
  const [provider, setProvider] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [receivedBy, setReceivedBy] = useState<string>("");
  const [staffMembers, setStaffMembers] = useState<StaffWithUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStaff();
      // Réinitialiser le formulaire
      setSelectedFeeId("");
      setAmount("");
      setDisplayAmount("");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setMethod("cash");
      setProvider("");
      setTransactionRef("");
      setReceivedBy("");
    }
  }, [isOpen]);

  const loadStaff = async () => {
    try {
      const response = await apiService.getAllStaff();
      if (response.success && response.data) {
        setStaffMembers(response.data);
        // Sélectionner le premier membre du personnel par défaut
        if (response.data.length > 0 && !receivedBy) {
          setReceivedBy(response.data[0].user.id);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement du personnel:", error);
      setStaffMembers([]);
    }
  };

  const formatAmount = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null || amount === "") {
      return "0";
    }
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return numericAmount.toLocaleString("fr-FR");
  };

  const parseAmount = (value: string): number => {
    const cleanValue = value.replace(/[\s.]/g, "");
    return parseInt(cleanValue) || 0;
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseAmount(value);
    setAmount(numericValue.toString());
    setDisplayAmount(formatAmount(numericValue));
  };

  const getActualAmountPaid = (studentFeeId: string) => {
    const successfulPayments = payments.filter(
      (payment) =>
        payment.studentFeeId === studentFeeId && payment.status === "successful"
    );
    return successfulPayments.reduce((sum, payment) => {
      return sum + (Number(payment.amount) || 0);
    }, 0);
  };

  const getRemainingAmount = (fee: StudentFee) => {
    const actualAmountPaid = getActualAmountPaid(fee.id);
    return Number(fee.amountAssigned) - actualAmountPaid;
  };

  const selectedFee = studentFees.find((fee) => fee.id === selectedFeeId);
  const remainingAmount = selectedFee ? getRemainingAmount(selectedFee) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFeeId) {
      alert("Veuillez sélectionner un frais");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Le montant doit être positif");
      return;
    }

    const paymentAmount = parseFloat(amount);

    if (paymentAmount > remainingAmount) {
      alert(
        `Le montant ne peut pas dépasser le montant restant (${formatAmount(remainingAmount)} FCFA)`
      );
      return;
    }

    if (!receivedBy) {
      alert("Veuillez sélectionner qui a reçu le paiement");
      return;
    }

    try {
      setIsSubmitting(true);

      const paymentData = {
        studentFeeId: selectedFeeId,
        paymentDate: new Date(paymentDate).toISOString(),
        amount: paymentAmount,
        method: method,
        receivedBy: receivedBy,
        ...(provider && { provider }),
        ...(transactionRef && { transactionRef }),
      };

      const response = await apiService.createPayment(paymentData);

      if (response.success) {
        setSuccessMessage(
          `Paiement de ${formatAmount(paymentAmount)} FCFA enregistré avec succès !`
        );
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        }, 1500);
      } else {
        alert(response.message || "Erreur lors de l'enregistrement du paiement");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
      alert("Erreur lors de l'enregistrement du paiement. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!student) return null;

  // Filtrer les frais qui ont encore un montant restant
  const availableFees = studentFees.filter((fee) => getRemainingAmount(fee) > 0);

  return (
    <>
      <Modal
        isOpen={isOpen && !successMessage}
        onClose={onClose}
        title="Enregistrer un paiement"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations étudiant */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-gray-600">Matricule: {student.matricule}</p>
              </div>
            </div>
          </div>

          {/* Sélection du frais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais à payer <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedFeeId}
              onChange={(e) => {
                setSelectedFeeId(e.target.value);
                const fee = studentFees.find((f) => f.id === e.target.value);
                if (fee) {
                  const remaining = getRemainingAmount(fee);
                  setAmount(remaining.toString());
                  setDisplayAmount(formatAmount(remaining));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
              required
            >
              <option value="">Sélectionner un frais</option>
              {availableFees.map((fee) => {
                const remaining = getRemainingAmount(fee);
                return (
                  <option key={fee.id} value={fee.id}>
                    {fee.feeType.name} - {fee.academicYear.name} (Restant: {formatAmount(remaining)} FCFA)
                  </option>
                );
              })}
            </select>
            {availableFees.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Aucun frais avec un montant restant disponible
              </p>
            )}
          </div>

          {selectedFee && (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Année académique:</span>
                  <span className="font-semibold text-purple-700">
                    {selectedFee.academicYear.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Montant assigné:</span>
                  <span className="font-semibold">
                    {formatAmount(selectedFee.amountAssigned)} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Montant restant:</span>
                  <span className="font-semibold text-blue-600">
                    {formatAmount(remainingAmount)} FCFA
                  </span>
                </div>
              </div>

              {/* Montant du paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant du paiement (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Ex: 50.000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {formatAmount(remainingAmount)} FCFA
                </p>
              </div>

              {/* Date de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de paiement <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
                  required
                />
              </div>

              {/* Méthode de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement <span className="text-red-500">*</span>
                </label>
                <select
                  value={method}
                  onChange={(e) =>
                    setMethod(
                      e.target.value as "cash" | "bank_transfer" | "mobile_money" | "card"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
                  required
                >
                  <option value="cash">Espèces</option>
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="card">Carte</option>
                </select>
              </div>

              {/* Fournisseur (optionnel) */}
              {method === "mobile_money" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fournisseur
                  </label>
                  <input
                    type="text"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="Ex: Orange Money, MTN Mobile Money"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
                  />
                </div>
              )}

              {/* Référence de transaction (optionnel) */}
              {(method === "bank_transfer" ||
                method === "mobile_money" ||
                method === "card") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Référence de transaction
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Numéro de référence"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
                  />
                </div>
              )}

              {/* Reçu par */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reçu par <span className="text-red-500">*</span>
                </label>
                <select
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white"
                  required
                >
                  <option value="">Sélectionner un membre du personnel</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.user.id} value={staff.user.id}>
                      {staff.user.firstName} {staff.user.lastName}
                      {staff.position && ` - ${staff.position}`}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedFeeId || availableFees.length === 0}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modale de succès */}
      {successMessage && (
        <Modal
          isOpen={!!successMessage}
          onClose={() => {
            setSuccessMessage(null);
            onClose();
          }}
          title="Succès"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <p className="text-center text-gray-800 text-base font-medium">
              {successMessage}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSuccessMessage(null);
                  onClose();
                  if (onSuccess) {
                    onSuccess();
                  }
                }}
                variant="primary"
              >
                OK
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default StudentPaymentModal;

