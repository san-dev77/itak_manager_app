import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  BookOpen,
  GraduationCap,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Notification from "../components/ui/Notification";
import Layout from "../components/layout/Layout";
import {
  apiService,
  type Class,
  type Subject,
  type ClassData,
  type SubjectData,
  type ClassCategory,
} from "../services/api";

type TabType = "classes" | "subjects";

const ClassesSubjectsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("classes");
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classCategories, setClassCategories] = useState<ClassCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Récupérer les informations utilisateur depuis le stockage
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
      }
    }
  }, []);

  // États pour les modales
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // États pour la navigation en étapes du formulaire de classe
  const [classFormStep, setClassFormStep] = useState<
    "category" | "details" | "final"
  >("category");

  // États pour les formulaires
  const [classForm, setClassForm] = useState<ClassData>({
    name: "",
    level: "",
    capacity: 0,
    categorie_id: null,
  });

  const [subjectForm, setSubjectForm] = useState<SubjectData>({
    name: "",
    code: "",
    categorie_id: null,
  });

  // États pour la recherche
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [subjectSearchTerm, setSubjectSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Recharger les données quand l'onglet change
  useEffect(() => {
    if (activeTab === "classes") {
      // Recharger seulement les classes si nécessaire
      if (classes.length === 0) {
        fetchData();
      }
    } else if (activeTab === "subjects") {
      // Recharger seulement les matières si nécessaire
      if (subjects.length === 0) {
        fetchData();
      }
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesResponse, subjectsResponse, categoriesResponse] =
        await Promise.all([
          apiService.getAllClasses(),
          apiService.getAllSubjects(),
          apiService.getAllClassCategories(),
        ]);

      if (classesResponse.success && classesResponse.data) {
        setClasses(classesResponse.data);
      }

      if (subjectsResponse.success && subjectsResponse.data) {
        setSubjects(subjectsResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setClassCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      showNotificationMessage("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotificationMessage = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Gestion des classes
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de la catégorie
    if (!classForm.categorie_id) {
      showNotificationMessage("Veuillez sélectionner une catégorie", "error");
      return;
    }

    try {
      const response = await apiService.createClass(classForm);
      if (response.success && response.data) {
        setClasses([...classes, response.data]);
        setShowClassModal(false);
        resetClassForm();
        showNotificationMessage("Classe créée avec succès", "success");
      } else {
        showNotificationMessage(
          response.message || "Erreur lors de la création",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création de la classe:", error);
      showNotificationMessage(
        "Erreur lors de la création de la classe",
        "error"
      );
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    // Validation de la catégorie
    if (!classForm.categorie_id) {
      showNotificationMessage("Veuillez sélectionner une catégorie", "error");
      return;
    }

    try {
      const response = await apiService.updateClass(editingClass.id, classForm);
      if (response.success && response.data) {
        setClasses(
          classes.map((c) => (c.id === editingClass.id ? response.data : c))
        );
        setShowClassModal(false);
        setEditingClass(null);
        resetClassForm();
        showNotificationMessage("Classe mise à jour avec succès", "success");
      } else {
        showNotificationMessage(
          response.message || "Erreur lors de la mise à jour",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la classe:", error);
      showNotificationMessage(
        "Erreur lors de la mise à jour de la classe",
        "error"
      );
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?"))
      return;

    try {
      const response = await apiService.deleteClass(id);
      if (response.success) {
        setClasses(classes.filter((c) => c.id !== id));
        showNotificationMessage("Classe supprimée avec succès", "success");
      } else {
        showNotificationMessage(
          response.message || "Erreur lors de la suppression",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la classe:", error);
      showNotificationMessage(
        "Erreur lors de la suppression de la classe",
        "error"
      );
    }
  };

  const openEditClassModal = (classItem: Class) => {
    setEditingClass(classItem);
    setClassForm({
      name: classItem.name,
      level: classItem.level,
      capacity: classItem.capacity,
      categorie_id: classItem.categorie_id,
    });
    setShowClassModal(true);
    setClassFormStep("details");
  };

  const resetClassForm = () => {
    setClassForm({
      name: "",
      level: "",
      capacity: 0,
      categorie_id: null,
    });
    setEditingClass(null);
    setClassFormStep("category");
  };

  // Navigation entre les étapes du formulaire
  const nextStep = () => {
    if (
      classFormStep === "category" &&
      classForm.categorie_id !== null &&
      classForm.categorie_id > 0
    ) {
      setClassFormStep("details");
    } else if (
      classFormStep === "details" &&
      classForm.name &&
      classForm.level &&
      classForm.capacity > 0
    ) {
      setClassFormStep("final");
    }
  };

  const prevStep = () => {
    if (classFormStep === "final") {
      setClassFormStep("details");
    } else if (classFormStep === "details") {
      setClassFormStep("category");
    }
  };

  const canProceed = () => {
    if (classFormStep === "category") {
      return classForm.categorie_id !== null && classForm.categorie_id > 0;
    } else if (classFormStep === "details") {
      return !!classForm.name && !!classForm.level && classForm.capacity > 0;
    }
    return true;
  };

  // Fonction wrapper pour la soumission du formulaire
  const handleFormSubmit = () => {
    if (editingClass) {
      handleUpdateClass(new Event("submit") as any);
    } else {
      handleCreateClass(new Event("submit") as any);
    }
  };

  // Gestion des matières
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.createSubject(subjectForm);
      if (response.success && response.data) {
        setSubjects([...subjects, response.data]);
        setShowSubjectModal(false);
        resetSubjectForm();
        showNotificationMessage("Matière créée avec succès", "success");
      } else {
        showNotificationMessage(
          response.message || "Erreur lors de la création",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création de la matière:", error);
      showNotificationMessage(
        "Erreur lors de la création de la matière",
        "error"
      );
    }
  };

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    try {
      const response = await apiService.updateSubject(
        editingSubject.id,
        subjectForm
      );
      if (response.success && response.data) {
        setSubjects(
          subjects.map((s) => (s.id === editingSubject.id ? response.data : s))
        );
        setShowSubjectModal(false);
        setEditingSubject(null);
        resetSubjectForm();
        showNotificationMessage("Matière mise à jour avec succès", "success");
      } else {
        showNotificationMessage(
          response.message || "Erreur lors de la mise à jour",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la matière:", error);
      showNotificationMessage(
        "Erreur lors de la mise à jour de la matière",
        "error"
      );
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?"))
      return;

    try {
      const response = await apiService.deleteSubject(id);
      if (response.success) {
        setSubjects(subjects.filter((s) => s.id !== id));
        showNotificationMessage("Matière supprimée avec succès", "success");
      } else {
        showNotificationMessage(
          response.message || "Erreur lors de la suppression",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la matière:", error);
      showNotificationMessage(
        "Erreur lors de la suppression de la matière",
        "error"
      );
    }
  };

  const openEditSubjectModal = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
      categorie_id: subject.categorie_id || null,
    });
    setShowSubjectModal(true);
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      name: "",
      code: "",
      categorie_id: null,
    });
    setEditingSubject(null);
  };

  // Filtrage des données
  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
      c.level.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
      getClassName(c).toLowerCase().includes(classSearchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(subjectSearchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(subjectSearchTerm.toLowerCase())
  );

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      "6eme": "6ème",
      "5eme": "5ème",
      "4eme": "4ème",
      "3eme": "3ème",
      "2nde": "2nde",
      "1ere": "1ère",
      terminale: "Terminale",
    };
    return levels[level] || level;
  };

  // Fonction pour obtenir la catégorie sélectionnée
  const getSelectedCategory = () => {
    return classCategories.find((c) => c.id === classForm.categorie_id);
  };

  // Fonction utilitaire pour obtenir le nom de la catégorie d'une classe
  const getClassName = (classItem: Class) => {
    return (
      classItem.category?.name ||
      classCategories.find((cat) => cat.id === classItem.categorie_id)?.name ||
      "Non définie"
    );
  };

  // Fonction utilitaire pour obtenir le nom de la catégorie d'une matière
  const getSubjectCategoryName = (subject: Subject) => {
    return (
      subject.category?.name ||
      classCategories.find((cat) => cat.id === subject.categorie_id)?.name ||
      "Non définie"
    );
  };

  // Fonction pour obtenir le texte du bouton selon l'onglet actif
  const getNewButtonText = () => {
    return activeTab === "classes" ? "Nouvelle Classe" : "Nouvelle Matière";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent mb-3">
            Gestion des Classes et Matières
          </h1>
          <p className="text-gray-600 text-lg">
            Gérez les salles de classes et les matières de votre établissement
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Total Classes
                </p>
                <p className="text-3xl font-bold">{classes.length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">
                  Total Matières
                </p>
                <p className="text-3xl font-bold">{subjects.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-indigo-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Catégories</p>
                <p className="text-3xl font-bold">{classCategories.length}</p>
              </div>
              <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                <span className="text-green-700 font-bold text-sm">C</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">
                  Matières Catégorisées
                </p>
                <p className="text-3xl font-bold">
                  {subjects.filter((s) => s.categorie_id !== null).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
                <span className="text-orange-700 font-bold text-sm">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab("classes")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "classes"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Classes ({classes.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("subjects")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "subjects"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Matières ({subjects.length})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "classes" ? (
              /* Classes Tab */
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Rechercher une classe..."
                        value={classSearchTerm}
                        onChange={(e) => setClassSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      resetClassForm();
                      setClassFormStep("category");
                      setShowClassModal(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    {getNewButtonText()}
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : filteredClasses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {classSearchTerm
                      ? "Aucune classe trouvée"
                      : "Aucune classe créée"}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredClasses.map((classItem) => (
                      <motion.div
                        key={`class-${classItem.id}-${activeTab}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {classItem.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                    {getLevelLabel(classItem.level)}
                                  </span>
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                    {classItem.capacity} élèves
                                  </span>
                                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                                    {getClassName(classItem)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                Créée le{" "}
                                {new Date(
                                  classItem.created_at
                                ).toLocaleDateString("fr-FR")}
                              </span>
                            </div>

                            {/* Affichage des matières de la même catégorie */}
                            <div className="mt-4">
                              <p className="text-xs text-gray-500 mb-2">
                                Matières disponibles dans cette catégorie:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {subjects
                                  .filter(
                                    (subject) =>
                                      subject.categorie_id ===
                                      classItem.categorie_id
                                  )
                                  .map((subject) => (
                                    <span
                                      key={subject.id}
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200"
                                    >
                                      <BookOpen className="w-3 h-3 mr-1" />
                                      {subject.name}
                                    </span>
                                  ))}
                                {subjects.filter(
                                  (subject) =>
                                    subject.categorie_id ===
                                    classItem.categorie_id
                                ).length === 0 && (
                                  <span className="text-xs text-gray-400 italic">
                                    Aucune matière disponible
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditClassModal(classItem)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClass(classItem.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Subjects Tab */
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Rechercher une matière..."
                        value={subjectSearchTerm}
                        onChange={(e) => setSubjectSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      resetSubjectForm();
                      setShowSubjectModal(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    {getNewButtonText()}
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : filteredSubjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {subjectSearchTerm
                      ? "Aucune matière trouvée"
                      : "Aucune matière créée"}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredSubjects.map((subject) => (
                      <motion.div
                        key={`subject-${subject.id}-${activeTab}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {subject.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                                    {subject.code}
                                  </p>
                                  {subject.categorie_id && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {getSubjectCategoryName(subject)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Créée le{" "}
                                {new Date(
                                  subject.created_at
                                ).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditSubjectModal(subject)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubject(subject.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Class Modal */}
      <AnimatePresence mode="wait">
        {showClassModal && (
          <div
            key="class-modal"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key="class-modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header avec indicateur d'étapes */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingClass ? "Modifier la classe" : "Nouvelle classe"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowClassModal(false);
                      resetClassForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Indicateur d'étapes */}
                <div className="flex items-center justify-center space-x-4">
                  <div
                    className={`flex items-center ${
                      classFormStep === "category"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        classFormStep === "category"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      1
                    </div>
                    <span className="ml-2 font-medium">Catégorie</span>
                  </div>
                  <div
                    className={`w-16 h-0.5 ${
                      classFormStep === "details" || classFormStep === "final"
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center ${
                      classFormStep === "details"
                        ? "text-blue-600"
                        : classFormStep === "final"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        classFormStep === "details"
                          ? "bg-blue-600 text-white"
                          : classFormStep === "final"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2 font-medium">Détails</span>
                  </div>
                  <div
                    className={`w-16 h-0.5 ${
                      classFormStep === "final" ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center ${
                      classFormStep === "final"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        classFormStep === "final"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      3
                    </div>
                    <span className="ml-2 font-medium">Validation</span>
                  </div>
                </div>
              </div>

              {/* Contenu des étapes */}
              <div className="p-6">
                {/* Étape 1: Sélection de la catégorie */}
                {classFormStep === "category" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Choisissez le type d'établissement
                      </h3>
                      <p className="text-gray-600">
                        Cette information déterminera les niveaux disponibles et
                        l'organisation
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() =>
                            setClassForm({
                              ...classForm,
                              categorie_id: category.id,
                            })
                          }
                          className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                            classForm.categorie_id === category.id
                              ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <GraduationCap className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {category.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {category.description || "Catégorie de classe"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="px-8 py-3"
                      >
                        Continuer
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Étape 2: Détails de la classe */}
                {classFormStep === "details" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Configurez les détails de la classe
                      </h3>
                      <p className="text-gray-600">
                        {classCategories.find(
                          (c) => c.id === classForm.categorie_id
                        )?.name || "Catégorie"}{" "}
                        • Étape 2 sur 3
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nom de la classe"
                        name="name"
                        value={classForm.name}
                        onChange={(e) =>
                          setClassForm({ ...classForm, name: e.target.value })
                        }
                        placeholder="Ex: 6ème A, 2nde S1..."
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Niveau
                        </label>
                        <select
                          value={classForm.level}
                          onChange={(e) =>
                            setClassForm({
                              ...classForm,
                              level: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          required
                        >
                          <option value="">Sélectionner un niveau</option>
                          <option value="6eme">6ème</option>
                          <option value="5eme">5ème</option>
                          <option value="4eme">4ème</option>
                          <option value="3eme">3ème</option>
                          <option value="2nde">2nde</option>
                          <option value="1ere">1ère</option>
                          <option value="terminale">Terminale</option>
                        </select>
                      </div>
                    </div>

                    <div className="max-w-md">
                      <Input
                        label="Capacité maximale"
                        name="capacity"
                        type="number"
                        value={classForm.capacity}
                        onChange={(e) =>
                          setClassForm({
                            ...classForm,
                            capacity: parseInt(e.target.value) || 0,
                          })
                        }
                        min="1"
                        max="50"
                        placeholder="Nombre d'élèves"
                        required
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="px-6 py-3"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Retour
                      </Button>
                      <Button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="px-8 py-3"
                      >
                        Continuer
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3: Validation finale */}
                {classFormStep === "final" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Vérifiez les informations
                      </h3>
                      <p className="text-gray-600">
                        Dernière étape avant la création
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Nom de la classe
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {classForm.name}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Niveau
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {getLevelLabel(classForm.level)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Catégorie
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {getSelectedCategory()?.name || "Non définie"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Capacité
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {classForm.capacity} élèves
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="px-6 py-3"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Retour
                      </Button>
                      <Button
                        onClick={handleFormSubmit}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700"
                      >
                        {editingClass ? "Mettre à jour" : "Créer la classe"}
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subject Modal */}
      <AnimatePresence mode="wait">
        {showSubjectModal && (
          <div
            key="subject-modal"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              key="subject-modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingSubject
                        ? "Modifier la matière"
                        : "Nouvelle matière"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Configurez les détails de la matière et associez-la aux
                      classes
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSubjectModal(false);
                      resetSubjectForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form
                  onSubmit={
                    editingSubject ? handleUpdateSubject : handleCreateSubject
                  }
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nom de la matière"
                      name="name"
                      value={subjectForm.name}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, name: e.target.value })
                      }
                      placeholder="Ex: Mathématiques, Français..."
                      required
                    />
                    <Input
                      label="Code de la matière"
                      name="code"
                      value={subjectForm.code}
                      onChange={(e) =>
                        setSubjectForm({
                          ...subjectForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="Ex: MATH, FRAN"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Catégorie d'établissement
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {classCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            setSubjectForm({
                              ...subjectForm,
                              categorie_id: category.id,
                            })
                          }
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            subjectForm.categorie_id === category.id
                              ? "border-indigo-500 bg-indigo-50 shadow-lg scale-105"
                              : "border-gray-200 hover:border-indigo-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-600 font-bold text-sm">
                                {category.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {category.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {category.description || "Type d'établissement"}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Sélectionnez le type d'établissement où cette matière est
                      dispensée
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowSubjectModal(false);
                        resetSubjectForm();
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={!subjectForm.categorie_id}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingSubject ? "Mettre à jour" : "Créer la matière"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification */}
      {showNotification && (
        <Notification
          title="Notification"
          isVisible={showNotification}
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </Layout>
  );
};

export default ClassesSubjectsPage;
