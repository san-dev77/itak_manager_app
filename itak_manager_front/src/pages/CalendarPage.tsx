import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  CalendarDays,
  Plus,
  Users,
  BookOpen,
  ChevronRight,
  FileText,
  Info,
} from "lucide-react";
import AuthenticatedPage from "../components/layout/AuthenticatedPage";
import PageHeader from "../components/ui/PageHeader";
import DataTable from "../components/ui/DataTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { HeaderActionButton } from "../components/ui/ActionButton";
import TableActions from "../components/ui/TableActions";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import {
  apiService,
  type Timetable,
  type Class,
  type SchoolYear,
  type Event,
  type EventType,
} from "../services/api";

type TabType = "schedules" | "events";

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("schedules");
  const [classes, setClasses] = useState<Class[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [allTimetables, setAllTimetables] = useState<Timetable[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

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
    fetchData();
  }, [fetchData]);

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

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      const response = await apiService.deleteEvent(eventToDelete.id);
      if (response.success) {
        setEvents(events.filter((e) => e.id !== eventToDelete.id));
        setShowDeleteDialog(false);
        setEventToDelete(null);
      } else {
        alert(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'événement");
    }
  };

  // Calculer les compteurs pour les onglets
  const activeYear = schoolYears.find((y) => y.isActive);
  const timetablesCount = allTimetables.filter(
    (tt) => tt.academicYearId === activeYear?.id
  ).length;
  const eventsCount = events.length;

  // Colonnes pour la table des événements
  const eventColumns = [
    {
      key: "title",
      header: "Titre",
      render: (event: Event) => (
        <div className="font-semibold text-gray-900">{event.title}</div>
      ),
      sortable: true,
    },
    {
      key: "eventType",
      header: "Type",
      render: (event: Event) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
            event.eventType
          )}`}
        >
          {getEventTypeLabel(event.eventType)}
        </span>
      ),
      sortable: true,
    },
    {
      key: "startDate",
      header: "Date de début",
      render: (event: Event) => (
        <div className="text-sm text-gray-600">
          {new Date(event.startDate).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      ),
      sortable: true,
    },
    {
      key: "endDate",
      header: "Date de fin",
      render: (event: Event) => (
        <div className="text-sm text-gray-600">
          {event.endDate
            ? new Date(event.endDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </div>
      ),
      sortable: true,
    },
    {
      key: "class",
      header: "Classe",
      render: (event: Event) => (
        <div className="text-sm text-gray-600">
          {event.class ? event.class.name : "Toutes les classes"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (event: Event) => (
        <TableActions
          onView={() => setSelectedEvent(event)}
          onEdit={() => navigate(`/calendar/events?edit=${event.id}`)}
          onDelete={() => {
            setEventToDelete(event);
            setShowDeleteDialog(true);
          }}
        />
      ),
    },
  ];

  const tabs = [
    {
      id: "schedules" as TabType,
      label: "Emplois du temps",
      icon: Clock,
      count: timetablesCount,
    },
    {
      id: "events" as TabType,
      label: "Événements",
      icon: CalendarDays,
      count: eventsCount,
    },
  ];

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <PageHeader
          title="Calendrier"
          subtitle="Gérez les emplois du temps et les événements de l'établissement"
          icon={Calendar}
          iconColor="from-blue-600 to-blue-800"
          actions={
            activeTab === "schedules" ? (
              <HeaderActionButton
                onClick={() => navigate("/calendar/timetables")}
                icon={Plus}
                label="Nouvel emploi du temps"
              />
            ) : (
              <HeaderActionButton
                onClick={() => navigate("/calendar/events")}
                icon={Plus}
                label="Nouvel événement"
              />
            )
          }
        />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {activeTab === "schedules" ? (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Emplois du temps
                </h2>
                <p className="text-gray-600 mt-1">
                  Créez et gérez les emplois du temps des classes
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">
                    Chargement des emplois du temps...
                  </p>
                </div>
              ) : timetablesCount === 0 ? (
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
                    const classTimetables = allTimetables.filter(
                      (tt) =>
                        tt.academicYearId === activeYear?.id &&
                        tt.teachingAssignment?.classSubject?.class?.id === cls.id
                    );

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
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Événements</h2>
                <p className="text-gray-600 mt-1">
                  Gérez les événements de l'établissement (journées sport,
                  propreté, etc.)
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement des événements...</p>
                </div>
              ) : (
                <DataTable
                  data={events.sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime()
                  )}
                  columns={eventColumns}
                  searchPlaceholder="Rechercher un événement..."
                  searchKeys={["title", "description"]}
                  pageSize={10}
                  emptyMessage="Aucun événement créé"
                  emptyIcon={<CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails d'événement */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="space-y-6">
            {/* Type et badges */}
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

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
        </Modal>
      )}

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setEventToDelete(null);
        }}
        onConfirm={handleDeleteEvent}
        title="Supprimer l'événement"
        message={`Êtes-vous sûr de vouloir supprimer l'événement "${eventToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </AuthenticatedPage>
  );
};

export default CalendarPage;
