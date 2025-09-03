import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, UserPlus, BookMarked, UserCheck, Link } from "lucide-react";
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
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/settings/student-class",
    },
    {
      id: "teacher-subject",
      title: "Affectation Matières",
      description: "Assigner les matières aux enseignants",
      icon: BookMarked,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      path: "/settings/teacher-subject",
    },
    {
      id: "teacher-class",
      title: "Affectation Classes",
      description: "Assigner les classes aux enseignants",
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      path: "/settings/teacher-class",
    },
    {
      id: "subject-class",
      title: "Programme Classes",
      description: "Définir les matières par classe",
      icon: Link,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      path: "/settings/subject-class",
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent mb-3">
            Paramètres du Système
          </h1>
          <p className="text-gray-600 text-lg">
            Configurez les relations entre élèves, enseignants, classes et
            matières
          </p>
        </div>

        {/* Modules de paramètres */}
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
              <div
                className={`${module.bgColor} rounded-2xl p-6 border-2 border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <module.icon
                      className={`w-8 h-8 ${module.iconColor.replace(
                        "text-",
                        "text-white"
                      )}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors">
                      <span>Cliquer pour configurer</span>
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              À propos des paramètres
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Affectation Élèves → Classes
              </h3>
              <p>
                Définissez quels élèves appartiennent à quelles classes pour
                organiser les groupes d'apprentissage.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Affectation Enseignants → Matières
              </h3>
              <p>
                Spécifiez quels enseignants sont responsables de quelles
                matières dans l'établissement.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Affectation Enseignants → Classes
              </h3>
              <p>
                Déterminez quels enseignants sont responsables de quelles
                classes (professeurs principaux).
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Programme Classes → Matières
              </h3>
              <p>
                Définissez le programme scolaire en associant les matières aux
                classes appropriées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
