import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import { apiService } from "../../services/api";

const SubjectClassAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [coefficient, setCoefficient] = useState<string>("1");
  const [weeklyHours, setWeeklyHours] = useState<string>("");
  const [isOptional, setIsOptional] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
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

        if (subjectsRes.success) setSubjects(subjectsRes.data || []);
        if (classesRes.success) setClasses(classesRes.data || []);
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
        subject_id: selectedSubject,
        class_id: selectedClass,
        coefficient: parseInt(coefficient),
        weekly_hours: weeklyHours ? parseInt(weeklyHours) : undefined,
        is_optional: isOptional,
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
        setSelectedSubject(0);
        setSelectedClass(0);
        setCoefficient("1");
        setWeeklyHours("");
        setIsOptional(false);
      }
    } catch (error) {
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

  const handleDelete = async (id: number) => {
    try {
      const response = await apiService.deleteClassSubject(id);
      if (response.success) {
        // Recharger les données
        const assignmentsRes = await apiService.getAllClassSubjects();
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
    } catch (error) {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de la suppression",
        isVisible: true,
      });
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {subjects.length}
              </div>
              <div className="text-sm text-gray-600">Matières</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {classes.length}
              </div>
              <div className="text-sm text-gray-600">Classes</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Nouvelle affectation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière *
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(Number(e.target.value))}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Sélectionner une matière</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} - {subject.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(Number(e.target.value))}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Sélectionner une classe</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.level}
                    </option>
                  ))}
                </select>
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
                <label htmlFor="isOptional" className="text-sm text-gray-700">
                  Matière optionnelle
                </label>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer l'affectation"}
              </Button>
            </form>
          </div>

          {/* Liste */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Affectations existantes ({assignments.length})
            </h2>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {assignment.subject?.name || "Matière inconnue"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Classe : {assignment.class?.name || "Classe inconnue"} (
                      {assignment.class?.level || "Niveau"})
                    </p>
                    <p className="text-xs text-gray-500">
                      Coefficient : {assignment.coefficient}
                      {assignment.weekly_hours &&
                        ` • ${assignment.weekly_hours}h/semaine`}
                      {assignment.is_optional && " • Optionnel"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(assignment.id)}
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
        </div>
      </div>
    </Layout>
  );
};

export default SubjectClassAssignmentPage;
