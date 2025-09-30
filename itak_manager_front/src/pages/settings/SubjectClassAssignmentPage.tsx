import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import {
  apiService,
  type User,
  type Subject,
  type Class,
  type ClassSubject,
} from "../../services/api";

const SubjectClassAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<ClassSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [coefficient, setCoefficient] = useState<string>("1");
  const [weeklyHours, setWeeklyHours] = useState<string>("");
  const [isOptional, setIsOptional] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    isVisible: boolean;
  } | null>(null);

  // États pour les onglets et la recherche
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");
  const [subjectSearchTerm, setSubjectSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");

  // États pour la modal de détails de classe
  const [selectedClassDetails, setSelectedClassDetails] = useState<{
    show: boolean;
    class: Class | null;
    students: any[];
    teachers: any[];
    subjects: any[];
  }>({
    show: false,
    class: null,
    students: [],
    teachers: [],
    subjects: [],
  });
  const [classDetailsTab, setClassDetailsTab] = useState<
    "students" | "teachers" | "subjects"
  >("students");

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Erreur parsing user data:", error);
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
        const [subjectsRes, classesRes, assignmentsRes] = await Promise.all([
          apiService.getAllSubjects(),
          apiService.getAllClasses(),
          apiService.getAllClassSubjects(),
        ]);

        if (subjectsRes.success) {
          console.log("📚 Sujets chargés:", subjectsRes.data);
          console.log("📚 Nombre de sujets:", subjectsRes.data?.length);
          setSubjects(subjectsRes.data || []);
        } else {
          console.error("❌ Erreur chargement sujets:", subjectsRes.error);
        }
        if (classesRes.success) {
          console.log("🏫 Classes chargées:", classesRes.data);
          console.log("🏫 Nombre de classes:", classesRes.data?.length);
          setClasses(classesRes.data || []);
        } else {
          console.error("❌ Erreur chargement classes:", classesRes.error);
        }
        if (assignmentsRes.success) {
          console.log("🔗 Affectations chargées:", assignmentsRes.data);
          setAssignments(assignmentsRes.data || []);
        } else {
          console.error(
            "❌ Erreur chargement affectations:",
            assignmentsRes.error
          );
        }
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

    if (!selectedSubject || !selectedClass || !coefficient) {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Veuillez remplir tous les champs obligatoires",
        isVisible: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createClassSubject({
        classId: selectedClass,
        subjectId: selectedSubject,
        coefficient: parseInt(coefficient),
        weeklyHours: weeklyHours ? parseInt(weeklyHours) : 0,
        isOptional: isOptional,
      });

      if (response.success) {
        // Recharger les données
        const assignmentsRes = await apiService.getAllClassSubjects();
        if (assignmentsRes.success) {
          setAssignments(assignmentsRes.data || []);
        }

        setNotification({
          type: "success",
          title: "Succès",
          message: "Affectation créée avec succès",
          isVisible: true,
        });

        // Reset form
        setSelectedSubject("");
        setSelectedClass("");
        setCoefficient("1");
        setWeeklyHours("");
        setIsOptional(false);
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de la création",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     const response = await apiService.deleteClassSubject(id);
  //     if (response.success) {
  //       // Recharger les données
  //       const assignmentsRes = await apiService.getAllClassSubjects();
  //       if (assignmentsRes.success) {
  //         setAssignments(assignmentsRes.data || []);
  //       }

  //       setNotification({
  //         type: "success",
  //         title: "Succès",
  //         message: "Affectation supprimée avec succès",
  //         isVisible: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de la suppression:", error);
  //     setNotification({
  //       type: "error",
  //       title: "Erreur",
  //       message: "Erreur lors de la suppression",
  //       isVisible: true,
  //     });
  //   }
  // };

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
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(subjectSearchTerm.toLowerCase())
  );

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(classSearchTerm.toLowerCase())
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
                Affectation Matières-Classes
              </h1>
              <p className="text-gray-600 mt-1">
                Gérer l'affectation des matières aux classes
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-500 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {subjects.length}
              </div>
              <div className="text-sm text-gray-600">Matières</div>
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

        {/* Message d'information sur les données */}
        {(subjects.length === 0 || classes.length === 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">⚠</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Données manquantes
                </h3>
                <p className="text-yellow-800 text-sm">
                  {subjects.length === 0 && classes.length === 0
                    ? "Aucune matière et aucune classe disponibles. Veuillez d'abord créer des matières et des classes."
                    : subjects.length === 0
                    ? "Aucune matière disponible. Veuillez d'abord créer des matières."
                    : "Aucune classe disponible. Veuillez d'abord créer des classes."}
                </p>
                <div className="flex gap-2 mt-3">
                  {subjects.length === 0 && (
                    <Button
                      onClick={() => navigate("/classes-subjects")}
                      variant="outline"
                      size="sm"
                    >
                      Créer des matières
                    </Button>
                  )}
                  {classes.length === 0 && (
                    <Button
                      onClick={() => navigate("/classes-subjects")}
                      variant="outline"
                      size="sm"
                    >
                      Créer des classes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="bg-white rounded-lg border border-gray-500">
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
                  Créer une nouvelle affectation matière-classe
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Sélection de la matière */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sélectionner la matière *
                    </label>

                    {/* Recherche de matières */}
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
                          placeholder="Rechercher une matière..."
                          value={subjectSearchTerm}
                          onChange={(e) => setSubjectSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Liste des matières */}
                    <div className="h-48 overflow-y-auto border border-gray-500 rounded-lg p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredSubjects.map((subject) => (
                        <div
                          key={subject.id}
                          onClick={() => setSelectedSubject(subject.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedSubject === subject.id
                              ? "bg-purple-300 border-2 border-purple-200"
                              : "bg-gray-200 border-2 border-transparent hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                selectedSubject === subject.id
                                  ? "bg-purple-500 border-purple-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedSubject === subject.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
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
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {subject.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Code: {subject.code || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredSubjects.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Aucune matière trouvée
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sélection de la classe */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sélectionner la classe *
                    </label>

                    {/* Recherche de classes */}
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
                          placeholder="Rechercher une classe..."
                          value={classSearchTerm}
                          onChange={(e) => setClassSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Liste des classes */}
                    <div className="h-48 overflow-y-auto border border-gray-500 rounded-lg p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {filteredClasses.map((classItem) => (
                        <div
                          key={classItem.id}
                          onClick={() => setSelectedClass(classItem.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedClass === classItem.id
                              ? "bg-green-300 border-2 border-green-200"
                              : "bg-gray-200 border-2 border-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                selectedClass === classItem.id
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedClass === classItem.id && (
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
                                {classItem.name}
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
                        Coefficient *
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={coefficient}
                        onChange={(e) => setCoefficient(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heures hebdomadaires
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="40"
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(e.target.value)}
                        placeholder="Optionnel"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOptional"
                      checked={isOptional}
                      onChange={(e) => setIsOptional(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isOptional"
                      className="text-sm text-gray-700"
                    >
                      Matière optionnelle
                    </label>
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Création..." : "Créer l'affectation"}
                  </Button>
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
                      matière-classe
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-500">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="group relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Header avec informations */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-green-600 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-white"
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
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {assignment.subject?.name ||
                                    "Matière inconnue"}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <div className="w-2 h-2 rounded-full mr-1.5 bg-blue-400"></div>
                                    Affectée
                                  </span>
                                  {assignment.isOptional && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      Optionnel
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Informations de classe */}
                            <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
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
                                  <p className="font-medium text-gray-900">
                                    {assignment.class?.name ||
                                      "Classe inconnue"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Niveau: {assignment.class?.level || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Détails */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="font-medium">
                                  Coefficient:
                                </span>
                                <span>{assignment.coefficient}</span>
                              </div>
                              {assignment.weeklyHours && (
                                <div className="flex items-center gap-1.5 text-gray-600">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="font-medium">Heures:</span>
                                  <span>{assignment.weeklyHours}h/semaine</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bouton de suppression */}
                          <div className="ml-4 flex-shrink-0">
                            <Button
                              onClick={() => {
                                // handleDelete(assignment.id);
                                console.log(
                                  "Suppression de l'affectation:",
                                  assignment.id
                                );
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default SubjectClassAssignmentPage;
