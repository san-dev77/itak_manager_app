import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Paramètres de Configuration
          </h1>
          <p className="text-gray-600">
            Gérer les affectations entre élèves, classes, matières et
            enseignants
          </p>
        </div>

        {/* Explication de la logique */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Comment fonctionnent les affectations ?
          </h2>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <p>
                D'abord, <strong>affectez des matières aux classes</strong>{" "}
                (coefficient, heures, optionnel)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <p>
                Ensuite, <strong>affectez des élèves aux classes</strong> (avec
                dates de début/fin)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <p>
                Enfin,{" "}
                <strong>affectez des enseignants aux matières-classes</strong>{" "}
                (pour qu'ils enseignent)
              </p>
            </div>
          </div>
        </div>

        {/* Menu des affectations */}
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Étape 1: Matières → Classes */}
          <div className="bg-white rounded-lg border border-gray-500 p-6 hover:shadow-md transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Matières → Classes
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Affecter des matières aux classes avec coefficients et heures
              </p>
            </div>
            <Button
              onClick={() => navigate("/settings/subject-class-assignment")}
              className="w-full"
            >
              Gérer les matières-classes
            </Button>
          </div>

          {/* Étape 2: Élèves → Classes */}
          <div className="bg-white rounded-lg border border-gray-500 p-6 hover:shadow-md transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">👨‍🎓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Élèves → Classes
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Inscrire des élèves dans des classes avec dates d'inscription
              </p>
            </div>
            <Button
              onClick={() => navigate("/settings/student-class-assignment")}
              className="w-full"
            >
              Gérer les inscriptions
            </Button>
          </div>

          {/* Étape 3: Enseignants → Matières-Classes */}
          <div className="bg-white rounded-lg border border-gray-500 p-6 hover:shadow-md transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enseignants → Matières-Classes
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Affecter des enseignants aux matières dans les classes
              </p>
            </div>
            <Button
              onClick={() => navigate("/settings/teacher-subject-assignment")}
              className="w-full"
            >
              Gérer les affectations
            </Button>
          </div>

          {/* Vue d'ensemble */}
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Conseils d'utilisation
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • Commencez toujours par créer les affectations matières-classes
            </li>
            <li>
              • Un élève peut être inscrit dans une seule classe à la fois
            </li>
            <li>
              • Un enseignant peut enseigner plusieurs matières dans plusieurs
              classes
            </li>
            <li>
              • Les dates de fin sont optionnelles (affectation permanente si
              non spécifiée)
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
