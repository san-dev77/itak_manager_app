import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, UserCheck, AlertTriangle } from "lucide-react";
import { apiService, type TeacherWithUser } from "../../services/api";
import Button from "../ui/Button";

interface TeacherDataTableProps {
  onEditProfile: (teacher: TeacherWithUser) => void;
}

const TeacherDataTable = ({ onEditProfile }: TeacherDataTableProps) => {
  const [teachers, setTeachers] = useState<TeacherWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getAllTeachers();

      if (response.success && response.data) {
        setTeachers(response.data);
      } else {
        setError(
          response.error || "Erreur lors de la récupération des enseignants"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const isProfileComplete = (teacher: TeacherWithUser): boolean => {
    return !!(
      teacher.matricule &&
      teacher.hire_date &&
      teacher.specialty &&
      teacher.diplomas &&
      teacher.address &&
      teacher.emergency_contact
    );
  };

  const getProfileStatusColor = (teacher: TeacherWithUser) => {
    return isProfileComplete(teacher)
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getProfileStatusIcon = (teacher: TeacherWithUser) => {
    return isProfileComplete(teacher) ? (
      <UserCheck className="w-4 h-4" />
    ) : (
      <AlertTriangle className="w-4 h-4" />
    );
  };

  const getProfileStatusText = (teacher: TeacherWithUser) => {
    return isProfileComplete(teacher) ? "Complet" : "Incomplet";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Chargement des enseignants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchTeachers} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-blue-600">Aucun enseignant trouvé</p>
          <p className="text-blue-400 text-sm mt-2">
            Les enseignants apparaîtront ici une fois leurs profils créés
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden"
    >
      <div className="p-6 border-b border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900">
          Données des Enseignants ({teachers.length})
        </h3>
        <p className="text-blue-600 text-sm mt-1">
          Gestion des profils enseignants et de leurs informations
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Enseignant
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Matricule
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Date d'embauche
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Spécialité
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Statut Profil
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-100">
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                      {teacher.user.first_name.charAt(0)}
                      {teacher.user.last_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-900">
                        {teacher.user.first_name} {teacher.user.last_name}
                      </div>
                      <div className="text-sm text-blue-600">
                        @{teacher.user.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        {teacher.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-900">
                    {teacher.matricule || "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-900">
                    {teacher.hire_date
                      ? new Date(teacher.hire_date).toLocaleDateString("fr-FR")
                      : "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-900">
                    {teacher.specialty || "—"}
                  </div>
                  <div className="text-xs text-blue-600">
                    {teacher.diplomas || "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getProfileStatusColor(
                      teacher
                    )}`}
                  >
                    {getProfileStatusIcon(teacher)}
                    {getProfileStatusText(teacher)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditProfile(teacher)}
                      className={`p-2 rounded-lg transition-colors ${
                        isProfileComplete(teacher)
                          ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          : "text-red-600 hover:text-red-700 hover:bg-red-50"
                      }`}
                      title={
                        isProfileComplete(teacher)
                          ? "Modifier le profil"
                          : "Compléter le profil"
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TeacherDataTable;
