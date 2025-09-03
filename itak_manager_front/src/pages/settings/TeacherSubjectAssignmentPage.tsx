import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import { apiService } from "../../services/api";

const TeacherSubjectAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classSubjects, setClassSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number>(0);
  const [selectedClassSubject, setSelectedClassSubject] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
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
        teacher_id: selectedTeacher,
        class_subject_id: selectedClassSubject,
        start_date: startDate,
        end_date: endDate || undefined,
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
    } catch (error) {
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

  const handleDelete = async (id: number) => {
    try {
      const response = await apiService.deleteTeachingAssignment(id);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {teachers.length}
              </div>
              <div className="text-sm text-gray-600">Enseignants</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {classSubjects.length}
              </div>
              <div className="text-sm text-gray-600">Matières en classe</div>
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
                  Enseignant *
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Sélectionner un enseignant</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.user?.first_name || "Prénom"}{" "}
                      {teacher.user?.last_name || "Nom"} -{" "}
                      {teacher.speciality || "Spécialité"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière en classe *
                </label>
                <select
                  value={selectedClassSubject}
                  onChange={(e) =>
                    setSelectedClassSubject(Number(e.target.value))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Sélectionner une matière en classe</option>
                  {classSubjects.map((cs) => (
                    <option key={cs.id} value={cs.id}>
                      {cs.subject?.name || "Matière"} -{" "}
                      {cs.class?.name || "Classe"} (
                      {cs.class?.level || "Niveau"})
                    </option>
                  ))}
                </select>
                {classSubjects.length === 0 && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ Aucune matière n'est encore affectée aux classes.
                    <Button
                      onClick={() =>
                        navigate("/settings/subject-class-assignment")
                      }
                      variant="outline"
                      size="sm"
                      className="ml-2"
                    >
                      Créer des affectations
                    </Button>
                  </p>
                )}
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
                      {assignment.teacher?.user?.first_name || "Prénom inconnu"}{" "}
                      {assignment.teacher?.user?.last_name || "Nom inconnu"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {assignment.class_subject?.subject?.name ||
                        "Matière inconnue"}{" "}
                      -{" "}
                      {assignment.class_subject?.class?.name ||
                        "Classe inconnue"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Du {new Date(assignment.start_date).toLocaleDateString()}
                      {assignment.end_date &&
                        ` au ${new Date(
                          assignment.end_date
                        ).toLocaleDateString()}`}
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

export default TeacherSubjectAssignmentPage;
