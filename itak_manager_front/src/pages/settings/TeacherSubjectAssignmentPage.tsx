import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import ErrorModal from "../../components/ui/ErrorModal";
import { apiService } from "../../services/api";

const TeacherSubjectAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [teachers, setTeachers] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [classSubjects, setClassSubjects] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [assignments, setAssignments] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedTeacher, setSelectedTeacher] = useState<number>(0);
  const [selectedClassSubjects, setSelectedClassSubjects] = useState<number[]>(
    []
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    assignmentId: number | null;
    assignmentInfo: string;
  }>({
    show: false,
    assignmentId: null,
    assignmentInfo: "",
  });
  const [bulkConfirm, setBulkConfirm] = useState<{
    show: boolean;
    teacherId: number | null;
    classSubjectIds: number[];
    isPrincipal: boolean;
  }>({
    show: false,
    teacherId: null,
    classSubjectIds: [],
    isPrincipal: false,
  });
  const [expandedTeachers, setExpandedTeachers] = useState<Set<string>>(
    new Set()
  );
  const [notification, setNotification] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
    details?: string;
    statusCode?: number;
  }>({
    isOpen: false,
    message: "",
  });

  // États pour les onglets et la recherche
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [classSubjectSearchTerm, setClassSubjectSearchTerm] = useState("");

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
        const [teachersRes, classSubjectsRes, assignmentsRes] =
          await Promise.all([
            apiService.getAllTeachers(),
            apiService.getAllClassSubjects(),
            apiService.getAllTeachingAssignments(),
          ]);

        if (teachersRes.success) setTeachers(teachersRes.data || []);
        if (classSubjectsRes.success)
          setClassSubjects(classSubjectsRes.data || []);
        if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClick = (id: number, assignment: any) => {
    const teacherName = `${assignment.teacher?.user?.firstName || "Prénom"} ${
      assignment.teacher?.user?.lastName || "Nom"
    }`;
    const subjectClass = `${
      assignment.classSubject?.subject?.name || "Matière"
    } - ${assignment.classSubject?.class?.name || "Classe"}`;
    const assignmentInfo = `${teacherName} → ${subjectClass}`;

    setDeleteConfirm({
      show: true,
      assignmentId: id,
      assignmentInfo: assignmentInfo,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.assignmentId) return;

    try {
      const response = await apiService.deleteTeachingAssignment(
        deleteConfirm.assignmentId
      );
      if (response.success) {
        // Fermer la modale de confirmation
        setDeleteConfirm({
          show: false,
          assignmentId: null,
          assignmentInfo: "",
        });

        // Recharger les données
        const assignmentsRes = await apiService.getAllTeachingAssignments();
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
        // Détecter spécifiquement les erreurs 409 (Conflict) et afficher la modale
        if (response.statusCode === 409) {
          setErrorModal({
            isOpen: true,
            message: response.error || "Conflit détecté lors de la suppression",
            details: response.error,
            statusCode: 409,
          });
        } else {
          // Autres erreurs - afficher aussi dans la modale
          setErrorModal({
            isOpen: true,
            message: response.error || "Erreur lors de la suppression",
            details: response.error,
            statusCode: response.statusCode,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setErrorModal({
        isOpen: true,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression",
        details: error instanceof Error ? error.stack : undefined,
        statusCode: undefined,
      });
    } finally {
      setDeleteConfirm({
        show: false,
        assignmentId: null,
        assignmentInfo: "",
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      show: false,
      assignmentId: null,
      assignmentInfo: "",
    });
  };

  // Fonctions pour la sélection multiple
  const handleClassSubjectToggle = (classSubjectId: number) => {
    setSelectedClassSubjects((prev) => {
      if (prev.includes(classSubjectId)) {
        return prev.filter((id) => id !== classSubjectId);
      } else {
        return [...prev, classSubjectId];
      }
    });
  };

  const handleBulkAssignment = () => {
    if (!selectedTeacher || selectedClassSubjects.length === 0) {
      setNotification({
        type: "error",
        title: "Erreur",
        message:
          "Veuillez sélectionner un enseignant et au moins une matière-classe",
        isVisible: true,
      });
      return;
    }

    setBulkConfirm({
      show: true,
      teacherId: selectedTeacher,
      classSubjectIds: selectedClassSubjects,
      isPrincipal: false,
    });
  };

  const handleBulkConfirm = async () => {
    if (!bulkConfirm.teacherId || bulkConfirm.classSubjectIds.length === 0)
      return;

    setIsSubmitting(true);
    try {
      const promises = bulkConfirm.classSubjectIds.map((classSubjectId) => {
        const assignmentData = {
          teacherId: bulkConfirm.teacherId!.toString(),
          classSubjectId: classSubjectId.toString(),
          startDate,
          endDate: endDate || undefined,
        };
        return apiService.createTeachingAssignment(assignmentData);
      });

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.success).length;

      // Vérifier s'il y a des erreurs 409 (Conflict) - affectation déjà existante
      const conflictErrors = results.filter(
        (r) => !r.success && r.statusCode === 409
      );

      // Si certaines affectations ont réussi et d'autres ont échoué
      if (
        successCount > 0 &&
        successCount < bulkConfirm.classSubjectIds.length
      ) {
        const conflictCount = conflictErrors.length;
        const otherErrors = results.filter(
          (r) => !r.success && r.statusCode !== 409
        );

        let message = `${successCount} affectation(s) créée(s) avec succès. `;
        if (conflictCount > 0) {
          message += `${conflictCount} affectation(s) déjà existante(s) (ignorée(s)). `;
        }
        if (otherErrors.length > 0) {
          message += `${otherErrors.length} erreur(s) détectée(s).`;
        }

        setNotification({
          type: "warning",
          title: "Affectation partielle",
          message: message,
          isVisible: true,
        });

        // Recharger les données
        const assignmentsRes = await apiService.getAllTeachingAssignments();
        if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);

        // Réinitialiser le formulaire seulement si toutes les affectations ont réussi
        if (successCount === bulkConfirm.classSubjectIds.length) {
          setSelectedTeacher(0);
          setSelectedClassSubjects([]);
          setStartDate("");
          setEndDate("");
        }
      } else if (conflictErrors.length > 0 && successCount === 0) {
        // Toutes les affectations ont échoué avec des erreurs 409
        const errorMessages = conflictErrors
          .map((r) => r.error || "Affectation déjà existante")
          .join("; ");
        setErrorModal({
          isOpen: true,
          message: "Toutes les affectations sélectionnées existent déjà",
          details: errorMessages,
          statusCode: 409,
        });
      } else if (successCount === bulkConfirm.classSubjectIds.length) {
        setNotification({
          type: "success",
          title: "Succès",
          message: `${successCount} affectation(s) créée(s) avec succès (${bulkConfirm.classSubjectIds.length} requête(s) envoyée(s))`,
          isVisible: true,
        });

        // Réinitialiser le formulaire
        setSelectedTeacher(0);
        setSelectedClassSubjects([]);
        setStartDate("");
        setEndDate("");

        // Recharger les données
        const assignmentsRes = await apiService.getAllTeachingAssignments();
        if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
      } else {
        // Erreurs autres que 409
        const failedResults = results.filter((r) => !r.success);
        const errorMessages = failedResults
          .map((r) => r.error)
          .filter((msg) => msg)
          .join("; ");

        setErrorModal({
          isOpen: true,
          message:
            errorMessages ||
            `${successCount}/${bulkConfirm.classSubjectIds.length} affectation(s) créée(s)`,
          details: errorMessages,
          statusCode: failedResults[0]?.statusCode,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création en lot:", error);
      setErrorModal({
        isOpen: true,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la création des affectations",
        details: error instanceof Error ? error.stack : undefined,
        statusCode: undefined,
      });
    } finally {
      setIsSubmitting(false);
      setBulkConfirm({
        show: false,
        teacherId: null,
        classSubjectIds: [],
        isPrincipal: false,
      });
    }
  };

  const handleBulkCancel = () => {
    setBulkConfirm({
      show: false,
      teacherId: null,
      classSubjectIds: [],
      isPrincipal: false,
    });
  };

  // Fonction pour gérer l'expansion des professeurs
  const toggleTeacherExpansion = (teacherId: string) => {
    setExpandedTeachers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teacherId)) {
        newSet.delete(teacherId);
      } else {
        newSet.add(teacherId);
      }
      return newSet;
    });
  };

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

  // Filtrage des données
  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.user?.firstName || ""} ${teacher.user?.lastName || ""}`
      .toLowerCase()
      .includes(teacherSearchTerm.toLowerCase())
  );

  const filteredClassSubjects = classSubjects.filter((classSubject) =>
    `${classSubject.subject?.name || ""} - ${classSubject.class?.name || ""}`
      .toLowerCase()
      .includes(classSubjectSearchTerm.toLowerCase())
  );

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
      <div className="p-6 max-w-7xl mx-auto">
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
                Affectation Enseignants
              </h1>
              <p className="text-gray-600 mt-1">
                Affecter un enseignant à une matière déjà présente dans une
                classe
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">ℹ</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Comment ça marche ?
                </h3>
                <p className="text-blue-800 text-sm">
                  D'abord, assurez-vous qu'une matière est affectée à une classe
                  via la page "Affectation Matières-Classes". Ensuite, utilisez
                  cette page pour affecter un enseignant à cette matière-classe.
                </p>
                <Button
                  onClick={() => navigate("/settings/subject-class-assignment")}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Gérer les matières-classes
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-500 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {teachers.length}
              </div>
              <div className="text-sm text-gray-600">Enseignants</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-500 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {classSubjects.length}
              </div>
              <div className="text-sm text-gray-600">Matières en classe</div>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
                  Créer une nouvelle affectation enseignant-matière-classe
                </h2>

                <div className="space-y-4">
                  {/* Sélection de l'enseignant */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sélectionner l'enseignant *
                    </label>

                    {/* Recherche d'enseignants */}
                    <div className="mb-4">
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <input
                          type="text"
                          placeholder="Rechercher un enseignant..."
                          value={teacherSearchTerm}
                          onChange={(e) => setTeacherSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Liste des enseignants */}
                    <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredTeachers.map((teacher) => (
                        <div
                          key={teacher.id}
                          onClick={() => setSelectedTeacher(teacher.id)}
                          className={`p-3 rounded-lg cursor-pointer ${
                            selectedTeacher === teacher.id
                              ? "bg-blue-300 border-2 border-blue-200"
                              : "bg-gray-200 border-2 border-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                selectedTeacher === teacher.id
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedTeacher === teacher.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {teacher.user?.firstName || "Prénom"}{" "}
                                {teacher.user?.lastName || "Nom"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Spécialité: {teacher.speciality || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredTeachers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Aucun enseignant trouvé
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sélection de la matière-classe */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sélectionner les matières-classes (multiple) *
                    </label>

                    {/* Recherche de matières-classes */}
                    <div className="mb-4">
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <input
                          type="text"
                          placeholder="Rechercher une matière-classe..."
                          value={classSubjectSearchTerm}
                          onChange={(e) =>
                            setClassSubjectSearchTerm(e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Liste des matières-classes */}
                    <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredClassSubjects.map((classSubject) => {
                        const isSelected = selectedClassSubjects.includes(
                          classSubject.id
                        );

                        return (
                          <div
                            key={classSubject.id}
                            onClick={() =>
                              handleClassSubjectToggle(classSubject.id)
                            }
                            className={`p-3 rounded-lg cursor-pointer ${
                              isSelected
                                ? "bg-green-300 border-2 border-green-200"
                                : "bg-gray-200 border-2 border-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  isSelected
                                    ? "bg-green-500 border-green-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {classSubject.subject?.name || "Matière"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Classe: {classSubject.class?.name || "Classe"}
                                  {classSubject.class?.classCategory
                                    ?.institution && (
                                    <span className="ml-1 text-xs font-semibold text-blue-600">
                                      (
                                      {
                                        classSubject.class.classCategory
                                          .institution.code
                                      }
                                      )
                                    </span>
                                  )}{" "}
                                  ({classSubject.class?.level || "Niveau"})
                                </p>
                                <p className="text-xs text-gray-500">
                                  Coef: {classSubject.coefficient} •{" "}
                                  {classSubject.weeklyHours || 0}h/semaine
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Indicateur de sélection multiple */}
                      {selectedClassSubjects.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-900">
                              {selectedClassSubjects.length} matière(s)
                              sélectionnée(s)
                            </span>
                          </div>
                        </div>
                      )}

                      {filteredClassSubjects.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          {classSubjects.length === 0 ? (
                            <div>
                              <p>Aucune matière-classe disponible</p>
                              <Button
                                onClick={() =>
                                  navigate("/settings/subject-class-assignment")
                                }
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                Créer des affectations
                              </Button>
                            </div>
                          ) : (
                            "Aucune matière-classe trouvée"
                          )}
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
                        onChange={(e) => setStartDate(e.target.value)}
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
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleBulkAssignment}
                      disabled={
                        isSubmitting || selectedClassSubjects.length === 0
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting
                        ? "Affectation..."
                        : `Affecter ${selectedClassSubjects.length} matière(s)`}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "list" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Affectations par enseignant
                </h2>

                <div className="space-y-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {(() => {
                    // Grouper les affectations par enseignant
                    const groupedAssignments = assignments.reduce(
                      (acc, assignment) => {
                        const teacherId = assignment.teacher?.id;
                        if (!teacherId) return acc;

                        if (!acc[teacherId]) {
                          acc[teacherId] = {
                            teacher: assignment.teacher,
                            assignments: [],
                          };
                        }
                        acc[teacherId].assignments.push(assignment);
                        return acc;
                      },
                      {} as Record<string, { teacher: any; assignments: any[] }> // eslint-disable-line @typescript-eslint/no-explicit-any
                    );

                    const groupedArray = Object.values(groupedAssignments);

                    if (groupedArray.length === 0) {
                      return (
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
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucune affectation
                          </h3>
                          <p className="text-gray-500">
                            Commencez par créer des affectations d'enseignants
                          </p>
                        </div>
                      );
                    }

                    return groupedArray.map(
                      (
                        group: any // eslint-disable-line @typescript-eslint/no-explicit-any
                      ) => {
                        const teacherId = group.teacher.id.toString();
                        const isExpanded = expandedTeachers.has(teacherId);

                        return (
                          <div
                            key={group.teacher.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                          >
                            {/* En-tête du professeur - cliquable pour expansion */}
                            <div
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100"
                              onClick={() => toggleTeacherExpansion(teacherId)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-6 h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {group.teacher.user?.firstName ||
                                        "Prénom inconnu"}{" "}
                                      {group.teacher.user?.lastName ||
                                        "Nom inconnu"}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {group.assignments.length} matière
                                      {group.assignments.length > 1
                                        ? "s"
                                        : ""}{" "}
                                      assignée
                                      {group.assignments.length > 1 ? "s" : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-blue-600">
                                      {group.assignments.length} affectation
                                      {group.assignments.length > 1 ? "s" : ""}
                                    </div>
                                  </div>
                                  {/* Icône d'expansion */}
                                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <svg
                                      className={`w-5 h-5 text-gray-600 ${
                                        isExpanded ? "rotate-180" : ""
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Liste des matières - affichée seulement si étendu */}
                            <div
                              className={`p-6 border-t border-gray-100 ${
                                isExpanded ? "" : "hidden"
                              }`}
                            >
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Matière
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
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {group.assignments.map(
                                      (
                                        assignment: any // eslint-disable-line @typescript-eslint/no-explicit-any
                                      ) => (
                                        <tr
                                          key={`assignment-${assignment.id}`}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                              {assignment.classSubject?.subject
                                                ?.name || "Matière inconnue"}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                              {assignment.classSubject?.class
                                                ?.name || "Classe inconnue"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {assignment.classSubject?.class
                                                ?.level || "N/A"}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-blue-600">
                                              {assignment.classSubject?.class
                                                ?.classCategory?.institution
                                                ?.code || "N/A"}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                              {assignment.startDate
                                                ? new Date(
                                                    assignment.startDate
                                                  ).toLocaleDateString("fr-FR")
                                                : "N/A"}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                              {assignment.endDate
                                                ? new Date(
                                                    assignment.endDate
                                                  ).toLocaleDateString("fr-FR")
                                                : "En cours"}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Button
                                              onClick={() =>
                                                handleDeleteClick(
                                                  assignment.id,
                                                  assignment
                                                )
                                              }
                                              variant="outline"
                                              size="sm"
                                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                            >
                                              Supprimer
                                            </Button>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Êtes-vous sûr de vouloir supprimer cette affectation ?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-900">
                  {deleteConfirm.assignmentInfo}
                </p>
              </div>
              <p className="text-xs text-red-600 mb-6">
                Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button onClick={handleDeleteCancel} variant="outline" size="sm">
                Annuler
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="outline"
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700 border-red-600"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour affectation multiple */}
      {bulkConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirmer l'affectation multiple
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {bulkConfirm.isPrincipal
                    ? "Affecter l'enseignant aux matières sélectionnées (marqué comme professeur principal) ?"
                    : "Affecter l'enseignant aux matières sélectionnées ?"}
                </p>

                {/* Détails de l'enseignant */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-blue-900">
                    Enseignant:{" "}
                    {
                      teachers.find((t) => t.id === bulkConfirm.teacherId)?.user
                        ?.firstName
                    }{" "}
                    {
                      teachers.find((t) => t.id === bulkConfirm.teacherId)?.user
                        ?.lastName
                    }
                  </p>
                  {bulkConfirm.isPrincipal && (
                    <p className="text-xs text-blue-700 mt-1">
                      ⭐ Professeur principal (affichage frontend uniquement)
                    </p>
                  )}
                </div>

                {/* Liste des matières */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Matières sélectionnées ({bulkConfirm.classSubjectIds.length}
                    ):
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {bulkConfirm.classSubjectIds.map((id) => {
                      const classSubject = classSubjects.find(
                        (cs) => cs.id === id
                      );
                      return (
                        <p key={id} className="text-xs text-gray-600">
                          • {classSubject?.subject?.name} -{" "}
                          {classSubject?.class?.name}
                        </p>
                      );
                    })}
                  </div>
                </div>

                <p className="text-xs text-orange-600 mb-6">
                  {bulkConfirm.classSubjectIds.length} affectation(s) seront
                  créée(s).
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button onClick={handleBulkCancel} variant="outline" size="sm">
                  Annuler
                </Button>
                <Button
                  onClick={handleBulkConfirm}
                  variant="outline"
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Création..." : "Confirmer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'erreur */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        title="Erreur"
        message={errorModal.message}
        details={errorModal.details}
        statusCode={errorModal.statusCode}
      />
    </Layout>
  );
};

export default TeacherSubjectAssignmentPage;
