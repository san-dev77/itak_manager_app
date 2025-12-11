import { Mail, Phone, AlertCircle, Award, User } from "lucide-react";
import Modal from "../ui/Modal";

interface Teacher {
  id: string;
  hireDate: string | Date;
  photo?: string;
  diplomas?: string;
  emergencyContact?: string;
  maritalStatus?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

interface TeacherViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onEdit?: () => void;
}

const TeacherViewModal = ({ isOpen, onClose, teacher, onEdit }: TeacherViewModalProps) => {
  if (!teacher) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold shadow flex-shrink-0">
            {teacher.user?.firstName?.[0]}{teacher.user?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {teacher.user?.firstName} {teacher.user?.lastName}
            </h3>
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-3">
          <InfoRow icon={Mail} label="Email" value={teacher.user?.email} />
          <InfoRow icon={Phone} label="Téléphone" value={teacher.user?.phone} />
          {teacher.maritalStatus && (
            <InfoRow 
              icon={User} 
              label="Situation matrimoniale" 
              value={teacher.maritalStatus === "single" ? "Célibataire" : teacher.maritalStatus === "married" ? "Marié(e)" : teacher.maritalStatus} 
            />
          )}
          <InfoRow icon={Award} label="Diplômes" value={teacher.diplomas} />
          <InfoRow icon={AlertCircle} label="Contact d'urgence" value={teacher.emergencyContact} />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold text-sm"
            >
              Modifier
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase mb-0.5">{label}</p>
        <p className="text-sm text-slate-700 font-medium">{value}</p>
      </div>
    </div>
  );
};

export default TeacherViewModal;
