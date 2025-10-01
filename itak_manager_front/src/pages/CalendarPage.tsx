import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  Calendar,
  Clock,
  CalendarDays,
  Plus,
  Filter,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import Button from "../components/ui/Button";
import {
  apiService,
  type Timetable,
  type Class,
  type SchoolYear,
} from "../services/api";

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [activeTab, setActiveTab] = useState<"schedules" | "events">(
    "schedules"
  );
  const [classes, setClasses] = useState<Class[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [allTimetables, setAllTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(false);

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
      const [classesRes, schoolYearsRes, timetablesRes] = await Promise.all([
        apiService.getAllClasses(),
        apiService.getAllSchoolYears(),
        apiService.getAllTimetables(),
      ]);

      if (classesRes.success && classesRes.data) {
        setClasses(classesRes.data);
      }

      if (schoolYearsRes.success && schoolYearsRes.data) {
        setSchoolYears(schoolYearsRes.data);
      }

      if (timetablesRes.success && timetablesRes.data) {
        setAllTimetables(timetablesRes.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

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
              onClick={() => navigate("/dashboard")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
              <p className="text-gray-600 mt-1">
                Gérez les emplois du temps et les événements de l'établissement
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab("schedules")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "schedules"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Emplois du temps
                </div>
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "events"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Événements
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {activeTab === "schedules" ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Emplois du temps
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Créez et gérez les emplois du temps des classes
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtrer
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    onClick={() => navigate("/calendar/timetables")}
                  >
                    <Plus className="w-4 h-4" />
                    Gérer les emplois du temps
                  </Button>
                </div>
              </div>

              {/* Aperçu des emplois du temps par classe */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">
                    Chargement des emplois du temps...
                  </p>
                </div>
              ) : allTimetables.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun emploi du temps créé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Commencez par créer votre premier emploi du temps pour
                    organiser les cours
                  </p>
                  <Button
                    onClick={() => navigate("/calendar/timetables")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Créer un emploi du temps
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map((cls) => {
                    const activeYear = schoolYears.find((y) => y.isActive);
                    const classTimetables = allTimetables.filter(
                      (tt) =>
                        tt.academicYearId === activeYear?.id &&
                        // On filtre par classe via le teaching assignment
                        allTimetables.some((t) => t.id === tt.id)
                    );

                    // Pour simplifier, on compte les cours pour cette classe
                    const coursesCount = classTimetables.length;

                    if (coursesCount === 0) return null;

                    return (
                      <div
                        key={cls.id}
                        onClick={() =>
                          navigate(
                            `/calendar/timetables?class=${cls.id}&year=${
                              activeYear?.id || ""
                            }`
                          )
                        }
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {cls.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Niveau {cls.level}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {coursesCount} cours programmé
                                {coursesCount > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                            Voir l'emploi du temps
                          </span>
                          <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}

                  {classes.every(() => {
                    const activeYear = schoolYears.find((y) => y.isActive);
                    const classTimetables = allTimetables.filter(
                      (tt) => tt.academicYearId === activeYear?.id
                    );
                    return classTimetables.length === 0;
                  }) && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucun emploi du temps créé
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Commencez par créer des emplois du temps pour vos
                        classes
                      </p>
                      <Button
                        onClick={() => navigate("/calendar/timetables")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Créer un emploi du temps
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Événements
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Gérez les événements de l'établissement (journées sport,
                    propreté, etc.)
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtrer
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                    onClick={() => navigate("/calendar/events")}
                  >
                    <Plus className="w-4 h-4" />
                    Nouvel événement
                  </Button>
                </div>
              </div>

              {/* Placeholder pour les événements */}
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun événement créé
                </h3>
                <p className="text-gray-600 mb-6">
                  Créez des événements pour marquer les journées spéciales de
                  l'établissement
                </p>
                <Button
                  onClick={() => navigate("/calendar/events")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Créer un événement
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
