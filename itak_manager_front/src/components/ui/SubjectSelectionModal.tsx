import React from "react";
import { BookOpen, Code, Clock } from "lucide-react";
import DataListModal from "./DataListModal";
import { type Subject } from "../../services/api";

interface SubjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSelect: (subject: Subject) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SubjectSelectionModal: React.FC<SubjectSelectionModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSelect,
  searchTerm,
  onSearchChange,
}) => {
  const renderSubject = (subject: Subject) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
              {subject.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Code className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-mono">
                {subject.code}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              Créé le {new Date(subject.createdAt).toLocaleDateString("fr-FR")}
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
      title="Sélectionner une matière"
      data={subjects}
      onSelect={onSelect}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      renderItem={renderSubject}
      placeholder="Rechercher une matière..."
      emptyMessage="Aucune matière trouvée"
    />
  );
};

export default SubjectSelectionModal;
