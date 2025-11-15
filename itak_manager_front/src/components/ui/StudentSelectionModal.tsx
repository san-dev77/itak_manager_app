import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, User } from "lucide-react";
import { apiService } from "../../services/api";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  email?: string;
  class?: string;
}

interface StudentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (student: Student) => void;
  title?: string;
}

const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = "Sélectionner un étudiant",
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (student.email &&
            student.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllUsers();
      if (response.success && response.data) {
        // Filtrer les étudiants par rôle
        const studentUsers = response.data.filter((user: any) => user.role === "student");
        // Convertir les utilisateurs en format Student
        const studentsData: Student[] = studentUsers.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          studentNumber: user.username || `STU${user.id}`,
          email: user.email,
        }));
        console.log("📥 Étudiants reçus de l'API:", studentsData);
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } else {
        console.error(
          "Erreur lors du chargement des étudiants:",
          response.error
        );
        // Fallback avec des données de test
        const testStudents = [
          {
            id: "1",
            firstName: "Mohamed",
            lastName: "Kamissoko",
            studentNumber: "STU001",
            email: "mohamed.kamissoko@itak.edu",
            class: "Terminale A",
          },
          {
            id: "2",
            firstName: "Fatoumata",
            lastName: "Traoré",
            studentNumber: "STU002",
            email: "fatoumata.traore@itak.edu",
            class: "Terminale B",
          },
          {
            id: "3",
            firstName: "Ibrahim",
            lastName: "Diallo",
            studentNumber: "STU003",
            email: "ibrahim.diallo@itak.edu",
            class: "Première A",
          },
          {
            id: "4",
            firstName: "Aminata",
            lastName: "Sangaré",
            studentNumber: "STU004",
            email: "aminata.sangare@itak.edu",
            class: "Première B",
          },
          {
            id: "5",
            firstName: "Ousmane",
            lastName: "Coulibaly",
            studentNumber: "STU005",
            email: "ousmane.coulibaly@itak.edu",
            class: "Seconde A",
          },
          {
            id: "6",
            firstName: "Mariam",
            lastName: "Keita",
            studentNumber: "STU006",
            email: "mariam.keita@itak.edu",
            class: "Seconde B",
          },
        ];
        setStudents(testStudents);
        setFilteredStudents(testStudents);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
      // Fallback avec des données de test en cas d'erreur réseau
      const testStudents = [
        {
          id: "1",
          firstName: "Mohamed",
          lastName: "Kamissoko",
          studentNumber: "STU001",
          email: "mohamed.kamissoko@itak.edu",
          class: "Terminale A",
        },
        {
          id: "2",
          firstName: "Fatoumata",
          lastName: "Traoré",
          studentNumber: "STU002",
          email: "fatoumata.traore@itak.edu",
          class: "Terminale B",
        },
        {
          id: "3",
          firstName: "Ibrahim",
          lastName: "Diallo",
          studentNumber: "STU003",
          email: "ibrahim.diallo@itak.edu",
          class: "Première A",
        },
        {
          id: "4",
          firstName: "Aminata",
          lastName: "Sangaré",
          studentNumber: "STU004",
          email: "aminata.sangare@itak.edu",
          class: "Première B",
        },
        {
          id: "5",
          firstName: "Ousmane",
          lastName: "Coulibaly",
          studentNumber: "STU005",
          email: "ousmane.coulibaly@itak.edu",
          class: "Seconde A",
        },
        {
          id: "6",
          firstName: "Mariam",
          lastName: "Keita",
          studentNumber: "STU006",
          email: "mariam.keita@itak.edu",
          class: "Seconde B",
        },
      ];
      setStudents(testStudents);
      setFilteredStudents(testStudents);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (student: Student) => {
    onSelect(student);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un étudiant par nom, prénom, numéro ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des étudiants...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleSelect(student)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {student.studentNumber}
                      </p>
                      {student.email && (
                        <p className="text-sm text-gray-500">{student.email}</p>
                      )}
                      {student.class && (
                        <p className="text-sm text-blue-600 font-medium">
                          {student.class}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900">
                  Aucun étudiant trouvé
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Aucun étudiant ne correspond à votre recherche."
                    : "Aucun étudiant disponible."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {filteredStudents.length} étudiant(s) trouvé(s)
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StudentSelectionModal;
