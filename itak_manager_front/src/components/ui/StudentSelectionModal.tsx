import React from "react";
import { User, Mail, Calendar, Hash } from "lucide-react";
import DataListModal from "./DataListModal";
import { type StudentWithUser } from "../../services/api";

interface StudentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentWithUser[];
  onSelect: (student: StudentWithUser) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({
  isOpen,
  onClose,
  students,
  onSelect,
  searchTerm,
  onSearchChange,
}) => {
  const renderStudent = (student: StudentWithUser) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
              {student.user.firstName} {student.user.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {student.user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4 text-sm">
          {student.matricule && (
            <div className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 font-mono">
                {student.matricule}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              Inscrit le{" "}
              {new Date(student.enrollmentDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DataListModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sélectionner un élève"
      data={students}
      onSelect={onSelect}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      renderItem={renderStudent}
      placeholder="Rechercher un élève..."
      emptyMessage="Aucun élève trouvé"
    />
  );
};

export default StudentSelectionModal;
