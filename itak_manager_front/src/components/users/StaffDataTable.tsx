import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Edit, UserCheck, AlertTriangle, Eye } from "lucide-react";
import { apiService, type StaffWithUser, type User } from "../../services/api";
import Button from "../ui/Button";
import StaffDetailsModal from "./StaffDetailsModal";

interface StaffDataTableProps {
  onEditProfile: (staff: StaffWithUser) => void;
  refreshTrigger?: number;
  users?: User[];
  isProfileTypeCompatible?: (userRole: string, profileType: string) => boolean;
}

const StaffDataTable = ({
  onEditProfile,
  refreshTrigger,
  users = [],
  isProfileTypeCompatible,
}: StaffDataTableProps) => {
  const [staffMembers, setStaffMembers] = useState<StaffWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffWithUser | null>(
    null
  );

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Récupérer les profils staff existants
      const response = await apiService.getAllStaff();
      const existingProfiles =
        response.success && response.data ? response.data : [];

      // Inclure tous les utilisateurs qui ont des profils staff OU qui ont le rôle "staff" ou "teacher"
      const staffUsers = users.filter(
        (user) =>
          (user.role as string) === "staff" ||
          (user.role as string) === "teacher" ||
          existingProfiles.some((profile) => profile.userId === user.id)
      );

      // Combiner les utilisateurs avec leurs profils (s'ils existent)
      const combinedStaff: StaffWithUser[] = staffUsers.map((user) => {
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
            hireDate: "",
            position: "",
            photo: undefined,
            maritalStatus: "",
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

      setStaffMembers(combinedStaff);
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  }, [users]);

  useEffect(() => {
    fetchStaff();
  }, [refreshTrigger, fetchStaff]);

  const isProfileComplete = (staff: StaffWithUser): boolean => {
    return (
      staff.id !== "0" &&
      !!(
        staff.matricule &&
        staff.hireDate &&
        staff.position &&
        staff.address &&
        staff.emergencyContact
      )
    );
  };

  const getProfileStatusColor = (staff: StaffWithUser) => {
    return isProfileComplete(staff)
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getProfileStatusIcon = (staff: StaffWithUser) => {
    return isProfileComplete(staff) ? (
      <UserCheck className="w-4 h-4" />
    ) : (
      <AlertTriangle className="w-4 h-4" />
    );
  };

  const getProfileStatusText = (staff: StaffWithUser) => {
    if (staff.id === "0") {
      return "Profil manquant";
    }
    return isProfileComplete(staff) ? "Complet" : "Incomplet";
  };

  const handleShowDetails = (staff: StaffWithUser) => {
    setSelectedStaff(staff);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedStaff(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Chargement du personnel...</p>
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
          <Button onClick={fetchStaff} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (staffMembers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-blue-600">Aucun membre du personnel trouvé</p>
          <p className="text-blue-400 text-sm mt-2">
            Le personnel apparaîtra ici une fois leurs profils créés
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
          Données du Personnel Administratif ({staffMembers.length})
        </h3>
        <p className="text-blue-600 text-sm mt-1">
          Gestion des profils du personnel et de leurs informations
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Personnel
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Matricule
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Date d'embauche
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                Poste
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
            {staffMembers.map((staff) => (
              <tr
                key={staff.id}
                className={`hover:bg-blue-50 transition-colors ${
                  staff.id === "0" ? "bg-red-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        staff.id === "0"
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : "bg-gradient-to-br from-purple-500 to-purple-600"
                      }`}
                    >
                      {staff.user.firstName?.charAt(0) || "?"}
                      {staff.user.lastName?.charAt(0) || "?"}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-900">
                        {staff.user.firstName || "?"}{" "}
                        {staff.user.lastName || "?"}
                      </div>
                      <div className="text-sm text-blue-600">
                        @{staff.user.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        {staff.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-900">
                    {staff.matricule || "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-900">
                    {staff.hireDate
                      ? new Date(staff.hireDate).toLocaleDateString("fr-FR")
                      : "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-900">
                    {staff.position || "—"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getProfileStatusColor(
                      staff
                    )}`}
                  >
                    {getProfileStatusIcon(staff)}
                    {getProfileStatusText(staff)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleShowDetails(staff)}
                      className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Voir tous les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        // Vérifier la compatibilité du rôle avant d'ouvrir le profil
                        if (
                          isProfileTypeCompatible &&
                          !isProfileTypeCompatible(staff.user.role, "staff")
                        ) {
                          alert(
                            `Erreur: Un utilisateur avec le rôle "${staff.user.role}" ne peut pas avoir un profil de personnel.`
                          );
                          return;
                        }
                        onEditProfile(staff);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        staff.id === "0"
                          ? "text-white bg-red-600 hover:bg-red-700"
                          : isProfileComplete(staff)
                          ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      }`}
                      title={
                        staff.id === "0"
                          ? "Créer le profil"
                          : isProfileComplete(staff)
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

      {/* Staff Details Modal */}
      <StaffDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
        staff={selectedStaff}
      />
    </motion.div>
  );
};

export default StaffDataTable;
