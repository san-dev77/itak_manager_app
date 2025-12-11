import { Mail, Phone, AlertCircle, User } from "lucide-react";
import Modal from "../ui/Modal";

interface Staff {
  id: string;
  hireDate: string | Date;
  position?: string;
  photo?: string;
  emergencyContact?: string;
  maritalStatus?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

interface StaffViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onEdit?: () => void;
}

const StaffViewModal = ({ isOpen, onClose, staff, onEdit }: StaffViewModalProps) => {
  if (!staff) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold shadow flex-shrink-0">
            {staff.user?.firstName?.[0]}{staff.user?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {staff.user?.firstName} {staff.user?.lastName}
            </h3>
            {staff.position && (
              <p className="text-sm text-slate-600 mt-1">{staff.position}</p>
            )}
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-3">
          <InfoRow icon={Mail} label="Email" value={staff.user?.email} />
          <InfoRow icon={Phone} label="Téléphone" value={staff.user?.phone} />
          {staff.maritalStatus && (
            <InfoRow 
              icon={User} 
              label="Situation matrimoniale" 
              value={staff.maritalStatus === "single" ? "Célibataire" : staff.maritalStatus === "married" ? "Marié(e)" : staff.maritalStatus} 
            />
          )}
          <InfoRow icon={AlertCircle} label="Contact d'urgence" value={staff.emergencyContact} />
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

export default StaffViewModal;
