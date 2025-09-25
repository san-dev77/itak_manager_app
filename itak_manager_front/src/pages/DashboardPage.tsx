import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  TrendingUp,
  Activity,
  ArrowRight,
  BarChart3,
  Clock,
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
      localStorage.getItem("itak_access_token") ||
      sessionStorage.getItem("itak_access_token");

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      user={{
        firstName: (user as any)?.firstName || "Utilisateur",
        lastName: (user as any)?.lastName || "Anonyme",
        role: user?.role || "user",
        email: user?.email || "",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Bonjour, {user.first_name} ! 👋
              </h1>
              <p className="text-slate-600">
                Voici un aperçu de votre tableau de bord
              </p>
            </div>
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-slate-500">Aujourd'hui</p>
              <p className="text-lg font-semibold text-slate-700">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Users className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Utilisateurs
                </p>
                <p className="text-2xl font-bold text-slate-900">1,247</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% ce mois
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BookOpen className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Cours Actifs
                </p>
                <p className="text-2xl font-bold text-slate-900">89</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% ce mois
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Calendar className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-slate-600">Événements</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Ce mois
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BarChart3 className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Performance
                </p>
                <p className="text-2xl font-bold text-slate-900">98%</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Excellent
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Activité Récente
              </h2>
              <motion.button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Voir tout
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {[
                {
                  action: "Nouveau cours créé",
                  details: "Mathématiques Avancées",
                  time: "Il y a 2h",
                  type: "course",
                  color: "emerald",
                },
                {
                  action: "Utilisateur inscrit",
                  details: "Marie Dubois - Élève",
                  time: "Il y a 4h",
                  type: "user",
                  color: "blue",
                },
                {
                  action: "Rapport généré",
                  details: "Rapport mensuel",
                  time: "Il y a 6h",
                  type: "report",
                  color: "violet",
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className={`w-3 h-3 rounded-full mt-2 bg-${activity.color}-500`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 group-hover:text-slate-700">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600">{activity.details}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Actions Rapides
            </h2>

            <div className="space-y-3">
              <motion.button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-5 h-5" />
                Gérer les Utilisateurs
                <ArrowRight className="w-4 h-4 ml-auto" />
              </motion.button>

              <motion.button
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen className="w-5 h-5" />
                Créer un Cours
                <ArrowRight className="w-4 h-4 ml-auto" />
              </motion.button>

              <motion.button
                className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-5 h-5" />
                Planifier un Événement
                <ArrowRight className="w-4 h-4 ml-auto" />
              </motion.button>

              <motion.button
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-5 h-5" />
                Paramètres
                <ArrowRight className="w-4 h-4 ml-auto" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default DashboardPage;
