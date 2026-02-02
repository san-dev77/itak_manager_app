import { GraduationCap, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentFeesTable from "../../components/finance/StudentFeesTable";
import StudentPaymentModal from "../../components/finance/StudentPaymentModal";
import AuthenticatedPage from "../../components/layout/AuthenticatedPage";
import { HeaderActionButton } from "../../components/ui/ActionButton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import FormModal from "../../components/ui/FormModal";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import {
    apiService,
    type Payment,
    type StudentClass,
    type StudentWithUser,
    type User,
} from "../../services/api";

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
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [fullStudents, setFullStudents] = useState<StudentWithUser[]>([]); // Étudiants complets avec photos
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentFee, setEditingStudentFee] = useState<StudentFee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  } | null>(null);

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
    loadAllData();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const loadStudentClasses = async () => {
    try {
      const response = await apiService.getAllStudentClasses();
      if (response.success && response.data) {
        console.log("📥 Classes d'étudiants reçues de l'API:", response.data);
        // Debug: vérifier si les données incluent classCategory avec institution
        if (response.data.length > 0) {
          const firstClass = response.data[0];
          console.log("🔍 Exemple de classe reçue (frontend):", {
            hasClass: !!firstClass.class,
            className: firstClass.class?.name,
            hasClassCategory: !!firstClass.class?.classCategory,
            classCategoryName: firstClass.class?.classCategory?.name,
            hasInstitution: !!firstClass.class?.classCategory?.institution,
            institution: firstClass.class?.classCategory?.institution,
            fullClassCategory: firstClass.class?.classCategory,
          });
        }
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

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadStudentFees(),
        loadStudents(),
        loadFullStudents(), // Charger les étudiants complets avec photos
        loadFeeTypes(),
        loadAcademicYears(),
        loadPayments(), // Ajouter le chargement des paiements
        loadStudentClasses(), // Ajouter le chargement des classes d'étudiants
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFullStudents = async () => {
    try {
      const response = await apiService.getAllStudents();
      if (response.success && response.data) {
        console.log("📥 Étudiants complets reçus de l'API:", response.data);
        setFullStudents(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des étudiants complets:",
          response.error
        );
        setFullStudents([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants complets:", error);
      setFullStudents([]);
    }
  };

  const loadStudentFees = async () => {
    try {
      const response = await apiService.getAllStudentFees();

      if (response.success && response.data) {
        console.log("📥 Données reçues de l'API:", response.data);
        console.log("📥 Premier StudentFee:", response.data[0]);
        // Filtrer les StudentFee qui ont un student valide
        const validFees = response.data.filter(
          (fee) => fee.student && fee.student.id
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

  const loadStudents = async () => {
    try {
      const response = await apiService.getAllStudents();
      if (response.success && response.data) {
        // Convertir les étudiants en format Student pour le formulaire
        const studentUsers = response.data.map((student) => ({
          id: student.user.id,
          firstName: student.user.firstName,
          lastName: student.user.lastName,
          matricule:
            student.matricule ||
            student.user.username ||
            `STU${student.user.id}`,
        }));
        console.log("📥 Étudiants reçus de l'API:", studentUsers);
        setStudents(studentUsers);
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
    console.log("📝 Modification du frais:", studentFee);
    console.log("📝 StudentId:", studentFee.studentId);
    console.log("📝 Étudiants disponibles:", students);

    setEditingStudentFee(studentFee);

    // Formater la date pour l'input date (format YYYY-MM-DD)
    const dueDateFormatted = studentFee.dueDate
      ? new Date(studentFee.dueDate).toISOString().split("T")[0]
      : "";

    setFormData({
      studentId: studentFee.studentId,
      feeTypeId: studentFee.feeTypeId,
      academicYearId: studentFee.academicYearId,
      amountAssigned: studentFee.amountAssigned,
      dueDate: dueDateFormatted,
    });
    setDisplayAmount(formatAmount(studentFee.amountAssigned));
    setIsModalOpen(true);

    // Vérifier que l'étudiant est bien dans la liste
    const studentExists = students.find((s) => s.id === studentFee.studentId);
    if (!studentExists) {
      console.warn(
        "⚠️ L'étudiant n'a pas été trouvé dans la liste:",
        studentFee.studentId
      );
    }
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

  const handleDeleteStudentFee = handleDelete;

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

  // Filtrer les frais
  const normalizeValue = (value?: string | number | null) =>
    String(value ?? "").toLowerCase();

  const getStudentClassName = (studentId: string) => {
    const studentClass = studentClasses.find(
      (sc) => sc.studentId === studentId && !sc.endDate
    );
    return studentClass?.class?.name || "";
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredStudentFees = studentFees.filter((studentFee) => {
    // Vérifications de sécurité pour éviter les erreurs
    const student = studentFee.student;
    const feeType = studentFee.feeType;

    if (!student || !feeType) {
      console.warn("StudentFee avec données manquantes:", studentFee);
      return false;
    }

    const fullStudent = fullStudents.find((s) => s.id === student.id);
    const studentPhone = fullStudent?.user?.phone || "";
    const className = getStudentClassName(student.id);
    const academicYearName = studentFee.academicYear?.name || "";

    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        student.firstName,
        student.lastName,
        student.matricule,
        studentPhone,
        className,
        feeType.name,
        academicYearName,
        studentFee.status,
        studentFee.amountAssigned,
        studentFee.amountPaid,
        studentFee.dueDate,
      ]
        .map(normalizeValue)
        .some((value) => value.includes(normalizedSearch));

    const matchesStatus =
      statusFilter === "all" || studentFee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Finances", path: "/finances" },
            { label: "Frais étudiants" },
          ]}
        />
        <PageHeader
          title="Frais étudiants"
          subtitle="Gérez les frais assignés individuellement aux étudiants"
          icon={GraduationCap}
          iconColor="from-violet-600 to-violet-700"
          actions={
            <HeaderActionButton
              onClick={() => navigate("/finances/student-fee-assignment")}
              icon={Plus}
              label="Attribuer un frais"
            />
          }
        />

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
            className="px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des frais étudiants...</p>
            </div>
          </div>
        ) : (
          <StudentFeesTable
            studentFees={filteredStudentFees}
            users={users}
            fullStudents={fullStudents}
            studentClasses={studentClasses}
            payments={payments}
            onEdit={handleEdit}
            onDelete={handleDeleteStudentFee}
            onPayment={(studentId) => {
              const student = filteredStudentFees.find(
                (fee) => fee.student.id === studentId
              );
              if (student) {
                setSelectedStudentForPayment({
                  id: student.student.id,
                  firstName: student.student.firstName,
                  lastName: student.student.lastName,
                  matricule: student.student.matricule,
                });
                setShowPaymentModal(true);
              }
            }}
          />
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
            {editingStudentFee ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Étudiant
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900 font-medium">
                      {editingStudentFee.student.firstName}{" "}
                      {editingStudentFee.student.lastName}
                    </span>
                    <span className="text-gray-500">
                      ({editingStudentFee.student.matricule})
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Étudiant
                </label>
                <select
                  value={formData.studentId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un étudiant</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} (
                      {student.matricule})
                    </option>
                  ))}
                </select>
              </div>
            )}

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

        {/* Modale de paiement */}
        {selectedStudentForPayment && (
          <StudentPaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedStudentForPayment(null);
            }}
            student={selectedStudentForPayment}
            studentFees={filteredStudentFees.filter(
              (fee) => fee.student.id === selectedStudentForPayment.id
            )}
            payments={payments}
            onSuccess={() => {
              loadStudentFees();
              loadPayments();
            }}
          />
        )}
      </div>
    </AuthenticatedPage>
  );
};

export default StudentFeesPage;
