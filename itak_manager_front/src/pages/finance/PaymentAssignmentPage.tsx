import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { apiService } from "../../services/api";
import { User, DollarSign, Calendar, Search, CreditCard } from "lucide-react";

interface StudentFee {
  id: string;
  studentId: string;
  feeTypeId: string;
  academicYearId: string;
  amountAssigned: number;
  amountPaid: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    userId: string;
    matricule: string;
  };
  feeType: {
    id: string;
    name: string;
    amountDefault: number;
  };
  academicYear: {
    id: string;
    name: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const PaymentAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [staffs, setStaffs] = useState<User[]>([]);
  const [studentClasses, setStudentClasses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la sélection
  const [selectedStudentFee, setSelectedStudentFee] =
    useState<StudentFee | null>(null);
  const [studentFeeSearchTerm, setStudentFeeSearchTerm] = useState("");

  // État pour le formulaire
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    amount: 0,
    method: "cash" as const,
    provider: "",
    transactionRef: "",
    receivedBy: "",
  });

  const [displayAmount, setDisplayAmount] = useState("");

  // Fonctions utilitaires pour le formatage des montants
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("fr-FR");
  };

  // Fonction helper pour obtenir la classe d'un étudiant
  const getStudentClass = (studentId: string) => {
    // Trouver l'étudiant dans les classes (qui contient student + class)
    let studentClass = studentClasses.find(
      (sc) => sc.student.id === studentId && !sc.endDate
    );

    // Si pas trouvé, essayer sans vérifier endDate
    if (!studentClass) {
      studentClass = studentClasses.find((sc) => sc.student.id === studentId);
    }

    return studentClass?.class?.name || "Non assigné";
  };

  // Fonction pour calculer le montant payé réel en sommant les paiements
  const getActualAmountPaid = (studentFeeId: string) => {
    const successfulPayments = payments.filter(
      (payment) =>
        payment.studentFeeId === studentFeeId && payment.status === "successful"
    );

    const totalPaid = successfulPayments.reduce((sum, payment) => {
      return sum + (Number(payment.amount) || 0);
    }, 0);

    console.log(`💰 Calcul pour studentFeeId ${studentFeeId}:`, {
      successfulPayments: successfulPayments.length,
      totalPaid,
      payments: successfulPayments.map((p) => ({
        amount: p.amount,
        status: p.status,
      })),
    });

    return totalPaid;
  };

  const parseAmount = (value: string): number => {
    const cleanValue = value.replace(/[\s.]/g, "");
    return parseInt(cleanValue) || 0;
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseAmount(value);
    setFormData({ ...formData, amount: numericValue });
    setDisplayAmount(formatAmount(numericValue));
  };

  // Fonction helper pour obtenir les données utilisateur d'un étudiant
  const getStudentUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        loadAllData();
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadStudentFees(),
        loadUsers(),
        loadStaffs(),
        loadStudentClasses(),
        loadPayments(),
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentFees = async () => {
    try {
      const response = await apiService.getAllStudentFees();
      if (response.success && response.data) {
        console.log("📥 Frais étudiants reçus de l'API:", response.data);
        // Log pour debug - vérifier la structure des données
        if (response.data.length > 0) {
          console.log("🔍 Exemple de studentFee:", response.data[0]);
          console.log(
            "🔍 amountAssigned:",
            response.data[0].amountAssigned,
            typeof response.data[0].amountAssigned
          );
          console.log(
            "🔍 amountPaid:",
            response.data[0].amountPaid,
            typeof response.data[0].amountPaid
          );
        }
        setStudentFees(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des frais étudiants:",
          response.error
        );
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
        console.log("📥 Utilisateurs reçus de l'API:", response.data);
        setUsers(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des utilisateurs:",
          response.error
        );
        setUsers([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setUsers([]);
    }
  };

  const loadStaffs = async () => {
    try {
      const response = await apiService.getAllUsers();
      if (response.success && response.data) {
        // Filtrer les utilisateurs pour ne garder que les staffs et admins
        const staffUsers = response.data.filter(
          (user: User) => user.role === "staff" || user.role === "admin"
        );
        console.log("📥 Staffs reçus de l'API:", staffUsers);
        setStaffs(staffUsers);
      } else {
        console.error("Erreur lors du chargement des staffs:", response.error);
        setStaffs([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des staffs:", error);
      setStaffs([]);
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

  const handleStudentFeeSelect = (studentFee: StudentFee) => {
    setSelectedStudentFee(studentFee);
    setStudentFeeSearchTerm("");
    // Pré-remplir le montant avec le montant restant
    const remainingAmount =
      (Number(studentFee.amountAssigned) || 0) -
      getActualAmountPaid(studentFee.id);
    setFormData({ ...formData, amount: remainingAmount });
    setDisplayAmount(formatAmount(remainingAmount));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudentFee) {
      alert("Veuillez sélectionner un frais étudiant.");
      return;
    }

    if (formData.amount <= 0) {
      alert("Le montant doit être positif.");
      return;
    }

    if (!formData.receivedBy) {
      alert("Veuillez sélectionner qui reçoit le paiement.");
      return;
    }

    const remainingAmount =
      (Number(selectedStudentFee.amountAssigned) || 0) -
      getActualAmountPaid(selectedStudentFee.id);
    if (formData.amount > remainingAmount) {
      alert(
        `Le montant ne peut pas dépasser le montant restant (${formatAmount(
          remainingAmount
        )} FCFA).`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const data = {
        studentFeeId: selectedStudentFee.id,
        paymentDate: formData.paymentDate,
        amount: formData.amount,
        method: formData.method,
        provider: formData.provider || undefined,
        transactionRef: formData.transactionRef || undefined,
        receivedBy: formData.receivedBy, // Utiliser l'ID du staff sélectionné
      };

      console.log("📤 Données envoyées:", data);
      const response = await apiService.createPayment(data);

      if (response.success) {
        console.log("Paiement créé avec succès");
        alert("Paiement enregistré avec succès !");
        // Recharger la page pour mettre à jour les données
        window.location.reload();
      } else {
        console.error("Erreur lors de la création:", response.error);
        alert(
          "Erreur lors de l'enregistrement du paiement. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudentFees = studentFees.filter((studentFee) => {
    const studentUser = getStudentUser(studentFee.student.userId);
    if (!studentUser) return false;

    const remainingAmount =
      (Number(studentFee.amountAssigned) || 0) -
      getActualAmountPaid(studentFee.id);
    // Ne montrer que les frais qui ont encore un montant restant
    if (remainingAmount <= 0) return false;

    return (
      studentUser.firstName
        .toLowerCase()
        .includes(studentFeeSearchTerm.toLowerCase()) ||
      studentUser.lastName
        .toLowerCase()
        .includes(studentFeeSearchTerm.toLowerCase()) ||
      studentFee.student.matricule
        .toLowerCase()
        .includes(studentFeeSearchTerm.toLowerCase()) ||
      studentFee.feeType.name
        .toLowerCase()
        .includes(studentFeeSearchTerm.toLowerCase())
    );
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Enregistrement de paiements
              </h1>
              <p className="text-gray-600 text-sm">
                Sélectionnez un étudiant et enregistrez son paiement
              </p>
            </div>
            <Button
              onClick={() => navigate("/finances/payments")}
              variant="outline"
              className="text-sm"
            >
              Retour aux paiements
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des données...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sélection du frais étudiant */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Sélectionner un frais étudiant
                </h2>
                <p className="text-sm text-gray-600">
                  Choisissez un étudiant ayant des frais en attente de paiement
                </p>
              </div>

              {selectedStudentFee ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        {(() => {
                          const studentUser = getStudentUser(
                            selectedStudentFee.student.userId
                          );
                          return studentUser ? (
                            <>
                              <h3 className="font-semibold text-gray-900 text-base">
                                {studentUser.firstName} {studentUser.lastName}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="text-sm">
                                  <span className="text-gray-500">
                                    Matricule:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-900">
                                    {selectedStudentFee.student.matricule}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500">Classe:</span>
                                  <span className="ml-1 font-medium text-gray-900">
                                    {getStudentClass(
                                      selectedStudentFee.student.id
                                    )}
                                  </span>
                                </div>
                                <div className="text-sm col-span-2">
                                  <span className="text-gray-500">
                                    Type de frais:
                                  </span>
                                  <span className="ml-1 font-medium text-gray-900">
                                    {selectedStudentFee.feeType.name}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Montant assigné:
                                  </span>{" "}
                                  {formatAmount(
                                    Number(selectedStudentFee.amountAssigned) ||
                                      0
                                  )}{" "}
                                  FCFA
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Montant payé:
                                  </span>{" "}
                                  {formatAmount(
                                    getActualAmountPaid(selectedStudentFee.id)
                                  )}{" "}
                                  FCFA
                                </p>
                                <p className="text-sm font-semibold text-red-600">
                                  <span className="font-medium">
                                    Montant restant:
                                  </span>{" "}
                                  {formatAmount(
                                    (Number(
                                      selectedStudentFee.amountAssigned
                                    ) || 0) -
                                      getActualAmountPaid(selectedStudentFee.id)
                                  )}{" "}
                                  FCFA
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-500">
                              Chargement des données utilisateur...
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedStudentFee(null)}
                    >
                      Changer
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, matricule ou type de frais..."
                      value={studentFeeSearchTerm}
                      onChange={(e) => setStudentFeeSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  {filteredStudentFees.length === 0 &&
                    studentFees.length > 0 && (
                      <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                        <p className="text-yellow-800 font-medium">
                          Tous les frais sont entièrement payés
                        </p>
                        <p className="text-yellow-600 text-sm mt-1">
                          Seuls les frais avec un montant restant sont affichés
                          ici
                        </p>
                      </div>
                    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {filteredStudentFees.map((studentFee) => {
                      const studentUser = getStudentUser(
                        studentFee.student.userId
                      );
                      const remainingAmount =
                        (Number(studentFee.amountAssigned) || 0) -
                        getActualAmountPaid(studentFee.id);

                      return studentUser ? (
                        <div
                          key={studentFee.id}
                          onClick={() => handleStudentFeeSelect(studentFee)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all duration-150"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                                {studentUser.firstName} {studentUser.lastName}
                              </h3>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">
                                    Matricule:
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {studentFee.student.matricule}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Classe:</span>
                                  <span className="font-medium text-gray-900">
                                    {getStudentClass(studentFee.student.id)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Type:</span>
                                  <span className="font-medium text-gray-900">
                                    {studentFee.feeType.name}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
                                  <span className="text-gray-500">
                                    Montant restant:
                                  </span>
                                  <span className="font-semibold text-red-600">
                                    {formatAmount(remainingAmount)} FCFA
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </Card>

            {/* Détails du paiement */}
            {selectedStudentFee && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Détails du paiement
                  </h2>
                  <p className="text-sm text-gray-600">
                    Renseignez les informations du paiement effectué
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de paiement
                    </label>
                    <input
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant (FCFA)
                    </label>
                    <input
                      type="text"
                      value={displayAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Ex: 50.000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Montant maximum:{" "}
                      {formatAmount(
                        (Number(selectedStudentFee.amountAssigned) || 0) -
                          getActualAmountPaid(selectedStudentFee.id)
                      )}{" "}
                      FCFA
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Méthode de paiement
                    </label>
                    <select
                      value={formData.method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          method: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
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
                      Fournisseur (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.provider}
                      onChange={(e) =>
                        setFormData({ ...formData, provider: e.target.value })
                      }
                      placeholder="Ex: Orange Money, MTN Money..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Référence de transaction (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.transactionRef}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transactionRef: e.target.value,
                        })
                      }
                      placeholder="Ex: OM123456789"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reçu par <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.receivedBy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          receivedBy: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
                      required
                    >
                      <option value="">Sélectionner un membre du staff</option>
                      {staffs.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.firstName} {staff.lastName} ({staff.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* Bouton de soumission */}
            {selectedStudentFee && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium"
                >
                  {isSubmitting
                    ? "Enregistrement en cours..."
                    : "Enregistrer le paiement"}
                </Button>
              </div>
            )}
          </form>
        )}
      </div>
    </Layout>
  );
};

export default PaymentAssignmentPage;
