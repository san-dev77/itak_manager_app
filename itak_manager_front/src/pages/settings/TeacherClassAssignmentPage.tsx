import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Notification from "../../components/ui/Notification";
import { apiService } from "../../services/api";

const TeacherClassAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const assignmentsRes = await apiService.getAllTeachingAssignments();
        if (assignmentsRes.success) {
          setAssignments(assignmentsRes.data || []);
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

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
                Vue Enseignants-Classes
              </h1>
              <p className="text-gray-600 mt-1">
                Consulter les affectations des enseignants aux classes
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
                  Page de consultation uniquement
                </h3>
                <p className="text-blue-800 text-sm">
                  Cette page affiche les enseignants affectés aux classes via
                  leurs matières. Pour créer de nouvelles affectations, utilisez
                  la page "Affectation Enseignants-Matières".
                </p>
                <Button
                  onClick={() =>
                    navigate("/settings/teacher-subject-assignment")
                  }
                  className="mt-3"
                >
                  Aller à la page d'affectation
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {assignments.length}
              </div>
              <div className="text-sm text-gray-600">Affectations totales</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {new Set(assignments.map((a) => a.teacher?.id)).size}
              </div>
              <div className="text-sm text-gray-600">Enseignants affectés</div>
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

        {/* Liste des affectations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Affectations existantes ({assignments.length})
          </h2>

          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {assignment.teacher?.user?.first_name?.[0] || "E"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {assignment.teacher?.user?.first_name ||
                            "Prénom inconnu"}{" "}
                          {assignment.teacher?.user?.last_name || "Nom inconnu"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.teacher?.speciality ||
                            "Spécialité non définie"}
                        </p>
                      </div>
                    </div>

                    <div className="ml-13">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Matière :</span>{" "}
                        {assignment.class_subject?.subject?.name ||
                          "Matière inconnue"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Classe :</span>{" "}
                        {assignment.class_subject?.class?.name ||
                          "Classe inconnue"}{" "}
                        ({assignment.class_subject?.class?.level || "Niveau"})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Du{" "}
                        {new Date(assignment.start_date).toLocaleDateString()}
                        {assignment.end_date &&
                          ` au ${new Date(
                            assignment.end_date
                          ).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {assignments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">👨‍🏫</span>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Aucune affectation trouvée
                </p>
                <p className="text-gray-600">
                  Les enseignants n'ont pas encore été affectés aux matières
                  dans les classes.
                </p>
                <Button
                  onClick={() =>
                    navigate("/settings/teacher-subject-assignment")
                  }
                  className="mt-4"
                >
                  Créer la première affectation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherClassAssignmentPage;
