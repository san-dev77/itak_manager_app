import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  UserPlus,
  BookMarked,
  UserCheck,
  Link,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  BookOpen,
  Shield,
  Database,
  Cog,
  Info,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import Layout from "../components/layout/Layout";

const SettingsPage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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

  const settingsModules = [
    {
      id: "student-class",
      title: "Affectation Élèves",
      description: "Relier les élèves à leurs classes",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/settings/student-class",
      status: "active",
      count: "150+ élèves",
    },
    {
      id: "teacher-subject",
      title: "Affectation Matières",
      description: "Assigner les matières aux enseignants",
      icon: BookOpen,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      path: "/settings/teacher-subject",
      status: "active",
      count: "25+ matières",
    },
    {
      id: "teacher-class",
      title: "Affectation Classes",
      description: "Assigner les classes aux enseignants",
      icon: GraduationCap,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      path: "/settings/teacher-class",
      status: "active",
      count: "12 classes",
    },
    {
      id: "subject-class",
      title: "Programme Classes",
      description: "Définir les matières par classe",
      icon: BookMarked,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      path: "/settings/subject-class",
      status: "active",
      count: "Programme complet",
    },
  ];

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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header avec gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Paramètres du Système</h1>
                  <p className="text-blue-100">
                    UPCD ITAK - Institut Technique l'Antidote de Kati
                  </p>
                </div>
              </div>
              <p className="text-blue-100 text-lg">
                Configurez les relations entre élèves, enseignants, classes et
                matières
              </p>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Modules principaux */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
              Configuration Principale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settingsModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => (window.location.href = module.path)}
                >
                  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <module.icon className="w-7 h-7 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600 text-sm font-semibold">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span>Actif</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {module.count}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions secondaires */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Cog className="w-6 h-6 text-gray-600 mr-3" />
              Actions Rapides
            </h2>
            <div className="space-y-4">
              {/* Statistiques système */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Statistiques</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Élèves inscrits</span>
                    <span className="font-semibold text-blue-600">150+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enseignants</span>
                    <span className="font-semibold text-blue-600">25+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classes actives</span>
                    <span className="font-semibold text-blue-600">12</span>
                  </div>
                </div>
              </div>

              {/* Statut système */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Statut Système</h3>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-semibold">
                    Tous les services opérationnels
                  </span>
                </div>
              </div>

              {/* Dernière mise à jour */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Dernière MAJ</h3>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Configuration mise à jour</p>
                  <p className="font-semibold text-purple-600">
                    Il y a 2 heures
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations et guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Élèves</h3>
            </div>
            <p className="text-sm text-gray-600">
              Gérez les affectations des élèves aux classes pour organiser les
              groupes d'apprentissage
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Enseignants</h3>
            </div>
            <p className="text-sm text-gray-600">
              Assignez les matières et classes aux enseignants pour optimiser
              l'organisation pédagogique
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Programmes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Définissez les programmes scolaires en associant les matières aux
              classes appropriées
            </p>
          </div>
        </div>

        {/* Message d'aide */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                💡 Guide de Configuration UPCD ITAK
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Ce module vous permet de configurer toutes les relations entre
                les différents éléments de votre établissement. Commencez par l'
                <strong>Affectation Élèves</strong> pour organiser vos classes,
                puis configurez les
                <strong> Affectations Enseignants</strong> pour optimiser la
                répartition des responsabilités pédagogiques. Enfin, définissez
                les <strong>Programmes Classes</strong> pour établir le
                curriculum de chaque niveau.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
