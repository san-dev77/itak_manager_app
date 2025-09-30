import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Edit, UserCheck, AlertTriangle, Eye, CreditCard } from "lucide-react";
import {
  apiService,
  type StudentWithUser,
  type User,
} from "../../services/api";
import Button from "../ui/Button";
import StudentDetailsModal from "./StudentDetailsModal";
import StudentCardGenerator from "./StudentCardGenerator";

interface StudentDataTableProps {
  onEditProfile: (student: StudentWithUser) => void;
  refreshTrigger?: number; // Pour forcer le rechargement
  users?: User[]; // Liste des utilisateurs à afficher
  isProfileTypeCompatible?: (userRole: string, profileType: string) => boolean;
}

const StudentDataTable = ({
  onEditProfile,
  refreshTrigger,
  users = [],
  isProfileTypeCompatible,
}: StudentDataTableProps) => {
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithUser | null>(null);
  const [showCardGenerator, setShowCardGenerator] = useState(false);
  const [selectedStudentForCard, setSelectedStudentForCard] =
    useState<StudentWithUser | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Récupérer les profils étudiants existants
      const response = await apiService.getAllStudents();
      const existingProfiles =
        response.success && response.data ? response.data : [];

      // Inclure tous les utilisateurs qui ont des profils étudiants OU qui ont le rôle "student"
      const studentUsers = users.filter(
        (user) =>
          user.role === "student" ||
          existingProfiles.some((profile) => profile.userId === user.id)
      );

      // Combiner les utilisateurs avec leurs profils (s'ils existent)
      const combinedStudents: StudentWithUser[] = studentUsers.map((user) => {
        const existingProfile = existingProfiles.find(
          (profile) => profile.userId === user.id
        );

        if (existingProfile) {
          return existingProfile;
        } else {
          // Créer un profil vide pour l'utilisateur sans profil
          return {
            id: "0",
            userId: user.id,
            matricule: "",
            enrollmentDate: "",
            photo: undefined,
            maritalStatus: "",
            fatherName: "",
            motherName: "",
            tutorName: "",
            tutorPhone: "",
            address: "",
            emergencyContact: "",
            notes: "",
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
          };
        }
      });

      setStudents(combinedStudents);
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  }, [users]);

  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger, fetchStudents]);

  const isProfileComplete = (student: StudentWithUser): boolean => {
    // Un profil est complet si l'utilisateur a un ID de profil (id > 0) et les champs essentiels
    return (
      student.id !== "0" &&
      !!(
        student.matricule &&
        student.enrollmentDate &&
        student.fatherName &&
        student.motherName &&
        student.tutorName &&
        student.tutorPhone &&
        student.address &&
        student.emergencyContact
      )
    );
  };

  const getProfileStatusColor = (student: StudentWithUser) => {
    return isProfileComplete(student)
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getProfileStatusIcon = (student: StudentWithUser) => {
    return isProfileComplete(student) ? (
      <UserCheck className="w-4 h-4" />
    ) : (
      <AlertTriangle className="w-4 h-4" />
    );
  };

  const getProfileStatusText = (student: StudentWithUser) => {
    if (student.id === "0") {
      return "Profil manquant";
    }
    return isProfileComplete(student) ? "Complet" : "Incomplet";
  };

  const handleShowDetails = (student: StudentWithUser) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedStudent(null);
  };

  const handleGenerateCard = (student: StudentWithUser) => {
    setSelectedStudentForCard(student);
    setShowCardGenerator(true);
  };

  const handleCloseCardGenerator = () => {
    setShowCardGenerator(false);
    setSelectedStudentForCard(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Chargement des étudiants...</p>
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
          <Button onClick={fetchStudents} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-blue-600">Aucun étudiant trouvé</p>
          <p className="text-blue-400 text-sm mt-2">
            Les étudiants apparaîtront ici une fois leurs profils créés
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
          Données des Étudiants ({students.length})
        </h3>
        <p className="text-blue-600 text-sm mt-1">
          Gestion des profils étudiants et de leurs informations
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Étudiant
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Matricule
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Date d'inscription
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Tuteur
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
            {students.map((student) => (
              <tr
                key={student.id}
                className={`hover:bg-blue-50 transition-colors ${
                  student.id === "0" ? "bg-red-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        student.id === "0"
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : "bg-gradient-to-br from-blue-500 to-blue-600"
                      }`}
                    >
                      {student.user.firstName.charAt(0)}
                      {student.user.lastName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-900">
                        {student.user.firstName} {student.user.lastName}
                      </div>
                      <div className="text-sm text-blue-600">
                        @{student.user.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-900">
                    {student.matricule || "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-900">
                    {student.enrollmentDate
                      ? new Date(student.enrollmentDate).toLocaleDateString(
                          "fr-FR"
                        )
                      : "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-900">
                    {student.tutorName || "—"}
                  </div>
                  <div className="text-xs text-blue-600">
                    {student.tutorPhone || "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getProfileStatusColor(
                      student
                    )}`}
                  >
                    {getProfileStatusIcon(student)}
                    {getProfileStatusText(student)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleShowDetails(student)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir tous les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleGenerateCard(student)}
                      className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Générer une carte étudiante"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        // Vérifier la compatibilité du rôle avant d'ouvrir le profil
                        if (
                          isProfileTypeCompatible &&
                          !isProfileTypeCompatible(student.user.role, "student")
                        ) {
                          alert(
                            `Erreur: Un utilisateur avec le rôle "${student.user.role}" ne peut pas avoir un profil étudiant.`
                          );
                          return;
                        }
                        onEditProfile(student);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        student.id === "0"
                          ? "text-white bg-red-600 hover:bg-red-700"
                          : isProfileComplete(student)
                          ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                          : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      }`}
                      title={
                        student.id === "0"
                          ? "Créer le profil"
                          : isProfileComplete(student)
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

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        student={selectedStudent}
      />

      {/* Student Card Generator Modal */}
      <StudentCardGenerator
        isOpen={showCardGenerator}
        onClose={handleCloseCardGenerator}
        student={selectedStudentForCard}
        redirectUrl="https://itak.edu" // Vous pouvez changer cette URL plus tard
      />
    </motion.div>
  );
};

export default StudentDataTable;
