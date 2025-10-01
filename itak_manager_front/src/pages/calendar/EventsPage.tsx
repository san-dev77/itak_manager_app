import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Notification from "../../components/ui/Notification";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "sport" | "proprete" | "culturel" | "academique" | "autre";
  isRecurring: boolean;
  createdAt: string;
}

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  // Formulaire de création
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "autre" as Event["type"],
    isRecurring: false,
  });

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

  const showNotificationMessage = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getEventTypeColor = (type: Event["type"]) => {
    const colors = {
      sport: "bg-green-100 text-green-800",
      proprete: "bg-blue-100 text-blue-800",
      culturel: "bg-purple-100 text-purple-800",
      academique: "bg-orange-100 text-orange-800",
      autre: "bg-gray-100 text-gray-800",
    };
    return colors[type];
  };

  const getEventTypeLabel = (type: Event["type"]) => {
    const labels = {
      sport: "Sport",
      proprete: "Propreté",
      culturel: "Culturel",
      academique: "Académique",
      autre: "Autre",
    };
    return labels[type];
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time) {
      showNotificationMessage(
        "Veuillez remplir les champs obligatoires",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      // Simulation de création d'événement
      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        type: formData.type,
        isRecurring: formData.isRecurring,
        createdAt: new Date().toISOString(),
      };

      setEvents([...events, newEvent]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        type: "autre",
        isRecurring: false,
      });
      showNotificationMessage("Événement créé avec succès", "success");
    } catch {
      showNotificationMessage(
        "Erreur lors de la création de l'événement",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      setEvents(events.filter((event) => event.id !== id));
      showNotificationMessage("Événement supprimé avec succès", "success");
    }
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
              onClick={() => navigate("/calendar")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
              <p className="text-gray-600 mt-1">
                Gérez les événements de l'établissement (journées sport,
                propreté, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {events.length} événement{events.length > 1 ? "s" : ""}
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Nouvel événement
          </Button>
        </div>

        {/* Liste des événements */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {events.length === 0 ? (
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
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Créer un événement
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {getEventTypeLabel(event.type)}
                      </span>
                      {event.isRecurring && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Récurrent
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de création */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Créer un événement
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
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

                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <Input
                    label="Titre de l'événement"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ex: Journée sportive"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description de l'événement..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Heure"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Lieu"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Ex: Terrain de sport, Salle de classe..."
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type d'événement
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as Event["type"],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sport">Sport</option>
                      <option value="proprete">Propreté</option>
                      <option value="culturel">Culturel</option>
                      <option value="academique">Académique</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isRecurring: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isRecurring"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Événement récurrent
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Création..." : "Créer"}
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

export default EventsPage;
