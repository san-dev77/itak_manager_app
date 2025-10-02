import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import FormModal from "../../components/ui/FormModal";
import { apiService } from "../../services/api";
import {
  User,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit3,
  Trash2,
  GraduationCap,
  FileText,
} from "lucide-react";

interface StudentFee {
  id: string;
  studentId: string;
  feeTypeId: string;
  academicYearId: string;
  amountAssigned: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
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
  amountPaid: number; // Calculé côté backend
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
}

interface FeeType {
  id: string;
  name: string;
  amountDefault: number;
}

interface AcademicYear {
  id: string;
  name: string;
  isActive: boolean;
}

const StudentFeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentFee, setEditingStudentFee] = useState<StudentFee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set()
  );

  const [formData, setFormData] = useState({
    studentId: "",
    feeTypeId: "",
    academicYearId: "",
    amountAssigned: 0,
    dueDate: "",
  });

  const [displayAmount, setDisplayAmount] = useState("");

  // Fonctions utilitaires pour le formatage des montants
  const formatAmount = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null || amount === "") {
      return "0";
    }
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return numericAmount.toLocaleString("fr-FR");
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

  // Fonction pour regrouper les frais par étudiant
  const groupFeesByStudent = (fees: StudentFee[]) => {
    const grouped = fees.reduce(
      (acc, fee) => {
        const studentId = fee.studentId;
        if (!acc[studentId]) {
          acc[studentId] = {
            student: fee.student,
            fees: [],
            totalAssigned: 0,
            totalPaid: 0,
            totalRemaining: 0,
          };
        }
        acc[studentId].fees.push(fee);
        acc[studentId].totalAssigned += Number(fee.amountAssigned) || 0;
        acc[studentId].totalPaid += Number(fee.amountPaid) || 0;
        acc[studentId].totalRemaining +=
          (Number(fee.amountAssigned) || 0) - (Number(fee.amountPaid) || 0);
        return acc;
      },
      {} as Record<
        string,
        {
          student: StudentFee["student"];
          fees: StudentFee[];
          totalAssigned: number;
          totalPaid: number;
          totalRemaining: number;
        }
      >
    );

    return Object.values(grouped);
  };

  // Fonction helper pour obtenir les données utilisateur d'un étudiant
  const getStudentUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const parseAmount = (value: string): number => {
    const cleanValue = value.replace(/[\s.]/g, "");
    return parseInt(cleanValue) || 0;
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseAmount(value);
    setFormData({ ...formData, amountAssigned: numericValue });
    setDisplayAmount(formatAmount(numericValue));
  };

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        loadAllData();
        loadUsers();
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
        loadStudents(),
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
        console.log("📥 Données reçues de l'API:", response.data);
        console.log("📥 Premier StudentFee:", response.data[0]);
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

  const loadStudents = async () => {
    try {
      const response = await apiService.get("/users?role=student");
      if (response.success && response.data) {
        console.log("📥 Étudiants reçus de l'API:", response.data);
        setStudents(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des étudiants:",
          response.error
        );
        setStudents([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
      setStudents([]);
    }
  };

  const loadFeeTypes = async () => {
    try {
      const response = await apiService.getAllFeeTypes();
      if (response.success && response.data) {
        setFeeTypes(response.data);
      } else {
        setFeeTypes([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des types de frais:", error);
      setFeeTypes([]);
    }
  };

  const loadAcademicYears = async () => {
    try {
      const response = await apiService.getAllSchoolYears();
      if (response.success && response.data) {
        setAcademicYears(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des années scolaires:",
          response.error
        );
        setAcademicYears([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des années scolaires:", error);
      setAcademicYears([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("📤 Données envoyées:", formData);

      if (editingStudentFee) {
        const response = await apiService.updateStudentFee(
          editingStudentFee.id,
          formData
        );
        if (response.success) {
          console.log("Frais étudiant mis à jour avec succès");
        } else {
          console.error("Erreur lors de la mise à jour:", response.error);
          alert("Erreur lors de la mise à jour du frais étudiant");
          return;
        }
      } else {
        const response = await apiService.createStudentFee(formData);
        if (response.success) {
          console.log("Frais étudiant créé avec succès");
        } else {
          console.error("Erreur lors de la création:", response.error);
          alert("Erreur lors de la création du frais étudiant");
          return;
        }
      }

      setIsModalOpen(false);
      setEditingStudentFee(null);
      resetForm();
      loadStudentFees();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    }
  };

  const handleEdit = (studentFee: StudentFee) => {
    setEditingStudentFee(studentFee);
    setFormData({
      studentId: studentFee.studentId,
      feeTypeId: studentFee.feeTypeId,
      academicYearId: studentFee.academicYearId,
      amountAssigned: studentFee.amountAssigned,
      dueDate: studentFee.dueDate,
    });
    setDisplayAmount(formatAmount(studentFee.amountAssigned));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce frais étudiant ?")
    ) {
      try {
        const response = await apiService.deleteStudentFee(id);
        if (response.success) {
          console.log("Frais étudiant supprimé avec succès");
          loadStudentFees();
        } else {
          console.error("Erreur lors de la suppression:", response.error);
          alert("Erreur lors de la suppression du frais étudiant");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression. Veuillez réessayer.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      feeTypeId: "",
      academicYearId: "",
      amountAssigned: 0,
      dueDate: "",
    });
    setDisplayAmount("");
  };

  const openModal = () => {
    setEditingStudentFee(null);
    resetForm();
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "partial":
        return "Partiel";
      case "pending":
        return "En attente";
      case "overdue":
        return "En retard";
      default:
        return status;
    }
  };

  // Filtrer d'abord les frais, puis les regrouper par étudiant
  const filteredStudentFees = studentFees.filter((studentFee) => {
    // Vérifications de sécurité pour éviter les erreurs
    const student = studentFee.student;
    const feeType = studentFee.feeType;

    if (!student || !feeType) {
      console.warn("StudentFee avec données manquantes:", studentFee);
      return false;
    }

    const matchesSearch =
      student.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      feeType.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "all" || studentFee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Regrouper les frais filtrés par étudiant
  const groupedStudentFees = groupFeesByStudent(filteredStudentFees);

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
                Frais étudiants
              </h1>
              <p className="text-gray-600">
                Gérez les frais assignés individuellement aux étudiants
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/finances")} variant="outline">
                ← Retour
              </Button>
              <Button
                onClick={() => navigate("/finances/student-fee-assignment")}
              >
                + Attribuer un frais
              </Button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex gap-4">
          <Input
            type="text"
            placeholder="Rechercher un frais étudiant..."
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
            <option value="pending">En attente</option>
            <option value="partial">Partiel</option>
            <option value="paid">Payé</option>
            <option value="overdue">En retard</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des frais étudiants...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedStudentFees.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Aucun frais étudiant
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Commencez par attribuer des frais aux étudiants pour suivre
                    leurs paiements.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>
                      Utilisez le bouton "Nouveau frais" pour commencer
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              groupedStudentFees.map((group) => {
                const studentUser = getStudentUser(group.student.userId);
                const isExpanded = expandedStudents.has(group.student.id);

                return (
                  <Card key={group.student.id} className="overflow-hidden">
                    {/* En-tête de l'étudiant */}
                    <div
                      className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 cursor-pointer hover:from-slate-100 hover:to-gray-100 transition-all duration-200 shadow-sm"
                      onClick={() => toggleStudentExpansion(group.student.id)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {studentUser
                                ? `${studentUser.firstName} ${studentUser.lastName}`
                                : `Étudiant ${group.student.matricule}`}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-700">
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
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">Frais:</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                  {group.fees.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:space-x-6">
                          {/* Résumé des montants */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Assigné
                                </span>
                              </div>
                              <div className="text-lg font-bold text-gray-900">
                                {formatAmount(group.totalAssigned)} FCFA
                              </div>
                            </div>

                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                <CreditCard className="w-4 h-4 text-green-600" />
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Payé
                                </span>
                              </div>
                              <div className="text-lg font-bold text-green-700">
                                {formatAmount(group.totalPaid)} FCFA
                              </div>
                            </div>

                            <div
                              className={`rounded-lg p-3 shadow-sm border ${
                                group.totalRemaining > 0
                                  ? "bg-red-50 border-red-200"
                                  : "bg-green-50 border-green-200"
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-1 mb-1">
                                {group.totalRemaining > 0 ? (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                <span
                                  className={`text-xs font-semibold uppercase tracking-wide ${
                                    group.totalRemaining > 0
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  Restant
                                </span>
                              </div>
                              <div
                                className={`text-lg font-bold ${
                                  group.totalRemaining > 0
                                    ? "text-red-700"
                                    : "text-green-700"
                                }`}
                              >
                                {formatAmount(group.totalRemaining)} FCFA
                              </div>
                            </div>
                          </div>

                          {/* Icône d'expansion */}
                          <div className="flex items-center ml-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                isExpanded
                                  ? "bg-blue-100 text-blue-600"
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
                    </div>

                    {/* Détails des frais (expandable) */}
                    {isExpanded && (
                      <div className="p-4 bg-white overflow-x-auto">
                        <div className="space-y-3 min-w-max">
                          {group.fees.map((fee) => (
                            <div
                              key={fee.id}
                              className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                                {/* Type de frais */}
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <FileText className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {fee.feeType.name}
                                    </div>
                                    <div className="text-xs text-gray-600 font-medium">
                                      {fee.academicYear.name}
                                    </div>
                                  </div>
                                </div>

                                {/* Montant assigné */}
                                <div className="text-center">
                                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <TrendingUp className="w-4 h-4 text-blue-600" />
                                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                        Assigné
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {formatAmount(fee.amountAssigned)} FCFA
                                    </div>
                                  </div>
                                </div>

                                {/* Montant payé */}
                                <div className="text-center">
                                  <div
                                    className={`rounded-lg p-3 border ${
                                      Number(fee.amountPaid) > 0
                                        ? Number(fee.amountPaid) >=
                                          Number(fee.amountAssigned)
                                          ? "bg-green-50 border-green-200"
                                          : "bg-blue-50 border-blue-200"
                                        : "bg-gray-50 border-gray-200"
                                    }`}
                                  >
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <CreditCard
                                        className={`w-4 h-4 ${
                                          Number(fee.amountPaid) > 0
                                            ? Number(fee.amountPaid) >=
                                              Number(fee.amountAssigned)
                                              ? "text-green-600"
                                              : "text-blue-600"
                                            : "text-gray-500"
                                        }`}
                                      />
                                      <span
                                        className={`text-xs font-semibold uppercase tracking-wide ${
                                          Number(fee.amountPaid) > 0
                                            ? Number(fee.amountPaid) >=
                                              Number(fee.amountAssigned)
                                              ? "text-green-600"
                                              : "text-blue-600"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        Payé
                                      </span>
                                    </div>
                                    <div
                                      className={`text-sm font-bold ${
                                        Number(fee.amountPaid) > 0
                                          ? Number(fee.amountPaid) >=
                                            Number(fee.amountAssigned)
                                            ? "text-green-700"
                                            : "text-blue-700"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {formatAmount(fee.amountPaid)} FCFA
                                      {Number(fee.amountPaid) > 0 &&
                                        Number(fee.amountPaid) <
                                          Number(fee.amountAssigned) && (
                                          <span className="text-xs text-blue-500 ml-1 font-medium">
                                            (partiel)
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </div>

                                {/* Montant restant */}
                                <div className="text-center">
                                  <div
                                    className={`rounded-lg p-3 border ${
                                      Number(fee.amountAssigned) -
                                        Number(fee.amountPaid) >
                                      0
                                        ? "bg-red-50 border-red-200"
                                        : "bg-green-50 border-green-200"
                                    }`}
                                  >
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      {Number(fee.amountAssigned) -
                                        Number(fee.amountPaid) >
                                      0 ? (
                                        <TrendingDown className="w-4 h-4 text-red-600" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      )}
                                      <span
                                        className={`text-xs font-semibold uppercase tracking-wide ${
                                          Number(fee.amountAssigned) -
                                            Number(fee.amountPaid) >
                                          0
                                            ? "text-red-600"
                                            : "text-green-600"
                                        }`}
                                      >
                                        Restant
                                      </span>
                                    </div>
                                    <div
                                      className={`text-sm font-bold ${
                                        Number(fee.amountAssigned) -
                                          Number(fee.amountPaid) >
                                        0
                                          ? "text-red-700"
                                          : "text-green-700"
                                      }`}
                                    >
                                      {formatAmount(
                                        Number(fee.amountAssigned) -
                                          Number(fee.amountPaid)
                                      )}{" "}
                                      FCFA
                                    </div>
                                  </div>
                                </div>

                                {/* Date d'échéance */}
                                <div className="text-center">
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <Calendar className="w-4 h-4 text-gray-600" />
                                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                        Échéance
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {new Date(fee.dueDate).toLocaleDateString(
                                        "fr-FR"
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Statut et Actions */}
                                <div className="flex flex-col space-y-3">
                                  <div className="flex justify-center">
                                    <span
                                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                                        fee.status
                                      )}`}
                                    >
                                      {fee.status === "paid" && (
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                      )}
                                      {fee.status === "partial" && (
                                        <Clock className="w-3 h-3 mr-1" />
                                      )}
                                      {fee.status === "pending" && (
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                      )}
                                      {getStatusText(fee.status)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col space-y-2">
                                    <button
                                      onClick={() => handleEdit(fee)}
                                      className="flex items-center justify-center space-x-2 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border border-blue-200 hover:border-blue-300"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Modifier</span>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(fee.id)}
                                      className="flex items-center justify-center space-x-2 text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border border-red-200 hover:border-red-300"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Supprimer</span>
                                    </button>
                                  </div>
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

        {/* Modal */}
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            editingStudentFee
              ? "Modifier le frais étudiant"
              : "Nouveau frais étudiant"
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étudiant
              </label>
              <select
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un étudiant</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.matricule})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de frais
              </label>
              <select
                value={formData.feeTypeId}
                onChange={(e) => {
                  const selectedFeeType = feeTypes.find(
                    (ft) => ft.id === e.target.value
                  );
                  setFormData({
                    ...formData,
                    feeTypeId: e.target.value,
                    amountAssigned: selectedFeeType?.amountDefault || 0,
                  });
                  setDisplayAmount(
                    formatAmount(selectedFeeType?.amountDefault || 0)
                  );
                }}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un type de frais</option>
                {feeTypes.map((feeType) => (
                  <option key={feeType.id} value={feeType.id}>
                    {feeType.name} - {formatAmount(feeType.amountDefault)} FCFA
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année scolaire
              </label>
              <select
                value={formData.academicYearId}
                onChange={(e) =>
                  setFormData({ ...formData, academicYearId: e.target.value })
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une année scolaire</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.isActive ? "(Actuelle)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant assigné (FCFA)
              </label>
              <input
                type="text"
                value={displayAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Ex: 500.000"
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <Input
              label="Date d'échéance"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {editingStudentFee ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </FormModal>
      </div>
    </Layout>
  );
};

export default StudentFeesPage;
