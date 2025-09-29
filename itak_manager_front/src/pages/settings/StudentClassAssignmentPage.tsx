import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import { apiService } from "../../services/api";
import { Search, Users, GraduationCap, X, Check } from "lucide-react";

const StudentClassAssignmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  // États pour la modale
  const [showModal, setShowModal] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [tempSelectedStudents, setTempSelectedStudents] = useState<any[]>([]);
  const [tempSelectedClass, setTempSelectedClass] = useState<any>(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, classesRes, assignmentsRes] = await Promise.all([
          apiService.getAllStudents(),
          apiService.getAllClasses(),
          apiService.getAllStudentClasses(),
        ]);

        if (studentsRes.success) setStudents(studentsRes.data || []);
        if (classesRes.success) setClasses(classesRes.data || []);
        if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !selectedClass || !startDate) {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Veuillez remplir tous les champs obligatoires",
        isVisible: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.createStudentClass({
        student_id: selectedStudent,
        class_id: selectedClass,
        start_date: startDate,
        end_date: endDate || undefined,
      });

      if (response.success) {
        // Recharger les données
        const assignmentsRes = await apiService.getAllStudentClasses();
        if (assignmentsRes.success) {
          setAssignments(assignmentsRes.data || []);
        }

        setNotification({
          type: "success",
          title: "Succès",
          message: "Affectation créée avec succès",
          isVisible: true,
        });

        // Reset form
        setSelectedStudent(0);
        setSelectedClass(0);
        setStartDate("");
        setEndDate("");
      }
    } catch (error) {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de la création",
        isVisible: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiService.deleteStudentClass(id);
      if (response.success) {
        // Recharger les données
        const assignmentsRes = await apiService.getAllStudentClasses();
        if (assignmentsRes.success) {
          setAssignments(assignmentsRes.data || []);
        }

        setNotification({
          type: "success",
          title: "Succès",
          message: "Affectation supprimée avec succès",
          isVisible: true,
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors de la suppression",
        isVisible: true,
      });
    }
  };

  // Fonctions pour la modale
  const openModal = () => {
    setShowModal(true);
    setTempSelectedStudents([]);
    setTempSelectedClass(null);
    setStudentSearchTerm("");
    setClassSearchTerm("");
  };

  const closeModal = () => {
    setShowModal(false);
    setTempSelectedStudents([]);
    setTempSelectedClass(null);
    setStudentSearchTerm("");
    setClassSearchTerm("");
  };

  const toggleStudentSelection = (student: any) => {
    setTempSelectedStudents((prev) => {
      const isSelected = prev.some((s) => s.id === student.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const selectAllStudents = () => {
    setTempSelectedStudents(filteredStudents);
  };

  const clearStudentSelection = () => {
    setTempSelectedStudents([]);
  };

  const confirmSelection = () => {
    if (tempSelectedStudents.length > 0 && tempSelectedClass) {
      // Pour l'instant, on prend le premier élève sélectionné
      // Plus tard on pourra gérer l'affectation multiple
      setSelectedStudent(tempSelectedStudents[0].id);
      setSelectedClass(tempSelectedClass.id);
      closeModal();
    }
  };

  // Filtrage des données
  const filteredStudents = students.filter((student) =>
    `${student.user?.firstName || ""} ${student.user?.lastName || ""} ${
      student.matricule || ""
    }`
      .toLowerCase()
      .includes(studentSearchTerm.toLowerCase())
  );

  const filteredClasses = classes.filter((cls) =>
    `${cls.name} ${cls.level} ${cls.code || ""}`
      .toLowerCase()
      .includes(classSearchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              size="sm"
            >
              ← Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Affectation Élèves-Classes
              </h1>
              <p className="text-gray-600 mt-1">
                Gérer l'affectation des élèves aux classes
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {students.length}
              </div>
              <div className="text-sm text-gray-600">Élèves</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {classes.length}
              </div>
              <div className="text-sm text-gray-600">Classes</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">
                {assignments.length}
              </div>
              <div className="text-sm text-gray-600">Affectations</div>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            isVisible={notification.isVisible}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Nouvelle affectation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sélection élève et classe */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Élève et Classe *
                  </label>
                  <Button
                    type="button"
                    onClick={openModal}
                    variant="outline"
                    className="w-full justify-start text-left h-12 hover:bg-slate-50 border-slate-300"
                  >
                    {selectedStudent && selectedClass ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-slate-600" />
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                            1 élève
                          </span>
                        </div>
                        <span className="text-gray-400">→</span>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4 text-slate-600" />
                          <span className="font-medium">
                            {classes.find((c) => c.id === selectedClass)?.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Search className="w-4 h-4" />
                        Cliquer pour sélectionner des élèves et une classe
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin (optionnel)
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !selectedStudent || !selectedClass}
              >
                {isSubmitting ? "Création..." : "Créer l'affectation"}
              </Button>
            </form>
          </div>

          {/* Liste */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Affectations existantes ({assignments.length})
            </h2>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {assignment.student?.firstName || "Prénom inconnu"}{" "}
                      {assignment.student?.lastName || "Nom inconnu"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Classe : {assignment.class?.name || "Classe inconnue"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Du {new Date(assignment.startDate).toLocaleDateString()}
                      {assignment.endDate &&
                        ` au ${new Date(
                          assignment.endDate
                        ).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(assignment.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
              {assignments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune affectation trouvée
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modale de sélection */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Affectation Élèves → Classe
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Sélectionnez les élèves à affecter à une classe
                  </p>
                </div>
                <Button
                  onClick={closeModal}
                  variant="outline"
                  size="sm"
                  className="p-2 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Liste des élèves */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-slate-600" />
                        <h4 className="font-medium text-gray-900">
                          Élèves ({filteredStudents.length})
                        </h4>
                        {tempSelectedStudents.length > 0 && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                            {tempSelectedStudents.length} sélectionné
                            {tempSelectedStudents.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={selectAllStudents}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Tout sélectionner
                        </Button>
                        <Button
                          onClick={clearStudentSelection}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Effacer
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un élève..."
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                      {filteredStudents.map((student) => {
                        const isSelected = tempSelectedStudents.some(
                          (s) => s.id === student.id
                        );
                        return (
                          <div
                            key={student.id}
                            onClick={() => toggleStudentSelection(student)}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "bg-slate-100 border-2 border-slate-500 shadow-sm"
                                : "bg-white hover:bg-slate-50 border-2 border-transparent hover:border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "bg-slate-500 border-slate-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {student.user?.firstName || "Prénom"}{" "}
                                    {student.user?.lastName || "Nom"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Matricule: {student.matricule || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          Aucun élève trouvé
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Liste des classes */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-slate-600" />
                      <h4 className="font-medium text-gray-900">
                        Classes ({filteredClasses.length})
                      </h4>
                      {tempSelectedClass && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Classe sélectionnée
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une classe..."
                        value={classSearchTerm}
                        onChange={(e) => setClassSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                      />
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                      {filteredClasses.map((cls) => {
                        const isSelected = tempSelectedClass?.id === cls.id;
                        return (
                          <div
                            key={cls.id}
                            onClick={() => setTempSelectedClass(cls)}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "bg-green-50 border-2 border-green-500 shadow-sm"
                                : "bg-white hover:bg-green-50 border-2 border-transparent hover:border-green-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {cls.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {cls.level} • {cls.code || "N/A"} •
                                    Capacité: {cls.capacity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredClasses.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          Aucune classe trouvée
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="text-sm text-gray-600">
                  {tempSelectedStudents.length > 0 && tempSelectedClass ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {tempSelectedStudents.length} élève
                        {tempSelectedStudents.length > 1 ? "s" : ""} →{" "}
                        {tempSelectedClass.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">
                      Sélectionnez au moins un élève et une classe
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={closeModal}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={confirmSelection}
                    disabled={
                      tempSelectedStudents.length === 0 || !tempSelectedClass
                    }
                    className="bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tempSelectedStudents.length > 1
                      ? `Affecter ${tempSelectedStudents.length} élèves`
                      : "Confirmer la sélection"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentClassAssignmentPage;
