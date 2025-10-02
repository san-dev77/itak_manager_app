import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { apiService } from "../../services/api";
import Input from "../../components/ui/Input";

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
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-lg font-medium">
                  Aucun paiement trouvé
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {selectedFeeType === "all"
                    ? "Aucun paiement ne correspond aux critères de recherche"
                    : `Aucun paiement trouvé pour le type de frais "${
                        feeTypes.find((ft) => ft.id === selectedFeeType)
                          ?.name || "sélectionné"
                      }"`}
                </p>
              </div>
            ) : (
              filteredPayments.map((payment) => (
                <Card key={payment.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {(() => {
                                if (!payment.studentFee) {
                                  return "Données manquantes";
                                }
                                const studentInfo = getStudentInfo(
                                  payment.studentFee.studentId
                                );
                                return studentInfo.name;
                              })()}
                            </h3>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Matricule:</span>{" "}
                              {(() => {
                                if (!payment.studentFee) return "N/A";
                                return getStudentInfo(
                                  payment.studentFee.studentId
                                ).matricule;
                              })()}
                              {" • "}
                              <span className="font-medium">Classe:</span>{" "}
                              {(() => {
                                if (!payment.studentFee) return "N/A";
                                return getStudentInfo(
                                  payment.studentFee.studentId
                                ).class;
                              })()}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {getStatusText(payment.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Type de frais:</span>
                          <p>
                            {payment.studentFee?.feeTypeId
                              ? getFeeTypeName(payment.studentFee.feeTypeId)
                              : "Non disponible"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Montant:</span>
                          <p className="font-semibold text-green-600">
                            {payment.amount.toLocaleString()} FCFA
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Méthode:</span>
                          <p>{getMethodText(payment.method)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>
                          <p>
                            {new Date(payment.paymentDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Reçu par:</span>
                          <p>
                            {payment.receivedByUser
                              ? `${payment.receivedByUser.firstName} ${payment.receivedByUser.lastName}`
                              : "Non disponible"}
                          </p>
                        </div>
                      </div>

                      {payment.transactionRef && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Référence:</span>{" "}
                          {payment.transactionRef}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentsPage;
