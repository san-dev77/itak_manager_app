import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Users,
  BookOpen,
  Calendar,
  Settings,
  TrendingUp,
  Activity,
} from "lucide-react";
import Layout from "../components/layout/Layout";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  phone: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Récupérer les informations utilisateur depuis le stockage
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    const token =
      localStorage.getItem("itak_token") ||
      sessionStorage.getItem("itak_token");

    if (!userData || !token) {
      // Rediriger vers la connexion si pas d'authentification
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Erreur lors du parsing des données utilisateur:", error);
      navigate("/login");
    }
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Bienvenue, {user.first_name} ! 👋
          </h1>
          <p className="text-blue-600">
            Voici votre tableau de bord ITAK Manager
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Utilisateurs
                </p>
                <p className="text-2xl font-bold text-blue-900">1,247</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% ce mois
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">
                  Cours Actifs
                </p>
                <p className="text-2xl font-bold text-green-900">89</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% ce mois
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Événements
                </p>
                <p className="text-2xl font-bold text-purple-900">12</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Ce mois
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600">Sécurité</p>
                <p className="text-2xl font-bold text-orange-900">100%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Système sécurisé
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-blue-100 p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité Récente
            </h2>

            <div className="space-y-4">
              {[
                {
                  action: "Nouveau cours créé",
                  details: "Mathématiques Avancées par Prof. Martin",
                  time: "Il y a 2 heures",
                  type: "course",
                },
                {
                  action: "Utilisateur inscrit",
                  details: "Marie Dubois - Élève",
                  time: "Il y a 4 heures",
                  type: "user",
                },
                {
                  action: "Rapport généré",
                  details: "Rapport mensuel des performances",
                  time: "Il y a 6 heures",
                  type: "report",
                },
                {
                  action: "Mise à jour système",
                  details: "Version 1.2.0 déployée",
                  time: "Il y a 1 jour",
                  type: "system",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-blue-600">{activity.details}</p>
                    <p className="text-xs text-blue-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-blue-100 p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Actions Rapides
            </h2>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" />
                Gérer les Utilisateurs
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Créer un Cours
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Planifier un Événement
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Paramètres
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default DashboardPage;
