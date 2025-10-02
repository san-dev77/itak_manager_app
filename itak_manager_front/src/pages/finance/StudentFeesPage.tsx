import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import FormModal from "../../components/ui/FormModal";
import { apiService } from "../../services/api";
import { User, DollarSign } from "lucide-react";

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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de frais
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Année scolaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant assigné
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant payé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'échéance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudentFees.map((studentFee) => (
                    <tr key={studentFee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          {(() => {
                            const studentUser = getStudentUser(
                              studentFee.student.userId
                            );
                            return studentUser ? (
                              <>
                                <div className="text-sm font-medium text-gray-900">
                                  {studentUser.firstName} {studentUser.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {studentFee.student.matricule}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-gray-900">
                                  Étudiant {studentFee.student.matricule}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Chargement...
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {studentFee.feeType.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {studentFee.academicYear.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(studentFee.amountAssigned)} FCFA
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatAmount(studentFee.amountPaid)} FCFA
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(studentFee.dueDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            studentFee.status
                          )}`}
                        >
                          {getStatusText(studentFee.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(studentFee)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(studentFee.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudentFees.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun frais étudiant
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez par créer un nouveau frais étudiant.
                  </p>
                </div>
              </div>
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
