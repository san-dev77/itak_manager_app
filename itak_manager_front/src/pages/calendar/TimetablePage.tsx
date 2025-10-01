import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Layout from "../../components/layout/Layout";
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Users,
  BookOpen,
  MapPin,
  Grid3x3,
  List,
  Printer,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import {
  apiService,
  type Timetable,
  type CreateTimetableDto,
  type SchoolYear,
  type Class,
  type TeachingAssignment,
  DayOfWeek,
} from "../../services/api";

const TimetablePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachingAssignments, setTeachingAssignments] = useState<
    TeachingAssignment[]
  >([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );
  const [teachingAssignmentSearch, setTeachingAssignmentSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const printRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateTimetableDto>({
    teachingAssignmentId: "",
    academicYearId: "",
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: "",
    endTime: "",
    room: "",
  });

  const daysOfWeek = [
    { value: DayOfWeek.MONDAY, label: "Lundi" },
    { value: DayOfWeek.TUESDAY, label: "Mardi" },
    { value: DayOfWeek.WEDNESDAY, label: "Mercredi" },
    { value: DayOfWeek.THURSDAY, label: "Jeudi" },
    { value: DayOfWeek.FRIDAY, label: "Vendredi" },
    { value: DayOfWeek.SATURDAY, label: "Samedi" },
    { value: DayOfWeek.SUNDAY, label: "Dimanche" },
  ];

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Récupérer les paramètres de l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const classParam = urlParams.get("class");
      const yearParam = urlParams.get("year");

      const [schoolYearsRes, classesRes, teachingAssignmentsRes] =
        await Promise.all([
          apiService.getAllSchoolYears(),
          apiService.getAllClasses(),
          apiService.getAllTeachingAssignments(),
        ]);

      if (schoolYearsRes.success && schoolYearsRes.data) {
        setSchoolYears(schoolYearsRes.data);

        // Priorité aux paramètres URL, sinon année active par défaut
        if (yearParam) {
          setSelectedSchoolYear(yearParam);
          setFormData((prev) => ({ ...prev, academicYearId: yearParam }));
        } else {
          const activeYear = schoolYearsRes.data.find((y) => y.isActive);
          if (activeYear) {
            setSelectedSchoolYear(activeYear.id);
            setFormData((prev) => ({ ...prev, academicYearId: activeYear.id }));
          }
        }
      }

      if (classesRes.success && classesRes.data) {
        setClasses(classesRes.data);

        // Pré-sélectionner la classe si fournie dans l'URL
        if (classParam) {
          setSelectedClass(classParam);
        }
      }

      if (teachingAssignmentsRes.success && teachingAssignmentsRes.data) {
        setTeachingAssignments(teachingAssignmentsRes.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTimetables = useCallback(async () => {
    if (!selectedSchoolYear || !selectedClass) return;

    console.log("🔍 Chargement des timetables pour:", {
      classe: selectedClass,
      année: selectedSchoolYear,
    });

    try {
      // Utiliser l'endpoint correct avec classId et academicYearId
      const response = await apiService.getTimetablesByClass(
        selectedClass,
        selectedSchoolYear
      );
      console.log("📥 Réponse getTimetablesByClass:", response);

      if (response.success && response.data) {
        console.log("✅ Timetables chargés:", response.data);
        setTimetables(response.data);
      } else {
        console.warn("⚠️ Erreur ou pas de données:", response);
        setTimetables([]);
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors du chargement des emplois du temps:",
        error
      );
      setTimetables([]);
    }
  }, [selectedSchoolYear, selectedClass]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (selectedSchoolYear && selectedClass) {
      fetchTimetables();
    }
  }, [selectedSchoolYear, selectedClass, fetchTimetables]);

  const showNotificationMessage = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCreateTimetable = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.teachingAssignmentId ||
      !formData.academicYearId ||
      !formData.startTime ||
      !formData.endTime
    ) {
      showNotificationMessage(
        "Veuillez remplir tous les champs obligatoires",
        "error"
      );
      return;
    }

    if (formData.startTime >= formData.endTime) {
      showNotificationMessage(
        "L'heure de fin doit être postérieure à l'heure de début",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createTimetable(formData);

      if (response.success && response.data) {
        setTimetables([...timetables, response.data]);
        setShowCreateModal(false);
        setTeachingAssignmentSearch("");
        setFormData({
          teachingAssignmentId: "",
          academicYearId: selectedSchoolYear,
          dayOfWeek: DayOfWeek.MONDAY,
          startTime: "",
          endTime: "",
          room: "",
        });
        showNotificationMessage("Cours ajouté avec succès", "success");
      } else {
        showNotificationMessage(
          response.message ||
            response.error ||
            "Erreur lors de la création du cours",
          "error"
        );
      }
    } catch {
      showNotificationMessage("Erreur lors de la création du cours", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimetable = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      try {
        const response = await apiService.deleteTimetable(id);
        if (response.success) {
          setTimetables(timetables.filter((t) => t.id !== id));
          showNotificationMessage("Cours supprimé avec succès", "success");
        } else {
          showNotificationMessage(
            response.message ||
              response.error ||
              "Erreur lors de la suppression",
            "error"
          );
        }
      } catch {
        showNotificationMessage("Erreur lors de la suppression", "error");
      }
    }
  };

  // Les timetables sont déjà filtrés par classe et année scolaire côté backend
  const filteredTimetables = timetables;

  // Grouper par jour de la semaine
  const timetablesByDay = filteredTimetables.reduce((acc, tt) => {
    if (!acc[tt.dayOfWeek]) {
      acc[tt.dayOfWeek] = [];
    }
    acc[tt.dayOfWeek].push(tt);
    return acc;
  }, {} as Record<DayOfWeek, Timetable[]>);

  // Fonction pour formater l'heure (enlever les secondes)
  const formatTime = (time: string): string => {
    return time.substring(0, 5); // Ne garde que HH:MM
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Emploi du temps - ${
      selectedClass
        ? classes.find((c) => c.id === selectedClass)?.name
        : "Classe"
    }`,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 1cm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .print-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .print-table {
          border-collapse: collapse !important;
        }
        .print-cell {
          border: 1px solid #d1d5db !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .print-time-cell {
          background: linear-gradient(to right, #f9fafb, #f3f4f6) !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .print-course-cell {
          background: #ffffff !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `,
  });

  // Trier les cours par heure de début
  Object.keys(timetablesByDay).forEach((day) => {
    timetablesByDay[day as DayOfWeek].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/calendar")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Emplois du temps
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez les emplois du temps par année scolaire et par classe
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année scolaire
              </label>
              <select
                value={selectedSchoolYear}
                onChange={(e) => {
                  setSelectedSchoolYear(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    academicYearId: e.target.value,
                  }));
                }}
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les années</option>
                {schoolYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name} {year.isActive && "(Active)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">Toutes les classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Vue liste"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Vue grille"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              {viewMode === "grid" && filteredTimetables.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              )}

              <Button
                onClick={() => setShowCreateModal(true)}
                disabled={!selectedSchoolYear || !selectedClass}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        {/* Emploi du temps */}
        {loading && filteredTimetables.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des emplois du temps...</p>
          </div>
        ) : filteredTimetables.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun cours programmé
            </h3>
            <p className="text-gray-600 mb-6">
              {!selectedSchoolYear && !selectedClass
                ? "Sélectionnez une année scolaire et une classe pour voir l'emploi du temps"
                : !selectedSchoolYear
                ? "Sélectionnez une année scolaire"
                : !selectedClass
                ? "Sélectionnez une classe pour voir l'emploi du temps"
                : "Commencez par ajouter des cours à l'emploi du temps"}
            </p>
            {selectedSchoolYear && selectedClass && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ajouter le premier cours
              </Button>
            )}
          </div>
        ) : viewMode === "list" ? (
          // Vue liste
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="grid gap-4">
                {daysOfWeek.map((day) => {
                  const dayCourses = timetablesByDay[day.value] || [];
                  if (dayCourses.length === 0) return null;

                  return (
                    <div
                      key={day.value}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">
                          {day.label}
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {dayCourses.map((tt) => {
                          const assignment = teachingAssignments.find(
                            (ta) => ta.id === tt.teachingAssignmentId
                          );
                          return (
                            <div
                              key={tt.id}
                              className="p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                      <Clock className="w-4 h-4 text-gray-400" />
                                      {formatTime(tt.startTime)} -{" "}
                                      {formatTime(tt.endTime)}
                                    </div>
                                    {tt.room && (
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        {tt.room}
                                      </div>
                                    )}
                                  </div>
                                  {assignment && (
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                                        <BookOpen className="w-4 h-4" />
                                        {assignment.classSubject?.subject?.name}
                                      </span>
                                      <span className="flex items-center gap-1 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        {assignment.classSubject?.class?.name}
                                      </span>
                                      <span className="text-gray-600">
                                        Prof:{" "}
                                        {assignment.teacher?.user?.firstName}{" "}
                                        {assignment.teacher?.user?.lastName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-orange-600 hover:text-orange-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteTimetable(tt.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Vue grille (format tableau)
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <div ref={printRef} className="print-container">
                  {/* En-tête pour l'impression */}
                  <div className="print-header hidden print:block bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 mb-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src="/src/assets/logo itak.png"
                          alt="Logo ITAK"
                          className="w-16 h-16 object-contain bg-white rounded-lg p-2"
                        />
                        <div>
                          <h1 className="text-2xl font-bold">
                            Institut Technique 'l'Antidote' de Kati
                          </h1>
                          <p className="text-lg opacity-90">Emploi du temps</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">
                          {selectedClass
                            ? classes.find((c) => c.id === selectedClass)?.name
                            : "Classe"}
                        </p>
                        <p className="text-sm opacity-90">
                          {selectedSchoolYear
                            ? schoolYears.find(
                                (sy) => sy.id === selectedSchoolYear
                              )?.name
                            : "Année scolaire"}
                        </p>
                        <p className="text-xs opacity-75">
                          {new Date().toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-gray-300 print-table">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <th className="border border-gray-300 p-3 text-left font-semibold min-w-[100px]">
                          Heures
                        </th>
                        {daysOfWeek
                          .filter((d) => d.value !== DayOfWeek.SUNDAY)
                          .map((day) => (
                            <th
                              key={day.value}
                              className="border border-gray-300 p-3 text-center font-semibold"
                            >
                              {day.label}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Récupérer toutes les plages horaires uniques des cours
                        const allTimeRanges = new Set<string>();
                        filteredTimetables.forEach((tt) => {
                          allTimeRanges.add(
                            `${formatTime(tt.startTime)}-${formatTime(
                              tt.endTime
                            )}`
                          );
                        });

                        // Convertir en tableau, trier par heure de début
                        const timeSlots = Array.from(allTimeRanges).sort(
                          (a, b) => {
                            const [startA] = a.split("-");
                            const [startB] = b.split("-");
                            return startA.localeCompare(startB);
                          }
                        );

                        // Si aucun cours, afficher un message
                        if (timeSlots.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan={7}
                                className="p-8 text-center text-gray-500"
                              >
                                Aucun cours programmé
                              </td>
                            </tr>
                          );
                        }

                        return timeSlots.map((timeRange) => {
                          const [startTime, endTime] = timeRange.split("-");

                          return (
                            <tr key={timeRange} className="hover:bg-gray-50">
                              <td className="border border-gray-300 p-3 bg-gradient-to-r from-gray-50 to-gray-100 whitespace-nowrap print-cell print-time-cell">
                                <div className="flex flex-col items-center">
                                  <div className="text-base font-bold text-gray-900">
                                    {startTime}
                                  </div>
                                  <div className="text-xs text-gray-400 my-1">
                                    ↓
                                  </div>
                                  <div className="text-sm font-semibold text-gray-700">
                                    {endTime}
                                  </div>
                                </div>
                              </td>
                              {daysOfWeek
                                .filter((d) => d.value !== DayOfWeek.SUNDAY)
                                .map((day) => {
                                  const dayCourses =
                                    timetablesByDay[day.value] || [];
                                  const courseAtTime = dayCourses.find(
                                    (course) => {
                                      return (
                                        formatTime(course.startTime) ===
                                          startTime &&
                                        formatTime(course.endTime) === endTime
                                      );
                                    }
                                  );

                                  if (!courseAtTime) {
                                    return (
                                      <td
                                        key={day.value}
                                        className="border border-gray-300 p-2 bg-white print-cell print-course-cell"
                                      >
                                        {/* Cellule vide */}
                                      </td>
                                    );
                                  }

                                  const assignment = teachingAssignments.find(
                                    (ta) =>
                                      ta.id ===
                                      courseAtTime.teachingAssignmentId
                                  );

                                  return (
                                    <td
                                      key={day.value}
                                      className="border border-gray-300 p-3 bg-blue-50 align-top print-cell print-course-cell"
                                    >
                                      <div className="text-sm">
                                        <div className="font-bold text-blue-900 mb-1">
                                          {assignment?.classSubject?.subject
                                            ?.name || "Matière"}
                                        </div>
                                        <div className="text-gray-700 text-xs">
                                          {assignment?.teacher?.user?.firstName}{" "}
                                          {assignment?.teacher?.user?.lastName}
                                        </div>
                                        {courseAtTime.room && (
                                          <div className="text-gray-600 text-xs flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {courseAtTime.room}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>

                  {/* Pied de page pour l'impression */}
                  <div className="hidden print:block mt-8 pt-4 border-t border-gray-300">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div>
                        <p>Kati, Mali</p>
                      </div>
                      <div className="text-right"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de création */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Ajouter un cours
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setTeachingAssignmentSearch("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
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

                <form onSubmit={handleCreateTimetable} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Professeur et Matière *
                      </label>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {teachingAssignments.length} affectation
                        {teachingAssignments.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Barre de recherche */}
                    <div className="mb-2">
                      <Input
                        type="text"
                        placeholder="Rechercher un professeur, une matière ou une classe..."
                        value={teachingAssignmentSearch}
                        onChange={(e) =>
                          setTeachingAssignmentSearch(e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>

                    <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {teachingAssignments.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Aucune affectation prof-matière disponible
                        </div>
                      ) : (
                        (() => {
                          const filteredAssignments =
                            teachingAssignments.filter((ta) => {
                              if (!teachingAssignmentSearch) return true;
                              const search =
                                teachingAssignmentSearch.toLowerCase();
                              return (
                                ta.teacher?.user?.firstName
                                  ?.toLowerCase()
                                  .includes(search) ||
                                ta.teacher?.user?.lastName
                                  ?.toLowerCase()
                                  .includes(search) ||
                                ta.classSubject?.subject?.name
                                  ?.toLowerCase()
                                  .includes(search) ||
                                ta.classSubject?.class?.name
                                  ?.toLowerCase()
                                  .includes(search)
                              );
                            });

                          return filteredAssignments.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              Aucun résultat trouvé
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-200">
                              {filteredAssignments.map((ta) => (
                                <label
                                  key={ta.id}
                                  className={`flex items-center p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                                    formData.teachingAssignmentId === ta.id
                                      ? "bg-blue-50 border-l-4 border-blue-500"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="teachingAssignment"
                                    value={ta.id}
                                    checked={
                                      formData.teachingAssignmentId === ta.id
                                    }
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        teachingAssignmentId: e.target.value,
                                      })
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                  <div className="ml-3 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900">
                                        {ta.teacher?.user?.firstName}{" "}
                                        {ta.teacher?.user?.lastName}
                                      </span>
                                      <span className="text-gray-400">→</span>
                                      <span className="text-blue-600 font-medium">
                                        {ta.classSubject?.subject?.name}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      Classe: {ta.classSubject?.class?.name} •{" "}
                                      {ta.classSubject?.weeklyHours}h/semaine
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          );
                        })()
                      )}
                    </div>
                    {formData.teachingAssignmentId === "" && (
                      <p className="text-xs text-gray-500 mt-2">
                        Sélectionnez un professeur et sa matière dans la liste
                        ci-dessus
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jour de la semaine *
                    </label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dayOfWeek: e.target.value as DayOfWeek,
                        })
                      }
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Heure de début *"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Heure de fin *"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Salle"
                    value={formData.room || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                    placeholder="Ex: Salle 101, Amphithéâtre A..."
                    maxLength={50}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        setTeachingAssignmentSearch("");
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? "Ajout..." : "Ajouter"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {showNotification && (
          <Notification
            title="Notification"
            isVisible={showNotification}
            message={notificationMessage}
            type={notificationType}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default TimetablePage;
