import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "../ui/Modal";
import { Search, CheckSquare, Square } from "lucide-react";
import {
  apiService,
  type StudentFee,
  type StudentClass,
} from "../../services/api";

interface FeeType {
  id: string;
  name: string;
  amountDefault: number;
}

interface Student {
  id: string;
  userId: string;
  matricule: string;
  photo?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// StudentClass est importé de api.ts

interface AcademicYear {
  id: string;
  name: string;
  isActive: boolean;
}

interface StudentFeeAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeType: FeeType | null;
  onSuccess?: () => void;
}

const StudentFeeAssignmentModal: React.FC<StudentFeeAssignmentModalProps> = ({
  isOpen,
  onClose,
  feeType,
  onSuccess,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [assignFormData, setAssignFormData] = useState({
    dueDate: "",
  });
  const [loadingAssignData, setLoadingAssignData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);

  const loadAssignData = useCallback(async () => {
    try {
      setLoadingAssignData(true);
      const [studentsRes, classesRes, yearsRes, studentFeesRes] =
        await Promise.all([
          apiService.getAllStudents(),
          apiService.getAllStudentClasses(),
          apiService.getAllSchoolYears(),
          apiService.getAllStudentFees(),
        ]);

      if (studentsRes.success && studentsRes.data) {
        setStudents(studentsRes.data);
      }
      if (classesRes.success && classesRes.data) {
        setStudentClasses(classesRes.data);
      }
      if (yearsRes.success && yearsRes.data) {
        setAcademicYears(yearsRes.data);
      }
      if (studentFeesRes.success && studentFeesRes.data) {
        setStudentFees(studentFeesRes.data);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données d'affectation:",
        error
      );
    } finally {
      setLoadingAssignData(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && feeType) {
      loadAssignData();
      setSelectedStudents(new Set());
      setSelectedAcademicYear(null);
      setStudentSearchTerm("");
      setAssignFormData({ dueDate: "" });
    }
  }, [isOpen, feeType, loadAssignData]);

  const getStudentClass = (studentId: string) => {
    const studentClass = studentClasses.find(
      (sc) => sc.studentId === studentId && !sc.endDate
    );
    if (!studentClass?.class) return "Non assigné";

    const className = studentClass.class.name;
    const institution = studentClass.class.classCategory?.institution || null;

    if (institution) {
      return `${className} (${institution.code})`;
    }

    return className;
  };

  const toggleStudentSelection = (studentId: string) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const selectAllFilteredStudents = () => {
    const filtered = filteredStudents;
    setSelectedStudents(new Set(filtered.map((s) => s.id)));
  };

  const deselectAllStudents = () => {
    setSelectedStudents(new Set());
  };

  const assignedStudentIds = useMemo(() => {
    if (!feeType || !selectedAcademicYear) return new Set<string>();
    const assigned = studentFees
      .filter(
        (fee) =>
          fee.feeTypeId === feeType.id &&
          fee.academicYearId === selectedAcademicYear.id
      )
      .map((fee) => fee.studentId);
    return new Set<string>(assigned);
  }, [studentFees, feeType, selectedAcademicYear]);

  useEffect(() => {
    if (assignedStudentIds.size === 0) return;
    setSelectedStudents((prev) => {
      const next = new Set(
        [...prev].filter((id) => !assignedStudentIds.has(id))
      );
      return next;
    });
  }, [assignedStudentIds]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.user.firstName
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      student.user.lastName
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      student.matricule.toLowerCase().includes(studentSearchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (assignedStudentIds.has(student.id)) return false;
    return true;
  });

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feeType || selectedStudents.size === 0 || !selectedAcademicYear) {
      alert(
        "Veuillez sélectionner au moins un étudiant et une année scolaire."
      );
      return;
    }

    try {
      setActionLoading(true);

      const promises = Array.from(selectedStudents).map((studentId) => {
        const data: {
          studentId: string;
          feeTypeId: string;
          academicYearId: string;
          amountAssigned: number;
          dueDate?: string;
        } = {
          studentId: studentId,
          feeTypeId: feeType.id,
          academicYearId: selectedAcademicYear.id,
          amountAssigned: Number(feeType.amountDefault),
        };
        if (assignFormData.dueDate && assignFormData.dueDate.trim() !== "") {
          data.dueDate = assignFormData.dueDate;
        }
        return apiService.createStudentFee(data);
      });

      const responses = await Promise.all(promises);
      const successful = responses.filter((r) => r.success);
      const failed = responses.filter((r) => !r.success);

      if (successful.length === responses.length) {
        setSuccessMessage(
          `Frais attribués avec succès à ${successful.length} étudiant(s) !`
        );
        if (onSuccess) onSuccess();
      } else {
        alert(
          `${successful.length} attribution(s) réussie(s), ${failed.length} échouée(s).`
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'affectation:", error);
      alert("Erreur lors de l'affectation. Veuillez réessayer.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!feeType) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Affecter "${feeType.name}"`}
      size="lg"
    >
      {successMessage && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSuccessMessage(null);
            onClose();
          }}
          title="Succès"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-800 text-sm">{successMessage}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage(null);
                  onClose();
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </Modal>
      )}
      {loadingAssignData ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleAssign}
          className="space-y-4 flex flex-col h-full"
        >
          {/* Informations du type de frais */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">
                {feeType.amountDefault.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="text-sm text-gray-600">
                {selectedStudents.size > 0 &&
                  `${selectedStudents.size} sélectionné(s)`}
              </span>
            </div>
          </div>

          {/* Année scolaire */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Année scolaire *
            </label>
            <select
              value={selectedAcademicYear?.id || ""}
              onChange={(e) => {
                const year = academicYears.find((y) => y.id === e.target.value);
                setSelectedAcademicYear(year || null);
              }}
              className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white cursor-pointer"
              required
            >
              <option value="">Sélectionner une année</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name} {year.isActive && "(Actuelle)"}
                </option>
              ))}
            </select>
          </div>

          {/* Conteneur séparé pour les étudiants */}
          <div className="flex-1 flex overflow-y-auto flex-col min-h-0 border border-gray-300 rounded-lg bg-white">
            {/* En-tête du conteneur étudiants */}
            <div className="flex items-center justify-between p-3 border-b overflow-y-auto border-gray-200 bg-gray-50 rounded-t-lg flex-shrink-0">
              <label className="block text-sm font-semibold text-gray-700">
                Étudiants *
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={selectAllFilteredStudents}
                  className="text-sm px-3 py-1.5 text-blue-700 hover:bg-blue-100 rounded-lg cursor-pointer font-semibold"
                >
                  Tout
                </button>
                <button
                  type="button"
                  onClick={deselectAllStudents}
                  className="text-sm px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer font-semibold"
                >
                  Aucun
                </button>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white placeholder-gray-400"
              />
            </div>

            {/* Liste scrollable des étudiants */}
            <div className="flex-1 overflow-y-auto min-h-0 p-3">
              <div className="space-y-2">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudents.has(student.id);
                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudentSelection(student.id)}
                      className={`p-2.5 border rounded-lg cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        {/* Photo de l'étudiant */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={`${student.user.firstName} ${student.user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs font-semibold">
                              {student.user.firstName.charAt(0)}
                              {student.user.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {student.user.firstName} {student.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.matricule} • {getStudentClass(student.id)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    Aucun étudiant trouvé
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Date d'échéance */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date d'échéance{" "}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              type="date"
              value={assignFormData.dueDate}
              onChange={(e) =>
                setAssignFormData({
                  ...assignFormData,
                  dueDate: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black text-white cursor-pointer"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-3 mt-3 border-t flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-base border-2 border-gray-400 text-gray-800 rounded-lg hover:bg-gray-200 cursor-pointer font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={
                actionLoading ||
                selectedStudents.size === 0 ||
                !selectedAcademicYear
              }
              className="px-4 py-2.5 text-base bg-green-700 hover:bg-green-800 text-white rounded-lg disabled:opacity-50 cursor-pointer font-bold shadow-md"
            >
              {actionLoading ? "..." : `Affecter (${selectedStudents.size})`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default StudentFeeAssignmentModal;
