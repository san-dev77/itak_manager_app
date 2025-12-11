import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedPage from "../../components/layout/AuthenticatedPage";
import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { HeaderActionButton } from "../../components/ui/ActionButton";
import {
  apiService,
  type Payment as ApiPayment,
  type StudentWithUser,
  type StudentClass,
} from "../../services/api";
import Input from "../../components/ui/Input";
import InvoiceModal from "../../components/ui/InvoiceModal";
import PaymentsTable from "../../components/finance/PaymentsTable";
import { CreditCard, Plus } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeeType, setSelectedFeeType] = useState("all");

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

  // Filtrer les paiements
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
    const matchesSearch =
      (payment.transactionRef &&
        payment.transactionRef
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      payment.studentFeeId.toLowerCase().includes(searchTerm.toLowerCase());

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
    </AuthenticatedPage>
  );
};

export default PaymentsPage;
