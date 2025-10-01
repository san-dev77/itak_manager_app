import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {
  CalendarDays,
  Plus,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";
import {
  apiService,
  type Event,
  type CreateEventDto,
  type UpdateEventDto,
  type EventType,
  type Class,
  type SchoolYear,
} from "../../services/api";

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<Event[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  // Formulaire de création/édition
  const [formData, setFormData] = useState<CreateEventDto>({
    title: "",
    description: "",
    eventType: "other" as EventType,
    startDate: "",
    endDate: "",
    allDay: false,
    classId: "",
    createdBy: "",
    academicYearId: "",
  });

  // États pour les filtres
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>("");

  // État pour la pagination du calendrier
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData((prev) => ({ ...prev, createdBy: parsedUser.id }));
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, classesRes, schoolYearsRes] = await Promise.all([
        apiService.getAllEvents(),
        apiService.getAllClasses(),
        apiService.getAllSchoolYears(),
      ]);

      if (eventsRes.success) setEvents(eventsRes.data || []);
      if (classesRes.success) setClasses(classesRes.data || []);
      if (schoolYearsRes.success) {
        setSchoolYears(schoolYearsRes.data || []);
        // Sélectionner automatiquement l'année active
        const activeYear = schoolYearsRes.data?.find((year) => year.isActive);
        if (activeYear) {
          setSelectedSchoolYear(activeYear.id);
          setFormData((prev) => ({ ...prev, academicYearId: activeYear.id }));
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      showNotificationMessage("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const showNotificationMessage = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate || !formData.academicYearId) {
      showNotificationMessage(
        "Veuillez remplir tous les champs obligatoires",
        "error"
      );
      return;
    }

    try {
      let response;
      if (editingEvent) {
        response = await apiService.updateEvent(
          editingEvent.id,
          formData as UpdateEventDto
        );
      } else {
        response = await apiService.createEvent(formData);
      }

      if (response.success) {
        showNotificationMessage(
          editingEvent
            ? "Événement modifié avec succès"
            : "Événement créé avec succès",
          "success"
        );
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingEvent(null);
        resetForm();
        loadData();
      } else {
        showNotificationMessage("Erreur lors de la sauvegarde", "error");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      showNotificationMessage("Erreur lors de la sauvegarde", "error");
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      eventType: event.eventType,
      startDate:
        typeof event.startDate === "string"
          ? event.startDate.split("T")[0]
          : new Date(event.startDate).toISOString().split("T")[0],
      endDate: event.endDate
        ? typeof event.endDate === "string"
          ? event.endDate.split("T")[0]
          : new Date(event.endDate).toISOString().split("T")[0]
        : "",
      allDay: event.allDay,
      classId: event.classId || "",
      createdBy: event.createdBy,
      academicYearId: event.academicYearId,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        const response = await apiService.deleteEvent(eventId);
        if (response.success) {
          showNotificationMessage("Événement supprimé avec succès", "success");
          loadData();
        } else {
          showNotificationMessage("Erreur lors de la suppression", "error");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        showNotificationMessage("Erreur lors de la suppression", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      eventType: "other" as EventType,
      startDate: "",
      endDate: "",
      allDay: false,
      classId: "",
      createdBy: user?.id || "",
      academicYearId: selectedSchoolYear,
    });
  };

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

  // Filtrer les événements
  const filteredEvents = events.filter((event) => {
    if (selectedSchoolYear && event.academicYearId !== selectedSchoolYear)
      return false;
    if (selectedClass && event.classId !== selectedClass) return false;
    if (selectedEventType && event.eventType !== selectedEventType)
      return false;
    return true;
  });

  // Obtenir les mois disponibles (mois contenant des événements)
  const getAvailableMonths = () => {
    if (filteredEvents.length === 0) return [];

    const monthsSet = new Set<string>();
    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.startDate);
      const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}`;
      monthsSet.add(monthKey);

      // Ajouter aussi le mois de fin si différent
      if (event.endDate) {
        const endDate = new Date(event.endDate);
        const endMonthKey = `${endDate.getFullYear()}-${endDate.getMonth()}`;
        monthsSet.add(endMonthKey);
      }
    });

    return Array.from(monthsSet)
      .map((monthKey) => {
        const [year, month] = monthKey.split("-").map(Number);
        return new Date(year, month, 1);
      })
      .sort((a, b) => a.getTime() - b.getTime());
  };

  // Générer la liste des jours avec événements pour le mois sélectionné
  const generateEventDays = () => {
    const availableMonths = getAvailableMonths();
    if (availableMonths.length === 0) return [];

    const currentMonth = availableMonths[currentMonthIndex];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Filtrer les événements pour le mois sélectionné
    const monthEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });

    // Créer un Set pour éviter les doublons de dates
    const datesSet = new Set<string>();

    monthEvents.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;

      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        datesSet.add(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Convertir en tableau et trier
    const eventDays = Array.from(datesSet)
      .map((dateStr) => {
        const dayEvents = filteredEvents.filter((event) => {
          const eventStart = new Date(event.startDate)
            .toISOString()
            .split("T")[0];
          const eventEnd = event.endDate
            ? new Date(event.endDate).toISOString().split("T")[0]
            : eventStart;
          return dateStr >= eventStart && dateStr <= eventEnd;
        });

        return {
          date: new Date(dateStr),
          dateStr,
          events: dayEvents,
          isToday: dateStr === new Date().toISOString().split("T")[0],
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return eventDays;
  };

  // Navigation entre les mois
  const goToPreviousMonth = () => {
    setCurrentMonthIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextMonth = () => {
    const availableMonths = getAvailableMonths();
    setCurrentMonthIndex((prev) =>
      Math.min(availableMonths.length - 1, prev + 1)
    );
  };

  const goToMonthIndex = (index: number) => {
    setCurrentMonthIndex(index);
  };

  const availableMonths = getAvailableMonths();

  // Réinitialiser l'index si nécessaire
  React.useEffect(() => {
    if (
      availableMonths.length > 0 &&
      currentMonthIndex >= availableMonths.length
    ) {
      setCurrentMonthIndex(0);
    }
  }, [availableMonths.length, currentMonthIndex]);

  const eventDays = generateEventDays();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
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
                  <h1 className="text-xl font-semibold text-gray-900">
                    Gestion des événements
                  </h1>
                  <p className="text-sm text-gray-600">
                    Créez et gérez les événements de l'école
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Plus className="w-4 h-4" />
                Nouvel événement
              </Button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Filtres
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année scolaire
                </label>
                <select
                  value={selectedSchoolYear}
                  onChange={(e) => setSelectedSchoolYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Toutes les années</option>
                  {schoolYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'événement
                </label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Tous les types</option>
                  <option value="exam">Examen</option>
                  <option value="homework">Devoir</option>
                  <option value="cultural_day">Journée culturelle</option>
                  <option value="health_day">Journée santé</option>
                  <option value="ball">Bal</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calendrier des événements */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Calendrier des événements ({filteredEvents.length})
                </h2>

                {/* Navigation du calendrier */}
                {availableMonths.length > 0 && (
                  <div className="flex items-center gap-4">
                    {/* Sélecteur de mois rapide */}
                    <select
                      value={currentMonthIndex}
                      onChange={(e) => goToMonthIndex(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
                    >
                      {availableMonths.map((month, index) => (
                        <option key={index} value={index}>
                          {month.toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </option>
                      ))}
                    </select>

                    {/* Boutons de navigation */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={goToPreviousMonth}
                        variant="outline"
                        size="sm"
                        className="p-2"
                        disabled={currentMonthIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
                        {availableMonths[currentMonthIndex]?.toLocaleDateString(
                          "fr-FR",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <Button
                        onClick={goToNextMonth}
                        variant="outline"
                        size="sm"
                        className="p-2"
                        disabled={
                          currentMonthIndex === availableMonths.length - 1
                        }
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Indicateur de position */}
                    <span className="text-xs text-gray-500">
                      {currentMonthIndex + 1} / {availableMonths.length}
                    </span>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">
                    Chargement des événements...
                  </p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun événement
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {selectedSchoolYear || selectedClass || selectedEventType
                      ? "Aucun événement ne correspond aux filtres sélectionnés"
                      : "Commencez par créer votre premier événement"}
                  </p>
                  <Button
                    onClick={() => {
                      resetForm();
                      setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Créer un événement
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {/* En-têtes des jours */}
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded"
                      >
                        {day}
                      </div>
                    )
                  )}

                  {/* Jours avec événements uniquement */}
                  {eventDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border rounded ${
                        day.isToday
                          ? "bg-blue-50 border-blue-300"
                          : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          day.isToday ? "text-blue-600" : "text-gray-900"
                        }`}
                      >
                        {day.date.getDate()}
                        {day.isToday && (
                          <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">
                            Aujourd'hui
                          </span>
                        )}
                      </div>

                      {/* Événements du jour */}
                      <div className="space-y-1">
                        {day.events.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(
                              event.eventType
                            )} group relative`}
                            onClick={() => handleEdit(event)}
                            title={`${event.title} - ${getEventTypeLabel(
                              event.eventType
                            )}`}
                          >
                            <div className="font-medium truncate">
                              {event.title}
                            </div>
                            {event.class && (
                              <div className="text-xs opacity-75 truncate">
                                {event.class.name}
                              </div>
                            )}
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(event.id);
                                }}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {day.events.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{day.events.length - 3} autres
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {eventDays.length === 0 && (
                    <div className="col-span-7 text-center py-12 text-gray-500">
                      <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun événement ce mois-ci
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Créez votre premier événement pour ce mois
                      </p>
                      <Button
                        onClick={() => {
                          resetForm();
                          setShowCreateModal(true);
                        }}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Créer un événement
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de création/édition */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingEvent ? "Modifier l'événement" : "Nouvel événement"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingEvent(null);
                      resetForm();
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
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Titre de l'événement"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Description de l'événement"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'événement *
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            eventType: e.target.value as EventType,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                      >
                        <option value="exam">Examen</option>
                        <option value="homework">Devoir</option>
                        <option value="cultural_day">Journée culturelle</option>
                        <option value="health_day">Journée santé</option>
                        <option value="ball">Bal</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Classe
                      </label>
                      <select
                        value={formData.classId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            classId: e.target.value,
                          }))
                        }
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début *
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin
                      </label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="allDay"
                      checked={formData.allDay}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          allDay: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="allDay"
                      className="text-sm font-medium text-gray-700"
                    >
                      Événement toute la journée
                    </label>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setEditingEvent(null);
                        resetForm();
                      }}
                      variant="outline"
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingEvent ? "Modifier" : "Créer"}
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
            type={notificationType}
            title={notificationType === "success" ? "Succès" : "Erreur"}
            message={notificationMessage}
            isVisible={showNotification}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
