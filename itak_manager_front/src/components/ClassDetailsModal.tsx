import React, { useState, useEffect, useCallback } from "react";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import { apiService } from "../services/api";
import type {
  Class,
  StudentWithUser,
  TeacherWithUser,
  ClassSubject,
  StudentClass,
  TeachingAssignment,
} from "../services/api";

interface ClassDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: Class | null;
}

type TabType = "students" | "teachers" | "subjects";

const ClassDetailsModal: React.FC<ClassDetailsModalProps> = ({
  isOpen,
  onClose,
  classItem,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [teachers, setTeachers] = useState<TeacherWithUser[]>([]);
  const [subjects, setSubjects] = useState<ClassSubject[]>([]);
  const [loading, setLoading] = useState(false);

  const loadClassDetails = useCallback(async () => {
    if (!classItem) return;

    setLoading(true);
    try {
      // Charger toutes les données nécessaires
      const [
        studentsRes,
        teachersRes,
        classSubjectsRes,
        studentClassesRes,
        teachingAssignmentsRes,
      ] = await Promise.all([
        apiService.getAllStudents(),
        apiService.getAllTeachers(),
        apiService.getAllClassSubjects(),
        apiService.getAllStudentClasses(),
        apiService.getAllTeachingAssignments(),
      ]);

      // Debug: Afficher les données reçues
      console.log("Données reçues:", {
        students: studentsRes,
        teachers: teachersRes,
        classSubjects: classSubjectsRes,
        studentClasses: studentClassesRes,
        teachingAssignments: teachingAssignmentsRes,
        classItem: classItem,
      });

      // Filtrer les élèves assignés à cette classe
      const classStudents =
        studentClassesRes.success && studentClassesRes.data
          ? studentClassesRes.data
              .filter((sc: StudentClass) => {
                console.log("Filtrage StudentClass:", {
                  sc,
                  classItemId: classItem.id,
                });
                return sc?.class?.id === classItem.id;
              })
              .map((sc: StudentClass) => {
                console.log("Mapping StudentClass:", sc);
                return sc.student;
              })
              .filter((student) => {
                console.log("Filtrage student:", student);
                return student;
              }) // Filtrer les étudiants undefined
          : [];

      // Filtrer les matières assignées à cette classe
      const classSubjects =
        classSubjectsRes.success && classSubjectsRes.data
          ? classSubjectsRes.data.filter(
              (cs: ClassSubject) => cs?.class?.id === classItem.id
            )
          : [];

      // Filtrer les professeurs assignés à cette classe via les matières
      const classTeachers =
        teachingAssignmentsRes.success && teachingAssignmentsRes.data
          ? teachingAssignmentsRes.data
              .filter(
                (ta: TeachingAssignment) =>
                  ta?.classSubject?.id &&
                  classSubjects.some(
                    (cs: ClassSubject) => cs?.id === ta.classSubject.id
                  )
              )
              .map((ta: TeachingAssignment) => ta.teacher)
              .filter((teacher) => teacher) // Filtrer les professeurs undefined
              .filter(
                (teacher, index, self) =>
                  teacher?.id &&
                  index === self.findIndex((t) => t?.id === teacher.id)
              ) // Supprimer les doublons
          : [];

      setStudents(classStudents);
      setTeachers(classTeachers);
      setSubjects(classSubjects);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des détails de la classe:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [classItem]);

  useEffect(() => {
    if (isOpen && classItem) {
      loadClassDetails();
    }
  }, [isOpen, classItem, loadClassDetails]);

  const getLevelLabel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      "1": "1ère année",
      "2": "2ème année",
      "3": "3ème année",
      "4": "4ème année",
      "5": "5ème année",
      "6": "6ème année",
      "7": "7ème année",
      "8": "8ème année",
      "9": "9ème année",
      "10": "10ème année",
      "11": "11ème année",
      "12": "12ème année",
    };
    return levelMap[level] || level;
  };

  if (!isOpen || !classItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{classItem.name}</h2>
                <p className="text-blue-100">
                  {getLevelLabel(classItem.level)} • Capacité:{" "}
                  {classItem.capacity}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "students"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Élèves ({students.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "teachers"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Professeurs ({teachers.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "subjects"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Matières ({subjects.length})
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement des données...</p>
            </div>
          ) : (
            <>
              {activeTab === "students" && (
                <div className="space-y-3">
                  {students.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucun élève assigné à cette classe
                    </div>
                  ) : (
                    students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {student.user?.firstName || "Prénom"}{" "}
                            {student.user?.lastName || "Nom"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.user?.email || "Email non disponible"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Matricule: {student.matricule || "N/A"}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Actif
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "teachers" && (
                <div className="space-y-3">
                  {teachers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucun professeur assigné à cette classe
                    </div>
                  ) : (
                    teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {teacher.user?.firstName || "Prénom"}{" "}
                            {teacher.user?.lastName || "Nom"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {teacher.user?.email || "Email non disponible"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Diplômes: {teacher.diplomas || "N/A"}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Professeur
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "subjects" && (
                <div className="space-y-3">
                  {subjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucune matière assignée à cette classe
                    </div>
                  ) : (
                    subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {subject.subject?.name || "Matière inconnue"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Code: {subject.subject?.code || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Coefficient: {subject.coefficient} • Heures/semaine:{" "}
                            {subject.weeklyHours}
                          </p>
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {subject.isOptional ? "Optionnelle" : "Obligatoire"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsModal;
