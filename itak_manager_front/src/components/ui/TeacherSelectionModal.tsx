import React from "react";
import { GraduationCap, Mail, Calendar, Hash } from "lucide-react";
import DataListModal from "./DataListModal";
import { type TeacherWithUser } from "../../services/api";

interface TeacherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: TeacherWithUser[];
  onSelect: (teacher: TeacherWithUser) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const TeacherSelectionModal: React.FC<TeacherSelectionModalProps> = ({
  isOpen,
  onClose,
  teachers,
  onSelect,
  searchTerm,
  onSearchChange,
}) => {
  const renderTeacher = (teacher: TeacherWithUser) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
              {teacher.user.firstName} {teacher.user.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {teacher.user.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4 text-sm">
          {teacher.matricule && (
            <div className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 font-mono">
                {teacher.matricule}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              Embauché le{" "}
              {new Date(teacher.hireDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        {teacher.diplomas && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {teacher.diplomas}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <DataListModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sélectionner un enseignant"
      data={teachers}
      onSelect={onSelect}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      renderItem={renderTeacher}
      placeholder="Rechercher un enseignant..."
      emptyMessage="Aucun enseignant trouvé"
    />
  );
};

export default TeacherSelectionModal;
