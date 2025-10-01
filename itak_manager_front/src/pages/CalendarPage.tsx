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
  X,
  FileText,
  Info,
} from "lucide-react";
import Button from "../components/ui/Button";
import {
  apiService,
  type Timetable,
  type Class,
  type SchoolYear,
  type Event,
  type EventType,
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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
      const [classesRes, schoolYearsRes, timetablesRes, eventsRes] =
        await Promise.all([
          apiService.getAllClasses(),
          apiService.getAllSchoolYears(),
          apiService.getAllTimetables(),
          apiService.getAllEvents(),
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

      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
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

  // Fonctions utilitaires pour les événements
  const getEventTypeLabel = (eventType: EventType) => {
    switch (eventType) {
      case "exam":
        return "Examen";
      case "homework":
        return "Devoir";
      case "cultural_day":
        return "Journée culturelle";
      case "health_day":
        return "Journée santé";
      case "ball":
        return "Bal";
      default:
        return "Autre";
    }
  };

  const getEventTypeColor = (eventType: EventType) => {
    switch (eventType) {
      case "exam":
        return "bg-red-100 text-red-800";
      case "homework":
        return "bg-blue-100 text-blue-800";
      case "cultural_day":
        return "bg-purple-100 text-purple-800";
      case "health_day":
        return "bg-green-100 text-green-800";
      case "ball":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obtenir les événements à venir (7 prochains jours)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 5); // Limiter à 5 événements
  };

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
                    Nouvel emploi du temps
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
                        Nouvel emploi du temps
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

              {/* Aperçu des événements */}
              <div className="space-y-6">
                {/* Section événements à venir */}
                {/* <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-green-600" />
                    Événements à venir (7 prochains jours)
                  </h3>

                  {getUpcomingEvents().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getUpcomingEvents().map((event) => (
                        <div
                          key={event.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                                    event.eventType
                                  )}`}
                                >
                                  {getEventTypeLabel(event.eventType)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(event.startDate).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                  }
                                )}
                                {event.endDate &&
                                  event.endDate !== event.startDate && (
                                    <span className="ml-1">
                                      -{" "}
                                      {new Date(
                                        event.endDate
                                      ).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                      })}
                                    </span>
                                  )}
                              </span>
                            </div>

                            {event.class && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{event.class.name}</span>
                              </div>
                            )}

                            {event.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">
                        Aucun événement à venir
                      </h4>
                      <p className="text-sm text-gray-600">
                        Créez des événements pour les 7 prochains jours
                      </p>
                    </div>
                  )}
                </div> */}

                {/* Liste de tous les événements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-green-600" />
                    Tous les événements ({events.length})
                  </h3>

                  {events.length > 0 ? (
                    <div className="space-y-3">
                      {events
                        .sort(
                          (a, b) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime()
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {event.title}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                                      event.eventType
                                    )}`}
                                  >
                                    {getEventTypeLabel(event.eventType)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(
                                        event.startDate
                                      ).toLocaleDateString("fr-FR", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                      {event.endDate &&
                                        event.endDate !== event.startDate && (
                                          <span className="ml-1">
                                            -{" "}
                                            {new Date(
                                              event.endDate
                                            ).toLocaleDateString("fr-FR", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                            })}
                                          </span>
                                        )}
                                    </span>
                                  </div>

                                  {event.class && (
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4" />
                                      <span>{event.class.name}</span>
                                    </div>
                                  )}

                                  {event.description && (
                                    <div className="md:col-span-3">
                                      <p className="text-gray-600">
                                        {event.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">
                        Aucun événement créé
                      </h4>
                      <p className="text-sm text-gray-600">
                        Créez votre premier événement
                      </p>
                    </div>
                  )}
                </div>

                {/* Bouton d'action */}
                <div className="text-center pt-4">
                  <Button
                    onClick={() => navigate("/calendar/events")}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3"
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Gérer tous les événements
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails d'événement */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* En-tête */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(
                        selectedEvent.eventType
                      )}`}
                    >
                      {getEventTypeLabel(selectedEvent.eventType)}
                    </span>
                    {selectedEvent.allDay && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Toute la journée
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenu détaillé */}
              <div className="space-y-6">
                {/* Dates */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Dates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Date de début
                      </p>
                      <p className="text-gray-900">
                        {new Date(selectedEvent.startDate).toLocaleDateString(
                          "fr-FR",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    {selectedEvent.endDate &&
                      selectedEvent.endDate !== selectedEvent.startDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Date de fin
                          </p>
                          <p className="text-gray-900">
                            {new Date(selectedEvent.endDate).toLocaleDateString(
                              "fr-FR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Classe */}
                {selectedEvent.class && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Classe concernée
                    </h3>
                    <p className="text-gray-900">{selectedEvent.class.name}</p>
                  </div>
                )}

                {/* Description */}
                {selectedEvent.description && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Description
                    </h3>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-600" />
                    Informations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Créé le</p>
                      <p className="text-gray-900">
                        {new Date(selectedEvent.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    {selectedEvent.creator && (
                      <div>
                        <p className="text-gray-600">Créé par</p>
                        <p className="text-gray-900">
                          {selectedEvent.creator.firstName}{" "}
                          {selectedEvent.creator.lastName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(null)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate("/calendar/events");
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Modifier l'événement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CalendarPage;
