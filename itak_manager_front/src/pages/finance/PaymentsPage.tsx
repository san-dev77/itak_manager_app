import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { apiService } from "../../services/api";
import Input from "../../components/ui/Input";
import InvoiceModal from "../../components/ui/InvoiceModal";
import {
  User,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  GraduationCap,
  FileText,
  Receipt,
} from "lucide-react";

interface Payment {
  id: string;
  studentFeeId: string;
  paymentDate: string;
  amount: number;
  method: "cash" | "bank_transfer" | "mobile_money" | "card";
  provider?: string;
  transactionRef?: string;
  receivedBy: string;
  status: "successful" | "failed" | "pending";
  createdAt: string;
  studentFee: {
    id: string;
    studentId: string; // ID de l'étudiant
    feeTypeId: string; // ID du type de frais
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

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeTypes, setFeeTypes] = useState<any[]>([]);
  const [studentClasses, setStudentClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedFeeType, setSelectedFeeType] = useState("all");
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set()
  );

  // États pour la modal de facture
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] =
    useState<Payment | null>(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        loadAllData();
      } catch (error) {
        console.log(error);

        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadPayments(), loadFeeTypes(), loadStudentClasses()]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "successful":
        return "Réussi";
      case "failed":
        return "Échoué";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Espèces";
      case "bank_transfer":
        return "Virement bancaire";
      case "mobile_money":
        return "Mobile Money";
      case "card":
        return "Carte bancaire";
      default:
        return method;
    }
  };

  // Fonction helper pour obtenir les données utilisateur d'un étudiant
  // Fonction helper pour obtenir le nom du type de frais
  const getFeeTypeName = (feeTypeId: string) => {
    const feeType = feeTypes.find((ft) => ft.id === feeTypeId);
    return feeType ? feeType.name : "Type inconnu";
  };

  // Fonction helper pour obtenir les infos de l'étudiant qui a payé
  const getStudentInfo = (studentId: string) => {
    // Trouver l'étudiant dans les classes (qui contient student + class)
    let studentClass = studentClasses.find(
      (sc) => sc.studentId === studentId && !sc.endDate
    );

    // Si pas trouvé, essayer sans vérifier endDate
    if (!studentClass) {
      studentClass = studentClasses.find((sc) => sc.studentId === studentId);
    }

    if (!studentClass) {
      return {
        name: "Étudiant inconnu",
        matricule: "N/A",
        class: "Non assigné",
      };
    }

    const student = studentClass.student;
    // Utiliser directement student.user comme dans StudentFeeAssignmentPage
    const user = student.user;

    return {
      name: user ? `${user.firstName} ${user.lastName}` : "Nom inconnu",
      matricule: student.matricule || "N/A",
      class: studentClass.class.name || "Non assigné",
    };
  };

  // Fonction pour basculer l'expansion d'un étudiant
  const toggleStudentExpansion = (studentId: string) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedStudents(newExpanded);
  };

  // Fonction pour regrouper les paiements par étudiant
  const groupPaymentsByStudent = (payments: Payment[]) => {
    const grouped = payments.reduce(
      (acc, payment) => {
        const studentId = payment.studentFee.studentId;
        if (!acc[studentId]) {
          acc[studentId] = {
            student: getStudentInfo(studentId),
            payments: [],
            totalAmount: 0,
            successfulPayments: 0,
            failedPayments: 0,
          };
        }
        acc[studentId].payments.push(payment);
        acc[studentId].totalAmount += Number(payment.amount) || 0;
        if (payment.status === "successful") {
          acc[studentId].successfulPayments += 1;
        } else if (payment.status === "failed") {
          acc[studentId].failedPayments += 1;
        }
        return acc;
      },
      {} as Record<
        string,
        {
          student: { name: string; matricule: string; class: string };
          payments: Payment[];
          totalAmount: number;
          successfulPayments: number;
          failedPayments: number;
        }
      >
    );

    return Object.values(grouped);
  };

  // Fonction pour formater les montants
  const formatAmount = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null || amount === "") {
      return "0";
    }
    const numericAmount = typeof amount === "string" ? Number(amount) : amount;
    if (isNaN(numericAmount)) {
      return "0";
    }
    return numericAmount.toLocaleString("fr-FR");
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

  // Filtrer d'abord les paiements, puis les regrouper par étudiant
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

  // Regrouper les paiements filtrés par étudiant
  const groupedPayments = groupPaymentsByStudent(filteredPayments);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des paiements
              </h1>
              <p className="text-gray-600">
                Gérez les paiements et transactions financières
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/finances")} variant="outline">
                ← Retour
              </Button>
              <Button onClick={() => navigate("/finances/payments/assign")}>
                + Nouveau paiement
              </Button>
            </div>
          </div>
        </div>

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
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des paiements...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedPayments.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Receipt className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Aucun paiement trouvé
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {selectedFeeType === "all"
                      ? "Aucun paiement ne correspond aux critères de recherche"
                      : `Aucun paiement trouvé pour le type de frais "${
                          feeTypes.find((ft) => ft.id === selectedFeeType)
                            ?.name || "sélectionné"
                        }"`}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <CreditCard className="w-4 h-4" />
                    <span>
                      Utilisez le bouton "Nouveau paiement" pour commencer
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              groupedPayments.map((group) => {
                const isExpanded = expandedStudents.has(
                  group.student.matricule
                );
                return (
                  <Card
                    key={group.student.matricule}
                    className="overflow-hidden"
                  >
                    {/* En-tête de l'étudiant */}
                    <div
                      className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 cursor-pointer hover:from-slate-100 hover:to-gray-100 transition-all duration-200 shadow-sm"
                      onClick={() =>
                        toggleStudentExpansion(group.student.matricule)
                      }
                    >
                      <div className="space-y-4">
                        {/* Section étudiant */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Receipt className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {group.student.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                                <div className="flex items-center space-x-1">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="font-semibold">
                                    Matricule:
                                  </span>
                                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                                    {group.student.matricule}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GraduationCap className="w-4 h-4 text-gray-500" />
                                  <span className="font-semibold">Classe:</span>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                                    {group.student.class}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CreditCard className="w-4 h-4 text-gray-500" />
                                  <span className="font-semibold">
                                    Paiements:
                                  </span>
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                                    {group.payments.length}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* Icône d'expansion */}
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                  isExpanded
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-5 h-5" />
                                ) : (
                                  <ChevronRight className="w-5 h-5" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section résumé des paiements */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <DollarSign className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Total Payé
                              </span>
                            </div>
                            <div className="text-xl font-bold text-gray-900 text-center">
                              {formatAmount(group.totalAmount)} FCFA
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Réussis
                              </span>
                            </div>
                            <div className="text-xl font-bold text-green-700 text-center">
                              {group.successfulPayments}
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <AlertCircle className="w-5 h-5 text-red-600" />
                              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                Échoués
                              </span>
                            </div>
                            <div className="text-xl font-bold text-red-700 text-center">
                              {group.failedPayments}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Détails des paiements (expandable) */}
                    {isExpanded && (
                      <div className="p-4 bg-white overflow-x-auto">
                        <div className="space-y-3 min-w-max">
                          {group.payments.map((payment) => (
                            <div
                              key={payment.id}
                              className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-md transition-all duration-200"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                                {/* Type de frais */}
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <FileText className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {getFeeTypeName(
                                        payment.studentFee.feeTypeId
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600 font-medium">
                                      {getMethodText(payment.method)}
                                    </div>
                                  </div>
                                </div>

                                {/* Montant */}
                                <div className="text-center">
                                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <DollarSign className="w-4 h-4 text-green-600" />
                                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                                        Montant
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {formatAmount(payment.amount)} FCFA
                                    </div>
                                  </div>
                                </div>

                                {/* Date de paiement */}
                                <div className="text-center">
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <Calendar className="w-4 h-4 text-gray-600" />
                                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Date
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {new Date(
                                        payment.paymentDate
                                      ).toLocaleDateString("fr-FR")}
                                    </div>
                                  </div>
                                </div>

                                {/* Reçu par */}
                                <div className="text-center">
                                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <User className="w-4 h-4 text-blue-600" />
                                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                        Reçu par
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {payment.receivedByUser.firstName}{" "}
                                      {payment.receivedByUser.lastName}
                                    </div>
                                  </div>
                                </div>

                                {/* Référence transaction */}
                                <div className="text-center">
                                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <Receipt className="w-4 h-4 text-purple-600" />
                                      <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                                        Référence
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {payment.transactionRef || "N/A"}
                                    </div>
                                  </div>
                                </div>

                                {/* Statut et Actions */}
                                <div className="flex flex-col items-center space-y-2">
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                                      payment.status
                                    )}`}
                                  >
                                    {payment.status === "successful" && (
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                    )}
                                    {payment.status === "failed" && (
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                    )}
                                    {payment.status === "pending" && (
                                      <Clock className="w-3 h-3 mr-1" />
                                    )}
                                    {getStatusText(payment.status)}
                                  </span>

                                  {/* Bouton Facture */}
                                  <button
                                    onClick={() => handleOpenInvoice(payment)}
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-blue-200 hover:border-blue-300"
                                  >
                                    <Receipt className="w-3 h-3" />
                                    <span>Facture</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal de facture */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={handleCloseInvoice}
        payment={selectedPaymentForInvoice}
        studentInfo={
          selectedPaymentForInvoice
            ? getStudentInfo(selectedPaymentForInvoice.studentFee.studentId)
            : null
        }
        feeTypeInfo={
          selectedPaymentForInvoice
            ? {
                name: getFeeTypeName(
                  selectedPaymentForInvoice.studentFee.feeTypeId
                ),
                amountDefault: Number(
                  selectedPaymentForInvoice.studentFee.amountAssigned
                ),
              }
            : null
        }
      />
    </Layout>
  );
};

export default PaymentsPage;
