import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, UserCheck, AlertTriangle } from "lucide-react";
import { apiService, type StaffWithUser } from "../../services/api";
import Button from "../ui/Button";

interface StaffDataTableProps {
  onEditProfile: (staff: StaffWithUser) => void;
}

const StaffDataTable = ({ onEditProfile }: StaffDataTableProps) => {
  const [staffMembers, setStaffMembers] = useState<StaffWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getAllStaff();

      if (response.success && response.data) {
        setStaffMembers(response.data);
      } else {
        setError(
          response.error || "Erreur lors de la récupération du personnel"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const isProfileComplete = (staff: StaffWithUser): boolean => {
    return !!(
      staff.matricule &&
      staff.hire_date &&
      staff.position &&
      staff.address &&
      staff.emergency_contact
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
    return isProfileComplete(staff) ? "Complet" : "Incomplet";
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
              <tr key={staff.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {staff.user.first_name.charAt(0)}
                      {staff.user.last_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-900">
                        {staff.user.first_name} {staff.user.last_name}
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
                    {staff.hire_date
                      ? new Date(staff.hire_date).toLocaleDateString("fr-FR")
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
                      onClick={() => onEditProfile(staff)}
                      className={`p-2 rounded-lg transition-colors ${
                        isProfileComplete(staff)
                          ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          : "text-red-600 hover:text-red-700 hover:bg-red-50"
                      }`}
                      title={
                        isProfileComplete(staff)
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

export default StaffDataTable;
