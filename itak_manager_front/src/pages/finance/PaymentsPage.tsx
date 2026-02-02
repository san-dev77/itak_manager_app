import { CreditCard, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentsTable from "../../components/finance/PaymentsTable";
import AuthenticatedPage from "../../components/layout/AuthenticatedPage";
import { HeaderActionButton } from "../../components/ui/ActionButton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import InvoiceModal from "../../components/ui/InvoiceModal";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import {
    apiService,
    type Payment as ApiPayment,
    type StudentClass,
    type StudentFee,
    type StudentWithUser,
    type User,
} from "../../services/api";

// Utiliser le type Payment de l'API
type Payment = ApiPayment;

// Type pour InvoiceModal (avec studentFee obligatoire et types string pour amountAssigned/amountPaid)
type InvoiceModalPayment = Omit<Payment, "studentFee" | "receivedByUser"> & {
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
};

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeTypes, setFeeTypes] = useState<
    Array<{ id: string; name: string; amountDefault: number }>
  >([]);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [fullStudents, setFullStudents] = useState<StudentWithUser[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeeType, setSelectedFeeType] = useState("all");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editDisplayAmount, setEditDisplayAmount] = useState("");
  const [editFormData, setEditFormData] = useState({
    studentFeeId: "",
    paymentDate: "",
    amount: 0,
    method: "cash" as "cash" | "bank_transfer" | "mobile_money" | "card",
    provider: "",
    transactionRef: "",
    receivedBy: "",
    status: "successful" as "successful" | "failed" | "pending",
  });

  // États pour la modal de facture
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] =
    useState<Payment | null>(null);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadPayments(),
        loadFeeTypes(),
        loadStudentClasses(),
        loadStudents(),
        loadStudentFees(),
        loadUsers(),
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await apiService.getAllStudents();
      if (response.success && response.data) {
        setFullStudents(response.data);
      } else {
        setFullStudents([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
      setFullStudents([]);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await apiService.getAllPayments();

      if (response.success && response.data) {
        console.log("📥 Paiements reçus de l'API:", response.data);
        setPayments(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des paiements:",
          response.error
        );
        setPayments([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
      setPayments([]);
    }
  };

  const loadFeeTypes = async () => {
    try {
      const response = await apiService.getAllFeeTypes();
      if (response.success && response.data) {
        console.log("📥 Types de frais reçus de l'API:", response.data);
        setFeeTypes(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des types de frais:",
          response.error
        );
        setFeeTypes([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des types de frais:", error);
      setFeeTypes([]);
    }
  };

  const loadStudentFees = async () => {
    try {
      const response = await apiService.getAllStudentFees();
      if (response.success && response.data) {
        setStudentFees(response.data);
      } else {
        setStudentFees([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des frais étudiants:", error);
      setStudentFees([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setUsers([]);
    }
  };

  const loadStudentClasses = async () => {
    try {
      const response = await apiService.getAllStudentClasses();
      if (response.success && response.data) {
        console.log("📥 Classes d'étudiants reçues de l'API:", response.data);
        setStudentClasses(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des classes d'étudiants:",
          response.error
        );
        setStudentClasses([]);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des classes d'étudiants:",
        error
      );
      setStudentClasses([]);
    }
  };

  // Fonction helper pour obtenir le nom du type de frais
  const getFeeTypeName = (feeTypeId: string) => {
    const feeType = feeTypes.find((ft) => ft.id === feeTypeId);
    return feeType ? feeType.name : "Type inconnu";
  };

  const getStudentClassName = (studentId: string) => {
    const studentClass = studentClasses.find(
      (sc) => sc.studentId === studentId && !sc.endDate
    );
    return studentClass?.class?.name || "";
  };

  const formatAmount = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null || amount === "") {
      return "";
    }
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    if (!numericAmount) return "";
    return numericAmount.toLocaleString("fr-FR");
  };

  const parseAmount = (value: string): number => {
    const cleanValue = value.replace(/[\s.]/g, "");
    return parseInt(cleanValue, 10) || 0;
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseAmount(value);
    setEditFormData({ ...editFormData, amount: numericValue });
    setEditDisplayAmount(formatAmount(numericValue));
  };

  // Fonction helper pour obtenir les infos de l'étudiant qui a payé
  const getStudentInfo = (studentId: string) => {
    try {
      const fullStudent = fullStudents.find((s) => s.id === studentId);
      const studentClass = studentClasses.find(
        (sc) => sc.studentId === studentId && !sc.endDate
      );

      if (fullStudent) {
        return {
          name: `${fullStudent.user.firstName} ${fullStudent.user.lastName}`,
          matricule: fullStudent.matricule || "Non disponible",
          class: studentClass?.class?.name || "Non assigné",
        };
      }

      // Fallback vers studentClasses si fullStudent n'est pas trouvé
      const studentClassFallback = studentClasses.find(
        (sc) => sc.studentId === studentId
      );

      if (studentClassFallback?.student?.user) {
        return {
          name: `${studentClassFallback.student.user.firstName} ${studentClassFallback.student.user.lastName}`,
          matricule: studentClassFallback.student.matricule || "Non disponible",
          class: studentClassFallback.class?.name || "Non assigné",
        };
      }

      return {
        name: "Données non disponibles",
        matricule: "Non disponible",
        class: "Non assigné",
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des infos étudiant:",
        error
      );
      return {
        name: "Données non disponibles",
        matricule: "Non disponible",
        class: "Non assigné",
      };
    }
  };

  // Fonction pour ouvrir la modal de facture
  const handleOpenInvoice = (payment: Payment) => {
    setSelectedPaymentForInvoice(payment);
    setIsInvoiceModalOpen(true);
  };

  // Fonction pour fermer la modal de facture
  const handleCloseInvoice = () => {
    setIsInvoiceModalOpen(false);
    setSelectedPaymentForInvoice(null);
  };

  const getStudentFeeLabel = (fee: StudentFee) => {
    const student = fullStudents.find((s) => s.id === fee.studentId);
    const feeTypeName = fee.feeType?.name || getFeeTypeName(fee.feeTypeId);
    const academicYearName = fee.academicYear?.name || "";
    const studentName = student
      ? `${student.user.firstName} ${student.user.lastName}`
      : "Étudiant";
    const matricule = student?.matricule ? ` (${student.matricule})` : "";
    return `${studentName}${matricule} - ${feeTypeName} ${academicYearName}`.trim();
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setEditFormData({
      studentFeeId: payment.studentFeeId,
      paymentDate: payment.paymentDate?.split("T")[0] || "",
      amount: Number(payment.amount) || 0,
      method: payment.method,
      provider: payment.provider || "",
      transactionRef: payment.transactionRef || "",
      receivedBy: payment.receivedBy,
      status: payment.status,
    });
    setEditDisplayAmount(formatAmount(payment.amount));
    setIsEditModalOpen(true);
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    try {
      const response = await apiService.updatePayment(editingPayment.id, {
        studentFeeId: editFormData.studentFeeId,
        paymentDate: editFormData.paymentDate,
        amount: editFormData.amount,
        method: editFormData.method,
        provider: editFormData.provider || undefined,
        transactionRef: editFormData.transactionRef || undefined,
        receivedBy: editFormData.receivedBy,
        status: editFormData.status,
      });

      if (response.success) {
        await loadPayments();
        setIsEditModalOpen(false);
        setEditingPayment(null);
      } else {
        alert(response.error || "Erreur lors de la mise à jour du paiement");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paiement:", error);
      alert("Erreur lors de la mise à jour du paiement");
    }
  };

  const handleDeletePayment = async (payment: Payment) => {
    if (!window.confirm("Supprimer ce paiement ?")) return;

    try {
      const response = await apiService.deletePayment(payment.id);
      if (response.success) {
        await loadPayments();
      } else {
        alert(response.error || "Erreur lors de la suppression du paiement");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du paiement:", error);
      alert("Erreur lors de la suppression du paiement");
    }
  };

  // Filtrer les paiements
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPayments = payments.filter((payment) => {
    // Vérifications de sécurité pour éviter les erreurs
    if (!payment.studentFee) {
      console.warn("Payment sans studentFee:", payment);
      return false;
    }

    // Filtrage par type de frais
    const matchesFeeType =
      selectedFeeType === "all" ||
      payment.studentFee.feeTypeId === selectedFeeType;

    // Filtrage par recherche
    const studentInfo = getStudentInfo(payment.studentFee.studentId);
    const className = getStudentClassName(payment.studentFee.studentId);
    const student = fullStudents.find(
      (s) => s.id === payment.studentFee?.studentId
    );
    const phone = student?.user?.phone || "";
    const yearName = payment.studentFee?.academicYear?.name || "";
    const feeTypeName = getFeeTypeName(payment.studentFee.feeTypeId);

    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        payment.transactionRef,
        payment.studentFeeId,
        payment.method,
        payment.status,
        payment.paymentDate,
        String(payment.amount),
        feeTypeName,
        yearName,
        studentInfo.name,
        studentInfo.matricule,
        className,
        phone,
        payment.receivedByUser
          ? `${payment.receivedByUser.firstName} ${payment.receivedByUser.lastName}`
          : "",
      ]
        .filter(Boolean)
        .some((value) =>
          String(value ?? "").toLowerCase().includes(normalizedSearch)
        );

    // Filtrage par statut
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesFeeType && matchesSearch && matchesStatus;
  });

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Finances", path: "/finances" },
            { label: "Paiements" },
          ]}
        />
        <PageHeader
          title="Gestion des paiements"
          subtitle="Gérez les paiements et transactions financières"
          icon={CreditCard}
          iconColor="from-emerald-600 to-emerald-700"
          actions={
            <HeaderActionButton
              onClick={() => navigate("/finances/payments/assign")}
              icon={Plus}
              label="Nouveau paiement"
            />
          }
        />

        {/* Filtres */}
        <div className="mb-6 flex gap-4">
          <Input
            type="text"
            placeholder="Rechercher un paiement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="successful">Réussi</option>
            <option value="failed">Échoué</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        {/* Onglets pour les types de frais */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedFeeType("all")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedFeeType === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tous les frais
              </button>
              {feeTypes.map((feeType) => (
                <button
                  key={feeType.id}
                  onClick={() => setSelectedFeeType(feeType.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedFeeType === feeType.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {feeType.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des paiements...</p>
            </div>
          </div>
        ) : (
          <PaymentsTable
            payments={filteredPayments}
            fullStudents={fullStudents}
            studentClasses={studentClasses}
            feeTypes={feeTypes.map((ft) => ({ id: ft.id, name: ft.name }))}
            onViewInvoice={handleOpenInvoice}
            onEditPayment={handleEditPayment}
            onDeletePayment={handleDeletePayment}
          />
        )}
      </div>

      {/* Modal de facture */}
      {selectedPaymentForInvoice?.studentFee && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={handleCloseInvoice}
          payment={
            {
              ...selectedPaymentForInvoice,
              studentFee: {
                ...selectedPaymentForInvoice.studentFee,
                amountAssigned: String(
                  selectedPaymentForInvoice.studentFee.amountAssigned
                ),
                amountPaid: String(
                  selectedPaymentForInvoice.studentFee.amountPaid
                ),
              },
              receivedByUser: selectedPaymentForInvoice.receivedByUser || {
                id: "",
                firstName: "Non disponible",
                lastName: "",
                role: "",
              },
            } as InvoiceModalPayment
          }
          studentInfo={getStudentInfo(
            selectedPaymentForInvoice.studentFee.studentId
          )}
          feeTypeInfo={{
            name: getFeeTypeName(
              selectedPaymentForInvoice.studentFee.feeTypeId
            ),
            amountDefault: Number(
              selectedPaymentForInvoice.studentFee.amountAssigned
            ),
          }}
        />
      )}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPayment(null);
        }}
        title="Modifier le paiement"
        size="lg"
      >
        <form onSubmit={handleUpdatePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frais étudiant
            </label>
            <select
              value={editFormData.studentFeeId}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  studentFeeId: e.target.value,
                })
              }
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un frais</option>
              {studentFees.map((fee) => (
                <option key={fee.id} value={fee.id}>
                  {getStudentFeeLabel(fee)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de paiement
              </label>
              <input
                type="date"
                value={editFormData.paymentDate}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    paymentDate: e.target.value,
                  })
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant (FCFA)
              </label>
              <input
                type="text"
                value={editDisplayAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Ex: 50 000"
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Méthode
              </label>
              <select
                value={editFormData.method}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    method: e.target.value as
                      | "cash"
                      | "bank_transfer"
                      | "mobile_money"
                      | "card",
                  })
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="cash">Espèces</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Carte bancaire</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    status: e.target.value as
                      | "successful"
                      | "failed"
                      | "pending",
                  })
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="successful">Réussi</option>
                <option value="failed">Échoué</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reçu par
              </label>
              <select
                value={editFormData.receivedBy}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    receivedBy: e.target.value,
                  })
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Référence (optionnel)
              </label>
              <input
                type="text"
                value={editFormData.transactionRef}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    transactionRef: e.target.value,
                  })
                }
                placeholder="Ex: TXN-123"
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur (optionnel)
            </label>
            <input
              type="text"
              value={editFormData.provider}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  provider: e.target.value,
                })
              }
              placeholder="Ex: Orange Money"
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingPayment(null);
              }}
            >
              Annuler
            </Button>
            <Button type="submit">Mettre à jour</Button>
          </div>
        </form>
      </Modal>
    </AuthenticatedPage>
  );
};

export default PaymentsPage;
