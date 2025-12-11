import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedPage from "../../components/layout/AuthenticatedPage";
import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import {
  apiService,
  type FeeType,
  type StudentClass,
  type User,
  type StaffWithUser,
} from "../../services/api";

interface AcademicYear {
  id: string;
  name: string;
  isActive: boolean;
}
import {
  Search,
  User as UserIcon,
  CheckSquare,
  Square,
  CreditCard,
  CheckCircle,
  GraduationCap,
  FileText,
  Receipt,
} from "lucide-react";

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

// Interface Payment étendue pour inclure studentFeeId
interface PaymentWithStudentFee {
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
}

const PaymentAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [staffs, setStaffs] = useState<StaffWithUser[]>([]);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [payments, setPayments] = useState<PaymentWithStudentFee[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la sélection
  const [studentFeeSearchTerm, setStudentFeeSearchTerm] = useState("");

  // Nouveaux états pour le workflow amélioré
  const [selectedFeeType, setSelectedFeeType] = useState<string>("");
  const [selectedStudentFees, setSelectedStudentFees] = useState<Set<string>>(
    new Set()
  );
  const [bulkFormData, setBulkFormData] = useState({
    amount: 0,
    method: "cash" as "cash" | "bank_transfer" | "mobile_money" | "card",
    receivedBy: "",
    paymentDate: new Date().toISOString().split("T")[0],
    academicYearId: "",
  });

  // État pour le formulaire (non utilisé pour le moment)
  // const [formData, setFormData] = useState({
  //   paymentDate: new Date().toISOString().split("T")[0],
  //   amount: 0,
  //   method: "cash" as const,
  //   provider: "",
  //   transactionRef: "",
  //   receivedBy: "",
  // });

  // Fonctions utilitaires pour le formatage des montants
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("fr-FR");
  };

  // Fonctions pour le nouveau workflow
  const handleFeeTypeSelect = (feeTypeId: string) => {
    setSelectedFeeType(feeTypeId);
    setSelectedStudentFees(new Set()); // Reset selection
  };

  const toggleStudentFeeSelection = (studentFeeId: string) => {
    const newSelection = new Set(selectedStudentFees);
    if (newSelection.has(studentFeeId)) {
      newSelection.delete(studentFeeId);
    } else {
      newSelection.add(studentFeeId);
    }
    setSelectedStudentFees(newSelection);
  };

  const selectAllStudentFees = () => {
    const filteredFees = getFilteredStudentFees();
    setSelectedStudentFees(new Set(filteredFees.map((fee) => fee.id)));
  };

  const deselectAllStudentFees = () => {
    setSelectedStudentFees(new Set());
  };

  const getFilteredStudentFees = () => {
    if (!selectedFeeType) return [];

    return studentFees.filter((studentFee) => {
      const studentUser = getStudentUser(studentFee.student.userId);
      if (!studentUser) return false;

      const actualAmountPaid = getActualAmountPaid(studentFee.id);
      const remainingAmount =
        (Number(studentFee.amountAssigned) || 0) - actualAmountPaid;

      return (
        studentFee.feeTypeId === selectedFeeType &&
        remainingAmount > 0 &&
        (studentUser.firstName
          .toLowerCase()
          .includes(studentFeeSearchTerm.toLowerCase()) ||
          studentUser.lastName
            .toLowerCase()
            .includes(studentFeeSearchTerm.toLowerCase()) ||
          studentFee.student.matricule
            .toLowerCase()
            .includes(studentFeeSearchTerm.toLowerCase()) ||
          getStudentClass(studentFee.student.id)
            .toLowerCase()
            .includes(studentFeeSearchTerm.toLowerCase()))
      );
    });
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

  // Fonction parseAmount non utilisée (commentée)
  // const parseAmount = (value: string): number => {
  //   const cleanValue = value.replace(/[\s.]/g, "");
  //   return parseInt(cleanValue) || 0;
  // };

  // Fonction helper pour obtenir les données utilisateur d'un étudiant
  const getStudentUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadStudentFees(),
        loadUsers(),
        loadStaffs(),
        loadStudentClasses(),
        loadPayments(),
        loadFeeTypes(),
        loadAcademicYears(),
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
        // Filtrer les StudentFee qui ont un student valide
        const validFees = response.data.filter(
          (fee) => fee.student && fee.student.id && fee.student.matricule
        ) as StudentFee[];
        setStudentFees(validFees);
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
      const response = await apiService.getAllStaff();
      if (response.success && response.data) {
        console.log("📥 Staffs reçus de l'API:", response.data);
        setStaffs(response.data);
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

  const loadAcademicYears = async () => {
    try {
      const response = await apiService.getAllSchoolYears();
      if (response.success && response.data) {
        console.log("📥 Années académiques reçues de l'API:", response.data);
        setAcademicYears(response.data);
        // Sélectionner l'année active par défaut
        const activeYear = response.data.find((year) => year.isActive);
        if (activeYear) {
          setBulkFormData((prev) => ({
            ...prev,
            academicYearId: activeYear.id,
          }));
        }
      } else {
        console.error(
          "Erreur lors du chargement des années académiques:",
          response.error
        );
        setAcademicYears([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des années académiques:", error);
      setAcademicYears([]);
    }
  };

  //   const handleStudentFeeSelect = (studentFee: StudentFee) => {
  //     setSelectedStudentFee(studentFee);
  //     setStudentFeeSearchTerm("");
  //     // Pré-remplir le montant avec le montant restant
  //     const remainingAmount =
  //       (Number(studentFee.amountAssigned) || 0) -
  //       getActualAmountPaid(studentFee.id);
  //     setFormData({ ...formData, amount: remainingAmount });
  //     setDisplayAmount(formatAmount(remainingAmount));
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (!selectedStudentFee) {
  //       alert("Veuillez sélectionner un frais étudiant.");
  //       return;
  //     }

  //     if (formData.amount <= 0) {
  //       alert("Le montant doit être positif.");
  //       return;
  //     }

  //     if (!formData.receivedBy) {
  //       alert("Veuillez sélectionner qui reçoit le paiement.");
  //       return;
  //     }

  //     const remainingAmount =
  //       (Number(selectedStudentFee.amountAssigned) || 0) -
  //       getActualAmountPaid(selectedStudentFee.id);
  //     if (formData.amount > remainingAmount) {
  //       alert(
  //         `Le montant ne peut pas dépasser le montant restant (${formatAmount(
  //           remainingAmount
  //         )} FCFA).`
  //       );
  //       return;
  //     }

  //     try {
  //       setIsSubmitting(true);
  //       const data = {
  //         studentFeeId: selectedStudentFee.id,
  //         paymentDate: formData.paymentDate,
  //         amount: formData.amount,
  //         method: formData.method,
  //         provider: formData.provider || undefined,
  //         transactionRef: formData.transactionRef || undefined,
  //         receivedBy: formData.receivedBy, // Utiliser l'ID du staff sélectionné
  //       };

  //       console.log("📤 Données envoyées:", data);
  //       const response = await apiService.createPayment(data);

  //       if (response.success) {
  //         console.log("Paiement créé avec succès");
  //         alert("Paiement enregistré avec succès !");
  //         // Recharger la page pour mettre à jour les données
  //         window.location.reload();
  //       } else {
  //         console.error("Erreur lors de la création:", response.error);
  //         alert(
  //           "Erreur lors de l'enregistrement du paiement. Veuillez réessayer."
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Erreur lors de la sauvegarde:", error);
  //       alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  // Nouvelle fonction pour la soumission en lot
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudentFees.size === 0) {
      alert("Veuillez sélectionner au moins un étudiant.");
      return;
    }

    if (!bulkFormData.receivedBy) {
      alert("Veuillez sélectionner qui a reçu le paiement.");
      return;
    }

    if (!bulkFormData.academicYearId) {
      alert("Veuillez sélectionner une année académique.");
      return;
    }

    if (bulkFormData.amount <= 0) {
      alert("Le montant doit être positif.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Filtrer les frais sélectionnés par l'année académique choisie
      const selectedFees = getFilteredStudentFees().filter(
        (fee) =>
          selectedStudentFees.has(fee.id) &&
          fee.academicYearId === bulkFormData.academicYearId
      );

      if (selectedFees.length === 0) {
        alert(
          "Aucun frais trouvé pour l'année académique sélectionnée parmi les étudiants sélectionnés."
        );
        setIsSubmitting(false);
        return;
      }

      // Vérifier que tous les montants restants sont suffisants
      for (const fee of selectedFees) {
        const actualAmountPaid = getActualAmountPaid(fee.id);
        const remainingAmount =
          (Number(fee.amountAssigned) || 0) - actualAmountPaid;

        if (bulkFormData.amount > remainingAmount) {
          const studentUser = getStudentUser(fee.student.userId);
          alert(
            `Le montant ne peut pas dépasser le montant restant pour ${
              studentUser?.firstName
            } ${studentUser?.lastName} (${formatAmount(remainingAmount)} FCFA).`
          );
          return;
        }
      }

      // Créer les paiements en lot
      const paymentPromises = selectedFees.map((fee) => {
        const data = {
          studentFeeId: fee.id,
          amount: bulkFormData.amount,
          method: bulkFormData.method,
          receivedBy: bulkFormData.receivedBy,
          paymentDate: bulkFormData.paymentDate,
          status: "successful",
        };
        return apiService.createPayment(data);
      });

      const responses = await Promise.all(paymentPromises);
      const successful = responses.filter((r) => r.success);
      const failed = responses.filter((r) => !r.success);

      if (successful.length === selectedFees.length) {
        alert(`${successful.length} paiements enregistrés avec succès !`);
        // Reset form
        setSelectedStudentFees(new Set());
        // Réinitialiser le formulaire mais garder l'année académique
        const currentAcademicYearId = bulkFormData.academicYearId;
        setBulkFormData({
          amount: 0,
          method: "cash",
          receivedBy: "",
          paymentDate: new Date().toISOString().split("T")[0],
          academicYearId: currentAcademicYearId,
        });
        // Refresh page
        window.location.reload();
      } else {
        alert(
          `${successful.length} paiements réussis, ${failed.length} échoués.`
        );
      }
    } catch (error) {
      console.error("❌ Erreur lors de la création en lot:", error);
      alert("Erreur lors de la création des paiements.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //   const filteredStudentFees = studentFees.filter((studentFee) => {
  //     const studentUser = getStudentUser(studentFee.student.userId);
  //     if (!studentUser) return false;

  //     const remainingAmount =
  //       (Number(studentFee.amountAssigned) || 0) -
  //       getActualAmountPaid(studentFee.id);
  //     // Ne montrer que les frais qui ont encore un montant restant
  //     if (remainingAmount <= 0) return false;

  //     return (
  //       studentUser.firstName
  //         .toLowerCase()
  //         .includes(studentFeeSearchTerm.toLowerCase()) ||
  //       studentUser.lastName
  //         .toLowerCase()
  //         .includes(studentFeeSearchTerm.toLowerCase()) ||
  //       studentFee.student.matricule
  //         .toLowerCase()
  //         .includes(studentFeeSearchTerm.toLowerCase()) ||
  //       studentFee.feeType.name
  //         .toLowerCase()
  //         .includes(studentFeeSearchTerm.toLowerCase())
  //     );
  //   });

  const breadcrumbItems = [
    { label: "Finances", path: "/finances" },
    { label: "Paiements", path: "/finances/payments" },
    { label: "Enregistrement", path: "/finances/payments/assign" },
  ];

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader
          title="Enregistrement de paiements en lot"
          subtitle="Sélectionnez un type de frais, puis les étudiants pour enregistrer leurs paiements"
          icon={CreditCard}
          iconColor="from-emerald-600 to-emerald-800"
          actions={
            <Button
              onClick={() => navigate("/finances/payments")}
              variant="outline"
            >
              ← Retour
            </Button>
          }
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des données...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Étape 1: Sélection du type de frais */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                  Étape 1: Sélectionner le type de frais
                </h2>
                <p className="text-sm text-gray-600">
                  Choisissez le type de frais pour lequel vous voulez
                  enregistrer des paiements
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feeTypes.map((feeType) => (
                  <div
                    key={feeType.id}
                    onClick={() => handleFeeTypeSelect(feeType.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer ${
                      selectedFeeType === feeType.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {feeType.name}
                      </h3>
                      {selectedFeeType === feeType.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Montant: {formatAmount(feeType.amountDefault)} FCFA
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Fréquence: {feeType.frequency || "Non spécifiée"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Étape 2: Sélection des étudiants (affiché seulement si un type de frais est sélectionné) */}
            {selectedFeeType && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-green-600" />
                    Étape 2: Sélectionner les étudiants
                  </h2>
                  <p className="text-sm text-gray-600">
                    Sélectionnez les étudiants qui ont payé pour ce type de
                    frais
                  </p>
                </div>

                {/* Actions en lot */}
                <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedStudentFees.size} étudiant(s) sélectionné(s)
                    </span>
                    <span className="text-xs text-gray-500">
                      ({getFilteredStudentFees().length} étudiant(s) trouvé(s))
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={selectAllStudentFees}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <CheckSquare className="w-4 h-4 mr-1" />
                        Tout sélectionner
                      </Button>
                      <Button
                        type="button"
                        onClick={deselectAllStudentFees}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Square className="w-4 h-4 mr-1" />
                        Tout désélectionner
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Barre de recherche */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un étudiant..."
                      value={studentFeeSearchTerm}
                      onChange={(e) => setStudentFeeSearchTerm(e.target.value)}
                      className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Liste des étudiants */}
                <div className="relative">
                  <div className="space-y-2 max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {getFilteredStudentFees().map((studentFee) => {
                      const studentUser = getStudentUser(
                        studentFee.student.userId
                      );
                      const actualAmountPaid = getActualAmountPaid(
                        studentFee.id
                      );
                      const remainingAmount =
                        (Number(studentFee.amountAssigned) || 0) -
                        actualAmountPaid;
                      const isSelected = selectedStudentFees.has(studentFee.id);

                      return studentUser ? (
                        <div
                          key={studentFee.id}
                          onClick={() =>
                            toggleStudentFeeSelection(studentFee.id)
                          }
                          className={`p-3 border-2 rounded-lg cursor-pointer ${
                            isSelected
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                <GraduationCap className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {studentUser.firstName} {studentUser.lastName}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                                  <span className="flex font-extrabold items-center">
                                    <FileText className="w-3 font-extrabold h-3 mr-1" />
                                    {studentFee.student.matricule}
                                  </span>
                                  <span className="flex font-extrabold items-center">
                                    <GraduationCap className="w-3 font-extrabold h-3 mr-1" />
                                    {getStudentClass(studentFee.student.id)}
                                  </span>
                                  <span className="flex font-extrabold items-center px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                    <CreditCard className="w-3 font-extrabold h-3 mr-1" />
                                    {studentFee.feeType.name}
                                  </span>
                                  <span className="flex font-extrabold items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                    {studentFee.academicYear.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900">
                                {formatAmount(remainingAmount)} FCFA
                              </div>
                              <div className="text-xs text-gray-500">
                                Restant
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Indicateur de scroll */}
                  {getFilteredStudentFees().length > 10 && (
                    <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      {getFilteredStudentFees().length} étudiants
                    </div>
                  )}
                </div>

                {getFilteredStudentFees().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun étudiant trouvé pour ce type de frais</p>
                  </div>
                )}
              </Card>
            )}

            {/* Étape 3: Formulaire de paiement en lot (affiché seulement si des étudiants sont sélectionnés) */}
            {selectedStudentFees.size > 0 && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                    Étape 3: Détails du paiement
                  </h2>
                  <p className="text-sm text-gray-600">
                    Renseignez les détails du paiement qui sera appliqué à tous
                    les étudiants sélectionnés
                  </p>
                  {selectedFeeType && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">
                            Type de frais:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {feeTypes.find((ft) => ft.id === selectedFeeType)
                              ?.name || "N/A"}
                          </span>
                        </div>
                        {bulkFormData.academicYearId && (
                          <div>
                            <span className="font-semibold text-gray-700">
                              Année sélectionnée:
                            </span>
                            <span className="ml-2 text-purple-700 font-semibold">
                              {academicYears.find(
                                (y) => y.id === bulkFormData.academicYearId
                              )?.name || "N/A"}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-gray-700">
                            Années disponibles:
                          </span>
                          <span className="ml-2 text-gray-600 text-xs">
                            {Array.from(
                              new Set(
                                getFilteredStudentFees()
                                  .filter((fee) =>
                                    selectedStudentFees.has(fee.id)
                                  )
                                  .map((fee) => fee.academicYear.name)
                              )
                            ).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleBulkSubmit} className="space-y-6">
                  {/* Année académique */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année académique <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bulkFormData.academicYearId}
                      onChange={(e) =>
                        setBulkFormData({
                          ...bulkFormData,
                          academicYearId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    >
                      <option value="">
                        Sélectionner une année académique
                      </option>
                      {academicYears.map((year) => (
                        <option key={year.id} value={year.id}>
                          {year.name} {year.isActive ? "(Active)" : ""}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Sélectionnez l'année académique pour laquelle ce paiement
                      est destiné
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Montant */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Montant du paiement (FCFA)
                      </label>
                      <input
                        type="number"
                        value={bulkFormData.amount}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            amount: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        min="1"
                      />
                    </div>

                    {/* Méthode de paiement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Méthode de paiement
                      </label>
                      <select
                        value={bulkFormData.method}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            method: e.target.value as
                              | "cash"
                              | "bank_transfer"
                              | "mobile_money"
                              | "card",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      >
                        <option value="cash">Espèces</option>
                        <option value="bank_transfer">Virement bancaire</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="card">Carte bancaire</option>
                      </select>
                    </div>

                    {/* Reçu par */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reçu par
                      </label>
                      <select
                        value={bulkFormData.receivedBy}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            receivedBy: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      >
                        <option value="">
                          Sélectionner un membre du personnel
                        </option>
                        {staffs.map((staff) => (
                          <option key={staff.user.id} value={staff.user.id}>
                            {staff.user.firstName} {staff.user.lastName}
                            {staff.position && ` - ${staff.position}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date de paiement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de paiement
                      </label>
                      <input
                        type="date"
                        value={bulkFormData.paymentDate}
                        onChange={(e) =>
                          setBulkFormData({
                            ...bulkFormData,
                            paymentDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Résumé */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Résumé du paiement en lot
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">
                          Étudiants sélectionnés:
                        </span>
                        <span className="ml-2 font-bold text-blue-900">
                          {selectedStudentFees.size}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Montant par étudiant:
                        </span>
                        <span className="ml-2 font-bold text-blue-900">
                          {formatAmount(bulkFormData.amount)} FCFA
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Total à enregistrer:
                        </span>
                        <span className="ml-2 font-bold text-blue-900">
                          {formatAmount(
                            bulkFormData.amount * selectedStudentFees.size
                          )}{" "}
                          FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedStudentFees(new Set());
                        setBulkFormData({
                          amount: 0,
                          method: "cash",
                          receivedBy: "",
                          paymentDate: new Date().toISOString().split("T")[0],
                          academicYearId: "",
                        });
                      }}
                      variant="outline"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Enregistrer {selectedStudentFees.size} paiement(s)
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        )}
      </div>
    </AuthenticatedPage>
  );
};

export default PaymentAssignmentPage;
