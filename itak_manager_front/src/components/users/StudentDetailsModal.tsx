import React from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import { type StudentWithUser } from "../../services/api";
import Button from "../ui/Button";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithUser | null;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Non renseigné";
    try {
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  const getMaritalStatusLabel = (status: string | undefined) => {
    if (!status) return "Non renseigné";
    const statusMap: { [key: string]: string } = {
      single: "Célibataire",
      married: "Marié(e)",
      divorced: "Divorcé(e)",
      widowed: "Veuf/Veuve",
    };
    return statusMap[status] || status;
  };

  const hasCompleteProfile =
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
    );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white overflow-hidden flex-shrink-0">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/30 flex-shrink-0"
              >
                {student.user.firstName.charAt(0)}
                {student.user.lastName.charAt(0)}
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-1"
                >
                  {student.user.firstName} {student.user.lastName}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-blue-100 text-base mb-2"
                >
                  @{student.user.username}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                      hasCompleteProfile
                        ? "bg-green-500/20 text-green-100 border-green-400/30"
                        : "bg-orange-500/20 text-orange-100 border-orange-400/30"
                    }`}
                  >
                    {hasCompleteProfile ? (
                      <>
                        <User className="w-3 h-3" />
                        Profil complet
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Profil incomplet
                      </>
                    )}
                  </span>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="p-2 bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100 hover:scrollbar-thumb-blue-500">
          {/* Informations personnelles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <label className="block text-sm font-semibold text-blue-700 mb-2">
                    Nom complet
                  </label>
                  <p className="text-gray-800 font-semibold text-lg">
                    {student.user.firstName} {student.user.lastName}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <label className="block text-sm font-semibold text-purple-700 mb-2">
                    Nom d'utilisateur
                  </label>
                  <p className="text-gray-800 font-medium">
                    @{student.user.username}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <label className="block text-sm font-semibold text-green-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <p className="text-gray-800 font-medium">
                      {student.user.email}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                  <label className="block text-sm font-semibold text-orange-700 mb-2">
                    Rôle
                  </label>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                    Étudiant
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                  <label className="block text-sm font-semibold text-indigo-700 mb-2">
                    Matricule
                  </label>
                  <p className="text-gray-800 font-mono text-lg font-semibold">
                    {student.matricule || "Non renseigné"}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 border border-cyan-100">
                  <label className="block text-sm font-semibold text-cyan-700 mb-2">
                    Date d'inscription
                  </label>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    <p className="text-gray-800 font-medium">
                      {formatDate(student.enrollmentDate)}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100">
                  <label className="block text-sm font-semibold text-rose-700 mb-2">
                    Statut matrimonial
                  </label>
                  <p className="text-gray-800 font-medium">
                    {getMaritalStatusLabel(student.maritalStatus)}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                  <label className="block text-sm font-semibold text-violet-700 mb-2">
                    Photo
                  </label>
                  <p className="text-gray-800 font-medium">
                    {student.photo ? "📸 Photo disponible" : "📷 Aucune photo"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Informations familiales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Informations familiales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    👨 Nom du père
                  </label>
                  <p className="text-gray-800 font-medium">
                    {student.fatherName || "Non renseigné"}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                  <label className="block text-sm font-semibold text-pink-700 mb-2">
                    👩 Nom de la mère
                  </label>
                  <p className="text-gray-800 font-medium">
                    {student.motherName || "Non renseigné"}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
                  <label className="block text-sm font-semibold text-amber-700 mb-2">
                    👤 Nom du tuteur
                  </label>
                  <p className="text-gray-800 font-medium">
                    {student.tutorName || "Non renseigné"}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
                  <label className="block text-sm font-semibold text-teal-700 mb-2">
                    📞 Téléphone du tuteur
                  </label>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-teal-600" />
                    <p className="text-gray-800 font-medium">
                      {student.tutorPhone || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              Informations de contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                  <label className="block text-sm font-semibold text-purple-700 mb-2">
                    🏠 Adresse
                  </label>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                    <p className="text-gray-800 font-medium">
                      {student.address || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <label className="block text-sm font-semibold text-red-700 mb-2">
                    🚨 Contact d'urgence
                  </label>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-red-600" />
                    <p className="text-gray-800 font-medium">
                      {student.emergencyContact || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notes et informations supplémentaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Notes et informations supplémentaires
            </h3>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                <label className="block text-sm font-semibold text-orange-700 mb-3">
                  📝 Notes
                </label>
                <p className="text-gray-800 whitespace-pre-wrap font-medium leading-relaxed">
                  {student.notes || "Aucune note disponible"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    📅 Date de création
                  </label>
                  <p className="text-gray-800 font-medium">
                    {formatDate(student.createdAt)}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🔄 Dernière modification
                  </label>
                  <p className="text-gray-800 font-medium">
                    {formatDate(student.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50/50 backdrop-blur-sm border-t-2 border-gray-800/50 p-4 flex-shrink-0">
          <div className="flex justify-end gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Fermer
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDetailsModal;
