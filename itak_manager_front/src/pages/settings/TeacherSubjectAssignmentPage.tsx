import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import { apiService } from "../../services/api";

const TeacherSubjectAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [teachers, setTeachers] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [classSubjects, setClassSubjects] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [assignments, setAssignments] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedTeacher, setSelectedTeacher] = useState<number>(0);
  const [selectedClassSubject, setSelectedClassSubject] = useState<number>(0);
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
  const [notification, setNotification] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // États pour les onglets et la recherche
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [classSubjectSearchTerm, setClassSubjectSearchTerm] = useState("");

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeacher || !selectedClassSubject || !startDate) {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Veuillez remplir tous les champs obligatoires",
        isVisible: true,
      });
      return;
    }

    // Vérifier si l'enseignant est déjà affecté à cette matière-classe
    const existingAssignment = assignments.find(
      (a) =>
        a.teacher_id === selectedTeacher &&
        a.class_subject_id === selectedClassSubject
    );

    if (existingAssignment) {
      setNotification({
        type: "error",
        title: "Erreur",
        message:
          "Cet enseignant est déjà affecté à cette matière dans cette classe",
        isVisible: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createTeachingAssignment({
        teacherId: selectedTeacher.toString(),
        classSubjectId: selectedClassSubject.toString(),
        startDate: startDate,
        endDate: endDate || undefined,
      });

      if (response.success) {
        // Recharger les données
        const assignmentsRes = await apiService.getAllTeachingAssignments();
        if (assignmentsRes.success) {
          setAssignments(assignmentsRes.data || []);
        }

        setNotification({
          type: "success",
          title: "Succès",
          message: "Enseignant affecté avec succès",
          isVisible: true,
        });

        // Reset form
        setSelectedTeacher(0);
        setSelectedClassSubject(0);
        setStartDate("");
        setEndDate("");
      }
    } catch {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de l'affectation",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      }
    } catch {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de la suppression",
        isVisible: true,
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
                  Créer une nouvelle affectation enseignant-matière-classe
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
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
                      Sélectionner la matière-classe *
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
                      {filteredClassSubjects.map((classSubject) => (
                        <div
                          key={classSubject.id}
                          onClick={() =>
                            setSelectedClassSubject(classSubject.id)
                          }
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedClassSubject === classSubject.id
                              ? "bg-green-300 border-2 border-green-200"
                              : "bg-gray-200 border-2 border-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                selectedClassSubject === classSubject.id
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedClassSubject === classSubject.id && (
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
                                Classe: {classSubject.class?.name || "Classe"} (
                                {classSubject.class?.level || "Niveau"})
                              </p>
                              <p className="text-xs text-gray-500">
                                Coef: {classSubject.coefficient} •{" "}
                                {classSubject.weeklyHours || 0}h/semaine
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
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

                  <Button
                    type="submit"
                    disabled={isSubmitting || classSubjects.length === 0}
                  >
                    {isSubmitting ? "Affectation..." : "Affecter l'enseignant"}
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "list" && (
              <div>
                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {assignment.teacher?.user?.firstName ||
                            "Prénom inconnu"}{" "}
                          {assignment.teacher?.user?.lastName || "Nom inconnu"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.classSubject?.subject?.name ||
                            "Matière inconnue"}{" "}
                          -{" "}
                          {assignment.classSubject?.class?.name ||
                            "Classe inconnue"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Du{" "}
                          {new Date(assignment.startDate).toLocaleDateString()}
                          {assignment.endDate &&
                            ` au ${new Date(
                              assignment.endDate
                            ).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          handleDeleteClick(assignment.id, assignment)
                        }
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                  {assignments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune affectation trouvée
                    </div>
                  )}
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
    </Layout>
  );
};

export default TeacherSubjectAssignmentPage;
