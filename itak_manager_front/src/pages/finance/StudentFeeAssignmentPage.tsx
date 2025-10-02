import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { apiService } from "../../services/api";
import {
  User,
  DollarSign,
  Calendar,
  Search,
  CheckSquare,
  Square,
  Users,
  GraduationCap,
  FileText,
  ArrowRight,
} from "lucide-react";

interface Student {
  id: string;
  userId: string;
  matricule: string;
  enrollmentDate: string | Date;
  photo?: string;
  maritalStatus?: string;
  fatherName?: string;
  motherName?: string;
  tutorName?: string;
  tutorPhone?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface StudentClass {
  id: string;
  studentId: string;
  classId: string;
  startDate: string;
  endDate?: string;
  created_at: string;
  updated_at: string;
  student: Student;
  class: {
    id: string;
    name: string;
    description?: string;
    level?: string;
    capacity?: number;
    isActive?: boolean;
  };
}

interface FeeType {
  id: string;
  name: string;
  description?: string;
  amountDefault: number;
  isRecurring: boolean;
  frequency?: string;
}

interface AcademicYear {
  id: string;
  name: string;
  isActive: boolean;
}

const StudentFeeAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<typeof User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [studentFees, setStudentFees] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la sélection
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType | null>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);

  // États pour la recherche
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [feeTypeSearchTerm, setFeeTypeSearchTerm] = useState("");

  // États pour la sélection multiple
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [isBulkMode, setIsBulkMode] = useState(false);

  // État pour le formulaire
  const [formData, setFormData] = useState({
    dueDate: "",
  });

  // Fonctions utilitaires pour le formatage des montants
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("fr-FR");
  };

  // Fonction helper pour obtenir la classe d'un étudiant
  const getStudentClass = (studentId: string, userId?: string) => {
    console.log(
      "🔍 Recherche classe pour studentId:",
      studentId,
      "userId:",
      userId
    );
    console.log("📚 Toutes les classes d'étudiants:", studentClasses);

    // Essayer d'abord par studentId
    let studentClass = studentClasses.find(
      (sc) => sc.studentId === studentId && !sc.endDate
    );

    console.log("🔍 Recherche par studentId:", studentClass);

    // Si pas trouvé et qu'on a un userId, essayer par userId
    if (!studentClass && userId) {
      studentClass = studentClasses.find(
        (sc) => sc.student.userId === userId && !sc.endDate
      );
      console.log("🔍 Recherche par userId:", studentClass);
    }

    // Si toujours pas trouvé, essayer sans vérifier endDate
    if (!studentClass) {
      studentClass = studentClasses.find((sc) => sc.studentId === studentId);
      console.log("🔍 Recherche sans endDate:", studentClass);
    }

    console.log("🎯 Classe finale trouvée:", studentClass);
    return studentClass?.class || null;
  };

  const parseAmount = (value: string): number => {
    const cleanValue = value.replace(/[\s.]/g, "");
    return parseInt(cleanValue) || 0;
  };

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
      await Promise.all([
        loadStudents(),
        loadStudentClasses(),
        loadFeeTypes(),
        loadAcademicYears(),
        loadStudentFees(),
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
        console.log("📥 Étudiants reçus de l'API:", response.data);
        console.log("📥 Premier étudiant:", response.data[0]);
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

  const loadStudentClasses = async () => {
    try {
      const response = await apiService.getAllStudentClasses();
      if (response.success && response.data) {
        console.log("📥 Classes d'étudiants reçues de l'API:", response.data);
        console.log("📥 Premier élément:", response.data[0]);
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

  const loadStudentFees = async () => {
    try {
      const response = await apiService.getAllStudentFees();
      if (response.success && response.data) {
        console.log("📥 Frais étudiants reçus de l'API:", response.data);
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

  const loadFeeTypes = async () => {
    try {
      const response = await apiService.getAllFeeTypes();
      if (response.success && response.data) {
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

  const loadAcademicYears = async () => {
    try {
      const response = await apiService.getAllSchoolYears();
      if (response.success && response.data) {
        console.log("📥 Années scolaires reçues de l'API:", response.data);
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

  const handleStudentSelect = (student: Student) => {
    if (isBulkMode) {
      toggleStudentSelection(student.id);
    } else {
      setSelectedStudent(student);
      setStudentSearchTerm("");
    }
  };

  // Fonctions pour la sélection multiple
  const toggleStudentSelection = (studentId: string) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const selectAllFilteredStudents = () => {
    const filtered = students.filter(
      (student) =>
        student.user.firstName
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase()) ||
        student.user.lastName
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase()) ||
        student.matricule
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase())
    );
    setSelectedStudents(new Set(filtered.map((s) => s.id)));
  };

  const deselectAllStudents = () => {
    setSelectedStudents(new Set());
  };

  const handleFeeTypeSelect = (feeType: FeeType) => {
    console.log("🎯 Type de frais sélectionné:", feeType);
    console.log("🎯 Montant par défaut:", feeType.amountDefault);
    console.log("🎯 Type de montant:", typeof feeType.amountDefault);
    setSelectedFeeType(feeType);
    setFeeTypeSearchTerm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !selectedFeeType || !selectedAcademicYear) {
      alert(
        "Veuillez sélectionner un étudiant, un type de frais et une année scolaire."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Vérifier que le montant par défaut est valide
      if (
        !selectedFeeType.amountDefault ||
        selectedFeeType.amountDefault <= 0
      ) {
        alert(
          "Erreur: Le type de frais sélectionné n'a pas de montant valide."
        );
        setIsSubmitting(false);
        return;
      }

      const data = {
        studentId: selectedStudent.id,
        feeTypeId: selectedFeeType.id,
        academicYearId: selectedAcademicYear.id,
        amountAssigned: Number(selectedFeeType.amountDefault),
        dueDate: formData.dueDate,
      };

      console.log("📤 Données envoyées:", data);
      console.log("📤 Montant par défaut:", selectedFeeType.amountDefault);
      console.log("📤 Type de montant:", typeof selectedFeeType.amountDefault);
      console.log(
        "📤 Montant converti:",
        Number(selectedFeeType.amountDefault)
      );
      console.log(
        "📤 Type du montant converti:",
        typeof Number(selectedFeeType.amountDefault)
      );
      const response = await apiService.createStudentFee(data);

      if (response.success) {
        console.log("Frais étudiant créé avec succès");
        alert("Frais attribué avec succès à l'étudiant !");
        // Recharger la page pour mettre à jour les données
        window.location.reload();
      } else {
        console.error("Erreur lors de la création:", response.error);
        alert("Erreur lors de l'attribution du frais. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour la soumission en lot
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      selectedStudents.size === 0 ||
      !selectedFeeType ||
      !selectedAcademicYear
    ) {
      alert(
        "Veuillez sélectionner au moins un étudiant, un type de frais et une année scolaire."
      );
      return;
    }

    if (!formData.dueDate) {
      alert("Veuillez définir une date d'échéance.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Vérifier que le montant par défaut est valide
      if (
        !selectedFeeType.amountDefault ||
        selectedFeeType.amountDefault <= 0
      ) {
        alert(
          "Erreur: Le type de frais sélectionné n'a pas de montant valide."
        );
        setIsSubmitting(false);
        return;
      }

      // Créer les frais pour tous les étudiants sélectionnés
      const promises = Array.from(selectedStudents).map((studentId) => {
        const data = {
          studentId: studentId,
          feeTypeId: selectedFeeType.id,
          academicYearId: selectedAcademicYear.id,
          amountAssigned: Number(selectedFeeType.amountDefault),
          dueDate: formData.dueDate,
        };
        return apiService.createStudentFee(data);
      });

      const responses = await Promise.all(promises);
      const successful = responses.filter((r) => r.success);
      const failed = responses.filter((r) => !r.success);

      if (successful.length === responses.length) {
        alert(
          `Frais attribués avec succès à ${successful.length} étudiant(s) !`
        );
        window.location.reload();
      } else {
        alert(
          `${successful.length} attribution(s) réussie(s), ${failed.length} échouée(s).`
        );
        if (failed.length < responses.length) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde en lot:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    // Afficher tous les étudiants, même ceux qui ont déjà des frais

    // Appliquer le filtre de recherche
    return (
      student.user.firstName
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      student.user.lastName
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      student.matricule
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      (student.user.email &&
        student.user.email
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase()))
    );
  });

  const filteredFeeTypes = feeTypes.filter(
    (feeType) =>
      feeType.name.toLowerCase().includes(feeTypeSearchTerm.toLowerCase()) ||
      (feeType.description &&
        feeType.description
          .toLowerCase()
          .includes(feeTypeSearchTerm.toLowerCase()))
  );

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
                Attribution de frais aux étudiants
              </h1>
              <p className="text-gray-600">
                Attribuez des frais spécifiques aux étudiants
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/finances/student-fees")}
                variant="outline"
              >
                ← Retour aux frais étudiants
              </Button>
            </div>
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
          <form
            onSubmit={isBulkMode ? handleBulkSubmit : handleSubmit}
            className="space-y-8"
          >
            {/* Sélection de l'étudiant(s) */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {isBulkMode ? (
                    <Users className="w-5 h-5 text-purple-600 mr-2" />
                  ) : (
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900">
                    1. Sélectionner{" "}
                    {isBulkMode ? "des étudiants" : "un étudiant"}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={!isBulkMode ? "primary" : "outline"}
                    onClick={() => {
                      setIsBulkMode(false);
                      setSelectedStudents(new Set());
                    }}
                    className="text-sm"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Mode unique
                  </Button>
                  <Button
                    type="button"
                    variant={isBulkMode ? "primary" : "outline"}
                    onClick={() => {
                      setIsBulkMode(true);
                      setSelectedStudent(null);
                    }}
                    className="text-sm"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Mode multiple
                  </Button>
                </div>
              </div>

              {/* Mode unique - Affichage de l'étudiant sélectionné */}
              {!isBulkMode && selectedStudent ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedStudent.user.firstName}{" "}
                          {selectedStudent.user.lastName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">
                            <FileText className="w-3 h-3 inline mr-1" />
                            {selectedStudent.matricule}
                          </span>
                          <span className="text-gray-600">
                            <GraduationCap className="w-3 h-3 inline mr-1" />
                            {getStudentClass(
                              selectedStudent.id,
                              selectedStudent.userId
                            )?.name || "Non assigné"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedStudent(null)}
                    >
                      Changer
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* Mode multiple - Affichage du résumé des étudiants sélectionnés */}
              {isBulkMode && selectedStudents.size > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedStudents.size} étudiant(s) sélectionné(s)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Les frais seront attribués à tous les étudiants
                          sélectionnés
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={deselectAllStudents}
                    >
                      Tout désélectionner
                    </Button>
                  </div>
                </div>
              )}

              {/* Liste des étudiants - Compacte et scrollable */}
              {((!isBulkMode && !selectedStudent) || isBulkMode) && (
                <div>
                  {/* Barre de recherche */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un étudiant par nom, prénom, matricule..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Actions en lot (mode multiple uniquement) */}
                  {isBulkMode && (
                    <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedStudents.size} / {filteredStudents.length}{" "}
                        sélectionné(s)
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          onClick={selectAllFilteredStudents}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Tout sélectionner
                        </Button>
                        <Button
                          type="button"
                          onClick={deselectAllStudents}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Square className="w-3 h-3 mr-1" />
                          Tout désélectionner
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Liste compacte et scrollable */}
                  <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-[400px] overflow-y-auto">
                    <div className="space-y-2">
                      {filteredStudents.map((student) => {
                        const isSelected =
                          isBulkMode && selectedStudents.has(student.id);
                        return (
                          <div
                            key={student.id}
                            onClick={() => handleStudentSelect(student)}
                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-blue-500 hover:bg-blue-50 bg-white"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {/* Checkbox en mode multiple */}
                              {isBulkMode && (
                                <div>
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-purple-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              )}

                              {/* Avatar */}
                              <div
                                className={`w-8 h-8 ${
                                  isSelected ? "bg-purple-100" : "bg-blue-100"
                                } rounded-full flex items-center justify-center`}
                              >
                                <GraduationCap
                                  className={`w-4 h-4 ${
                                    isSelected
                                      ? "text-purple-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              </div>

                              {/* Informations */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                  {student.user.firstName}{" "}
                                  {student.user.lastName}
                                </h3>
                                <div className="flex items-center space-x-3 text-xs text-gray-600">
                                  <span className="flex items-center">
                                    <FileText className="w-3 h-3 mr-1" />
                                    {student.matricule}
                                  </span>
                                  <span className="flex items-center">
                                    <GraduationCap className="w-3 h-3 mr-1" />
                                    {getStudentClass(student.id, student.userId)
                                      ?.name || "Non assigné"}
                                  </span>
                                </div>
                              </div>

                              {/* Flèche en mode unique */}
                              {!isBulkMode && (
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {filteredStudents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Aucun étudiant trouvé</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Sélection du type de frais */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  2. Sélectionner un type de frais
                </h2>
              </div>

              {selectedFeeType ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedFeeType.name}
                        </h3>
                        {selectedFeeType.description && (
                          <p className="text-sm text-gray-600">
                            {selectedFeeType.description}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-green-600">
                          {formatAmount(selectedFeeType.amountDefault)} FCFA
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedFeeType(null)}
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
                      placeholder="Rechercher un type de frais par nom ou description..."
                      value={feeTypeSearchTerm}
                      onChange={(e) => setFeeTypeSearchTerm(e.target.value)}
                      className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {filteredFeeTypes.map((feeType) => (
                      <div
                        key={feeType.id}
                        onClick={() => handleFeeTypeSelect(feeType)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {feeType.name}
                            </h3>
                            {feeType.description && (
                              <p className="text-xs text-gray-600">
                                {feeType.description}
                              </p>
                            )}
                            <p className="text-xs font-semibold text-green-600">
                              {formatAmount(feeType.amountDefault)} FCFA
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Sélection de l'année scolaire */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  3. Sélectionner une année scolaire
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {academicYears.map((year) => (
                  <div
                    key={year.id}
                    onClick={() => setSelectedAcademicYear(year)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedAcademicYear?.id === year.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedAcademicYear?.id === year.id
                            ? "bg-purple-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Calendar
                          className={`w-4 h-4 ${
                            selectedAcademicYear?.id === year.id
                              ? "text-purple-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {year.name}
                        </h3>
                        {year.isActive && (
                          <p className="text-xs text-purple-600 font-medium">
                            Année actuelle
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Détails du frais */}
            {selectedStudent && selectedFeeType && selectedAcademicYear && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  4. Détails du frais
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant (FCFA)
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                      {formatAmount(selectedFeeType.amountDefault)} FCFA
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Montant par défaut du type de frais sélectionné
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'échéance
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="w-full bg-gray-700 text-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Bouton de soumission */}
            {selectedStudent && selectedFeeType && selectedAcademicYear && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3"
                >
                  {isSubmitting
                    ? "Attribution en cours..."
                    : "Attribuer le frais"}
                </Button>
              </div>
            )}
          </form>
        )}
      </div>
    </Layout>
  );
};

export default StudentFeeAssignmentPage;
