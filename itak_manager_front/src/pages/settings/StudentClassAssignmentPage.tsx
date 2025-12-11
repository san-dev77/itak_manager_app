import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import {
  apiService,
  type User,
  type StudentWithUser,
  type Class,
  type StudentClass,
} from "../../services/api";
import { Search, GraduationCap } from "lucide-react";

const StudentClassAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<StudentClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    isVisible: boolean;
  } | null>(null);

  // États pour la sélection directe
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, classesRes, assignmentsRes] = await Promise.all([
          apiService.getAllStudents(),
          apiService.getAllClasses(),
          apiService.getAllStudentClasses(),
        ]);

        if (studentsRes.success) setStudents(studentsRes.data || []);
        if (classesRes.success) setClasses(classesRes.data || []);
        if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
      } catch {
        console.error("Erreur chargement");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudents.length === 0 || !selectedClass || !startDate) {
      setNotification({
        type: "error",
        title: "Erreur",
        message:
          "Veuillez sélectionner au moins un élève, une classe et une date de début",
        isVisible: true,
      });
      return;
    }

    // Valider les dates
    if (!validateDates(startDate, endDate)) {
      setNotification({
        type: "error",
        title: "Erreur de dates",
        message: "La date de fin doit être supérieure à la date de début",
        isVisible: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Créer une affectation pour chaque étudiant sélectionné
      const promises = selectedStudents.map((studentId) =>
        apiService.createStudentClass({
          studentId: studentId,
          classId: selectedClass,
          startDate: startDate,
          endDate: endDate || undefined,
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.success).length;

      if (successCount === selectedStudents.length) {
        // Recharger les données
        const assignmentsRes = await apiService.getAllStudentClasses();
        if (assignmentsRes.success) {
          setAssignments(assignmentsRes.data || []);
        }

        setNotification({
          type: "success",
          title: "Succès",
          message: `${successCount} affectation(s) créée(s) avec succès`,
          isVisible: true,
        });

        // Reset form
        clearSelection();
        setStartDate("");
        setEndDate("");
      } else {
        setNotification({
          type: "error",
          title: "Erreur",
          message: `${successCount}/${selectedStudents.length} affectations créées avec succès`,
          isVisible: true,
        });
      }
    } catch {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de la création des affectations",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiService.deleteStudentClass(id);
      if (response.success) {
        // Recharger les données
        const assignmentsRes = await apiService.getAllStudentClasses();
        if (assignmentsRes.success) {
          setAssignments(assignmentsRes.data || []);
        }

        setNotification({
          type: "success",
          title: "Succès",
          message: "Affectation supprimée avec succès",
          isVisible: true,
        });
      } else {
        setNotification({
          type: "error",
          title: "Erreur",
          message: response.error || "Erreur lors de la suppression",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setNotification({
        type: "error",
        title: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression",
        isVisible: true,
      });
    }
  };

  // Fonctions pour la sélection directe
  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
  };

  const clearSelection = () => {
    setSelectedStudents([]);
    setSelectedClass(null);
    setStudentSearchTerm("");
    setClassSearchTerm("");
    setDateError("");
  };

  // Fonction pour valider les dates
  const validateDates = (start: string, end: string) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (startDate >= endDate) {
        setDateError("La date de fin doit être supérieure à la date de début");
        return false;
      } else {
        setDateError("");
        return true;
      }
    } else {
      setDateError("");
      return true;
    }
  };

  // Fonction pour gérer le changement de date de fin
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    validateDates(startDate, newEndDate);
  };

  // Fonction pour gérer le changement de date de début
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    // Revalider si une date de fin est déjà sélectionnée
    if (endDate) {
      validateDates(newStartDate, endDate);
    }
  };

  // Filtrage des données
  const filteredStudents = students.filter((student) => {
    // Vérifier si l'étudiant est déjà affecté à une classe
    const isAssigned = assignments.some(
      (assignment) => assignment.student?.id === student.id
    );

    // Filtrer par terme de recherche
    const matchesSearch = `${student.user?.firstName || ""} ${
      student.user?.lastName || ""
    } ${student.matricule || ""}`
      .toLowerCase()
      .includes(studentSearchTerm.toLowerCase());

    // Retourner seulement les étudiants non affectés qui matchent la recherche
    return !isAssigned && matchesSearch;
  });

  const filteredClasses = classes.filter((cls) =>
    `${cls.name} ${cls.level} ${cls.code || ""}`
      .toLowerCase()
      .includes(classSearchTerm.toLowerCase())
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

  if (isLoading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div className="p-6 max-w-7xl mx-auto max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              size="sm"
            >
              ← Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Affectation Élèves-Classes
              </h1>
              <p className="text-gray-600 mt-1">
                Gérer l'affectation des élèves aux classes
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-500 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {students.length}
              </div>
              <div className="text-sm text-gray-600">Total Élèves</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-500 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {
                  students.filter(
                    (student) =>
                      !assignments.some(
                        (assignment) => assignment.student?.id === student.id
                      )
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Non Affectés</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-500 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {classes.length}
              </div>
              <div className="text-sm text-gray-600">Classes</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-500 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {assignments.length}
              </div>
              <div className="text-sm text-gray-600">Affectations</div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            isVisible={notification.isVisible}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Onglets */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Navigation des onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("create")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Nouvelle affectation
                </div>
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "list"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Affectations existantes
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    {assignments.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === "create" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Créer une nouvelle affectation
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Sélection des étudiants */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sélectionner les étudiants *
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Seuls les étudiants non encore affectés à une classe sont
                      affichés
                    </p>

                    {/* Recherche d'étudiants */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Rechercher un étudiant..."
                          value={studentSearchTerm}
                          onChange={(e) => setStudentSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Liste des étudiants */}
                    <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredStudents.map((student) => {
                        const studentPhoto = student.photo;
                        const studentFirstName =
                          student.user?.firstName || "Prénom";
                        const studentLastName = student.user?.lastName || "Nom";

                        return (
                          <div
                            key={student.id}
                            onClick={() => handleStudentToggle(student.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedStudents.includes(student.id)
                                ? "bg-blue-500 border-2 border-blue-200"
                                : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  selectedStudents.includes(student.id)
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedStudents.includes(student.id) && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                                {studentPhoto ? (
                                  <img
                                    src={studentPhoto}
                                    alt={`${studentFirstName} ${studentLastName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs font-semibold">
                                    {studentFirstName.charAt(0)}
                                    {studentLastName.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {studentFirstName} {studentLastName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Matricule: {student.matricule || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          {studentSearchTerm
                            ? "Aucun étudiant non affecté trouvé pour cette recherche"
                            : "Tous les étudiants sont déjà affectés à une classe"}
                        </div>
                      )}
                    </div>

                    {selectedStudents.length > 0 && (
                      <div className="mt-3 text-sm text-blue-600">
                        {selectedStudents.length} étudiant(s) sélectionné(s)
                      </div>
                    )}
                  </div>

                  {/* Sélection de la classe */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sélectionner la classe *
                    </label>

                    {/* Recherche de classes */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Rechercher une classe..."
                          value={classSearchTerm}
                          onChange={(e) => setClassSearchTerm(e.target.value)}
                          className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Liste des classes */}
                    <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredClasses.map((classItem) => (
                        <div
                          key={classItem.id}
                          onClick={() => handleClassSelect(classItem.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedClass === classItem.id
                              ? "bg-green-300 border-2 border-green-200"
                              : "bg-gray-200 text-white border-2 border-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                selectedClass === classItem.id
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            ></div>
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {classItem.name}
                                {classItem.classCategory?.institution && (
                                  <span className="ml-2 text-xs font-semibold text-blue-600">
                                    ({classItem.classCategory.institution.code})
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Niveau: {classItem.level} • Code:{" "}
                                {classItem.code || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredClasses.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Aucune classe trouvée
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début *
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        max={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin (optionnel)
                      </label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className={
                          dateError ? "border-red-500 focus:border-red-500" : ""
                        }
                      />
                      {dateError && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {dateError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        selectedStudents.length === 0 ||
                        !selectedClass ||
                        !!dateError
                      }
                      className={`flex-1 ${
                        dateError ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting
                        ? "Création..."
                        : dateError
                        ? "Corriger les dates"
                        : `Créer ${selectedStudents.length} affectation(s)`}
                    </Button>

                    <Button
                      type="button"
                      onClick={clearSelection}
                      variant="outline"
                      disabled={selectedStudents.length === 0 && !selectedClass}
                    >
                      Effacer
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "list" && (
              <div>
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune affectation
                    </h3>
                    <p className="text-gray-500">
                      Commencez par créer votre première affectation
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Photo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Étudiant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Matricule
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Institution
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date début
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date fin
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
                        {assignments.map((assignment) => {
                          const isActive =
                            !assignment.endDate ||
                            new Date(assignment.endDate) > new Date();
                          const startDate = new Date(assignment.startDate);
                          const endDate = assignment.endDate
                            ? new Date(assignment.endDate)
                            : null;

                          const studentPhoto = assignment.student?.photo;
                          const studentFirstName =
                            assignment.student?.user?.firstName || "Prénom";
                          const studentLastName =
                            assignment.student?.user?.lastName || "Nom";

                          return (
                            <tr
                              key={assignment.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                  {studentPhoto ? (
                                    <img
                                      src={studentPhoto}
                                      alt={`${studentFirstName} ${studentLastName}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs font-semibold">
                                      {studentFirstName.charAt(0)}
                                      {studentLastName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {studentFirstName} {studentLastName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {assignment.student?.matricule || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {assignment.class?.name || "Classe inconnue"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {assignment.class?.level || "N/A"} •{" "}
                                  {assignment.class?.code || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-blue-600">
                                  {assignment.class?.classCategory?.institution
                                    ?.code || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {startDate.toLocaleDateString("fr-FR")}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {endDate
                                    ? endDate.toLocaleDateString("fr-FR")
                                    : "En cours"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full mr-1.5 ${
                                      isActive ? "bg-green-400" : "bg-gray-400"
                                    }`}
                                  ></div>
                                  {isActive ? "Actif" : "Terminé"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Button
                                  onClick={() => handleDelete(assignment.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentClassAssignmentPage;
