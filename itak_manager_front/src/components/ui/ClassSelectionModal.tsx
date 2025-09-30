import React from "react";
import { GraduationCap, Users, Calendar } from "lucide-react";
import SimpleModal from "./SimpleModal";
import { type Class } from "../../services/api";

interface ClassSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  onSelect: (classItem: Class) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ClassSelectionModal: React.FC<ClassSelectionModalProps> = ({
  isOpen,
  onClose,
  classes,
  onSelect,
  searchTerm,
  onSearchChange,
}) => {
  const renderClass = (classItem: Class) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-green-600 transition-colors">
              {classItem.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Niveau: {classItem.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {classItem.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {classItem.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              Créé le{" "}
              {new Date(classItem.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SimpleModal<Class>
      isOpen={isOpen}
      onClose={onClose}
      title="Sélectionner une classe"
      data={classes}
      onSelect={onSelect}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      renderItem={renderClass}
      placeholder="Rechercher une classe..."
      emptyMessage="Aucune classe trouvée"
    />
  );
};

export default ClassSelectionModal;
