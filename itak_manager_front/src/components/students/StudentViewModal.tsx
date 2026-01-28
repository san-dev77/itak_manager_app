import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users2,
  AlertCircle,
  User,
  Heart,
  CreditCard,
} from "lucide-react";
import Modal from "../ui/Modal";

interface Student {
  id: string;
  matricule: string;
  enrollmentDate: string | Date;
  photo?: string;
  fatherName?: string;
  motherName?: string;
  tutorName?: string;
  tutorPhone?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  scholarshipStatus?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
  };
}

interface StudentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit?: () => void;
  onGenerateCard?: () => void;
}

const StudentViewModal = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onGenerateCard,
}: StudentViewModalProps) => {
  if (!student) return null;

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "-";
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatScholarship = (status?: string) => {
    switch (status) {
      case "boursier":
        return { label: "Boursier", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "demi_boursier":
        return { label: "Demi-boursier", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "quart_boursier":
        return { label: "Quart-boursier", color: "bg-amber-100 text-amber-800 border-amber-200" };
      default:
        return { label: "Non-boursier", color: "bg-slate-100 text-slate-800 border-slate-200" };
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="2xl">
      <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        {/* Header */}
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-200">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow flex-shrink-0">
            {student.photo ? (
              <img
                src={student.photo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
                {student.user?.firstName?.[0]}
                {student.user?.lastName?.[0]}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {student.user?.firstName} {student.user?.lastName}
            </h3>
            <p className="text-slate-700 font-mono text-sm font-semibold">
              {student.matricule}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {student.user?.gender && (
                <span className="px-3 py-1 bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold border border-slate-300">
                  {student.user.gender === "M" ? "Masculin" : "Féminin"}
                </span>
              )}
              {(() => {
                const status = formatScholarship(student.scholarshipStatus);
                return (
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold border ${status.color}`}
                  >
                    {status.label}
                  </span>
                );
              })()}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>
                Inscrit le{" "}
                <strong className="text-slate-900">
                  {formatDate(student.enrollmentDate)}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Sections d'informations avec plus d'espace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section Contact */}
          <div className="bg-slate-100 rounded-xl p-4 border-2 border-slate-300">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-700" />
              Informations de contact
            </h4>
            <div className="space-y-2">
              <InfoCard
                icon={CreditCard}
                label="Statut de bourse"
                value={formatScholarship(student.scholarshipStatus).label}
              />
              <InfoCard icon={Mail} label="Email" value={student.user?.email} />
              <InfoCard
                icon={Phone}
                label="Téléphone"
                value={student.user?.phone}
              />
              <InfoCard icon={MapPin} label="Adresse" value={student.address} />
              <InfoCard
                icon={AlertCircle}
                label="Contact d'urgence"
                value={student.emergencyContact}
              />
            </div>
          </div>

          {/* Section Famille */}
          <div className="bg-slate-100 rounded-xl p-4 border-2 border-slate-300">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Users2 className="w-4 h-4 text-blue-700" />
              Informations familiales
            </h4>
            <div className="space-y-2">
              <InfoCard icon={User} label="Père" value={student.fatherName} />
              <InfoCard icon={Heart} label="Mère" value={student.motherName} />
              <InfoCard icon={User} label="Tuteur" value={student.tutorName} />
              <InfoCard
                icon={Phone}
                label="Téléphone tuteur"
                value={student.tutorPhone}
              />
            </div>
          </div>
        </div>

        {/* Notes avec plus d'espace */}
        {student.notes && (
          <div className="bg-amber-100 rounded-xl p-4 border-2 border-amber-400">
            <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Notes importantes
            </h4>
            <p className="text-sm text-amber-950 leading-relaxed whitespace-pre-wrap font-medium">
              {student.notes}
            </p>
          </div>
        )}

        {/* Actions avec plus d'espace */}
        <div className="flex gap-3 pt-3 border-t-2 border-slate-300 sticky bottom-0 bg-white pb-2">
          {onGenerateCard && (
            <button
              onClick={onGenerateCard}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-base shadow-lg hover:shadow-xl"
            >
              <CreditCard className="w-5 h-5" />
              Générer la carte étudiante
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold text-base shadow-md hover:shadow-lg"
            >
              Modifier
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-colors font-semibold text-base"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Composant amélioré pour afficher une info avec plus d'espace
const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
}) => {
  if (!value) {
    return (
      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border-2 border-slate-200 opacity-60">
        <Icon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-500 uppercase mb-0.5">
            {label}
          </p>
          <p className="text-sm text-slate-500 italic font-medium">
            Non renseigné
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
      <Icon className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-700 uppercase mb-1 tracking-wide">
          {label}
        </p>
        <p className="text-sm text-slate-900 font-semibold break-words">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StudentViewModal;
