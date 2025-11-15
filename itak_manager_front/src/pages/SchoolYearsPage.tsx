import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Notification from "../components/ui/Notification";
import ErrorModal from "../components/ui/ErrorModal";
import {
  apiService,
  type SchoolYear,
  type CreateSchoolYearDto,
  type UpdateSchoolYearDto,
  type Term,
  type CreateTermDto,
  type UpdateTermDto,
} from "../services/api";

const SchoolYearsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedSchoolYear, setSelectedSchoolYear] =
    useState<SchoolYear | null>(null);
  const [editingSchoolYear, setEditingSchoolYear] = useState<SchoolYear | null>(
    null
  );
  const [terms, setTerms] = useState<Term[]>([]);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
    details?: string;
    statusCode?: number;
  }>({
    isOpen: false,
    message: "",
  });

  // Formulaire de création d'année scolaire
  const [formData, setFormData] = useState<CreateSchoolYearDto>({
    name: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Formulaire de modification d'année scolaire
  const [editFormData, setEditFormData] = useState<UpdateSchoolYearDto>({
    name: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Formulaire de création de trimestre
  const [termFormData, setTermFormData] = useState<CreateTermDto>({
    schoolYearId: "",
    name: "",
    startDate: "",
    endDate: "",
    isActive: true,
    orderNumber: 1,
  });

  // Formulaire de modification de trimestre
  const [editTermFormData, setEditTermFormData] = useState<UpdateTermDto>({
    schoolYearId: "",
    name: "",
    startDate: "",
    endDate: "",
    isActive: true,
    orderNumber: 1,
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

  const fetchSchoolYears = useCallback(async () => {
    try {
      setLoading(true);
      const [schoolYearsRes, allTermsRes] = await Promise.all([
        apiService.getAllSchoolYears(),
        apiService.getAllTerms(),
      ]);

      if (schoolYearsRes.success && schoolYearsRes.data) {
        setSchoolYears(schoolYearsRes.data);
      }

      if (allTermsRes.success && allTermsRes.data) {
        setAllTerms(allTermsRes.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des années scolaires:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSchoolYears();
    }
  }, [user, fetchSchoolYears]);

  const showNotificationMessage = (
    message: string,
    type: "success" | "error"
  ) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Fonction pour compter les trimestres d'une année scolaire
  const getTermsCount = (schoolYearId: string): number => {
    return allTerms.filter((term) => term.schoolYearId === schoolYearId).length;
  };

  const handleCreateSchoolYear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.startDate || !formData.endDate) {
      showNotificationMessage("Veuillez remplir tous les champs", "error");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      showNotificationMessage(
        "La date de fin doit être postérieure à la date de début",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      // Préparer les données en ne gardant que les champs nécessaires
      const dataToSend: CreateSchoolYearDto = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      // Ajouter isActive seulement s'il est explicitement défini
      if (formData.isActive !== undefined) {
        dataToSend.isActive = formData.isActive;
      }

      console.log("📤 Envoi des données:", dataToSend);
      const response = await apiService.createSchoolYear(dataToSend);
      console.log("📥 Réponse reçue:", response);

      if (response.success && response.data) {
        setSchoolYears([...schoolYears, response.data]);
        setShowCreateModal(false);
        setFormData({ name: "", startDate: "", endDate: "", isActive: true });
        showNotificationMessage("Année scolaire créée avec succès", "success");
      } else {
        console.error("❌ Erreur dans la réponse:", response);
        showNotificationMessage(
          response.message ||
            response.error ||
            "Erreur lors de la création de l'année scolaire",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Exception capturée:", error);
      showNotificationMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de l'année scolaire",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchoolYear = (schoolYear: SchoolYear) => {
    setEditingSchoolYear(schoolYear);
    // Convertir les dates en format YYYY-MM-DD pour les inputs
    const startDate =
      schoolYear.startDate instanceof Date
        ? schoolYear.startDate.toISOString().split("T")[0]
        : new Date(schoolYear.startDate).toISOString().split("T")[0];
    const endDate =
      schoolYear.endDate instanceof Date
        ? schoolYear.endDate.toISOString().split("T")[0]
        : new Date(schoolYear.endDate).toISOString().split("T")[0];

    setEditFormData({
      name: schoolYear.name,
      startDate: startDate,
      endDate: endDate,
      isActive: schoolYear.isActive,
    });
    setShowEditModal(true);
  };

  const handleUpdateSchoolYear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSchoolYear) return;

    if (
      !editFormData.name ||
      !editFormData.startDate ||
      !editFormData.endDate
    ) {
      showNotificationMessage("Veuillez remplir tous les champs", "error");
      return;
    }

    if (new Date(editFormData.startDate) >= new Date(editFormData.endDate)) {
      showNotificationMessage(
        "La date de fin doit être postérieure à la date de début",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.updateSchoolYear(
        editingSchoolYear.id,
        editFormData
      );

      if (response.success && response.data) {
        setSchoolYears(
          schoolYears.map((year) =>
            year.id === editingSchoolYear.id ? response.data! : year
          )
        );
        setShowEditModal(false);
        setEditingSchoolYear(null);
        setEditFormData({
          name: "",
          startDate: "",
          endDate: "",
          isActive: true,
        });
        showNotificationMessage(
          "Année scolaire mise à jour avec succès",
          "success"
        );
      } else {
        // Détecter spécifiquement les erreurs 404 et autres
        if (response.statusCode === 404) {
          setErrorModal({
            isOpen: true,
            message: response.error || "L'année scolaire n'a pas été trouvée",
            details: response.error,
            statusCode: 404,
          });
        } else {
          setErrorModal({
            isOpen: true,
            message:
              response.message ||
              response.error ||
              "Erreur lors de la mise à jour de l'année scolaire",
            details: response.error,
            statusCode: response.statusCode,
          });
        }
      }
    } catch (error) {
      console.error("❌ Exception capturée:", error);
      setErrorModal({
        isOpen: true,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour de l'année scolaire",
        details: error instanceof Error ? error.stack : undefined,
        statusCode: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchoolYear = async (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette année scolaire ?"
      )
    ) {
      try {
        const response = await apiService.deleteSchoolYear(id);
        if (response.success) {
          setSchoolYears(schoolYears.filter((year) => year.id !== id));
          showNotificationMessage(
            "Année scolaire supprimée avec succès",
            "success"
          );
        } else {
          showNotificationMessage(
            response.message || "Erreur lors de la suppression",
            "error"
          );
        }
      } catch {
        showNotificationMessage("Erreur lors de la suppression", "error");
      }
    }
  };

  const handleOpenTermsModal = async (schoolYear: SchoolYear) => {
    console.log("📖 Ouverture de la modal pour l'année:", schoolYear);
    setSelectedSchoolYear(schoolYear);
    setShowTermsModal(true);
    setLoadingTerms(true);

    try {
      console.log(
        "🔍 Récupération des trimestres pour l'année ID:",
        schoolYear.id
      );

      // Essayer d'abord l'endpoint spécifique
      const response = await apiService.getTermsBySchoolYear(schoolYear.id);
      console.log("📥 Réponse de l'endpoint spécifique:", response);

      // Si l'endpoint spécifique échoue, récupérer tous les trimestres et filtrer
      if (!response.success) {
        console.log(
          "⚠️ Endpoint spécifique non disponible, récupération de tous les trimestres..."
        );
        const allTermsResponse = await apiService.getAllTerms();
        console.log("📥 Tous les trimestres:", allTermsResponse);

        if (allTermsResponse.success && allTermsResponse.data) {
          // Filtrer les trimestres pour cette année scolaire
          const filteredTerms = allTermsResponse.data.filter(
            (term) => term.schoolYearId === schoolYear.id
          );
          console.log("🔍 Trimestres filtrés:", filteredTerms);
          setTerms(filteredTerms);
        } else {
          setTerms([]);
        }
      } else if (response.success && response.data) {
        console.log("✅ Trimestres chargés:", response.data);
        setTerms(response.data);
      } else {
        console.warn("⚠️ Aucun trimestre trouvé:", response);
        setTerms([]);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des trimestres:", error);
      setTerms([]);
      showNotificationMessage(
        "Erreur lors du chargement des trimestres",
        "error"
      );
    } finally {
      setLoadingTerms(false);
    }
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !termFormData.name ||
      !termFormData.startDate ||
      !termFormData.endDate
    ) {
      showNotificationMessage(
        "Veuillez remplir tous les champs obligatoires",
        "error"
      );
      return;
    }

    if (new Date(termFormData.startDate) >= new Date(termFormData.endDate)) {
      showNotificationMessage(
        "La date de fin doit être postérieure à la date de début",
        "error"
      );
      return;
    }

    // Vérifier si le numéro d'ordre existe déjà
    const orderNumberExists = terms.some(
      (term) => term.orderNumber === termFormData.orderNumber
    );

    if (orderNumberExists) {
      showNotificationMessage(
        `Le numéro d'ordre ${termFormData.orderNumber} est déjà utilisé. Veuillez choisir un autre numéro.`,
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...termFormData,
        schoolYearId: selectedSchoolYear!.id,
      };

      const response = await apiService.createTerm(dataToSend);

      if (response.success && response.data) {
        const updatedTerms = [...terms, response.data];
        setTerms(updatedTerms);

        // Mettre à jour aussi allTerms pour le compteur global
        setAllTerms([...allTerms, response.data]);

        // Calculer le prochain numéro d'ordre disponible
        const usedNumbers = updatedTerms
          .map((t) => t.orderNumber)
          .sort((a, b) => a - b);
        let nextNumber = 1;
        for (const num of usedNumbers) {
          if (num === nextNumber) {
            nextNumber++;
          } else {
            break;
          }
        }

        setTermFormData({
          schoolYearId: selectedSchoolYear!.id,
          name: "",
          startDate: "",
          endDate: "",
          isActive: true,
          orderNumber: nextNumber,
        });
        showNotificationMessage("Trimestre créé avec succès", "success");
      } else {
        showNotificationMessage(
          response.message || "Erreur lors de la création du trimestre",
          "error"
        );
      }
    } catch {
      showNotificationMessage(
        "Erreur lors de la création du trimestre",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditTerm = (term: Term) => {
    setEditingTerm(term);
    // Convertir les dates en format YYYY-MM-DD pour les inputs
    let startDate = "";
    let endDate = "";

    if (term.startDate) {
      if (term.startDate instanceof Date) {
        startDate = term.startDate.toISOString().split("T")[0];
      } else if (typeof term.startDate === "string") {
        // Si c'est déjà une string au format ISO ou autre
        const date = new Date(term.startDate);
        if (!isNaN(date.getTime())) {
          startDate = date.toISOString().split("T")[0];
        }
      }
    }

    if (term.endDate) {
      if (term.endDate instanceof Date) {
        endDate = term.endDate.toISOString().split("T")[0];
      } else if (typeof term.endDate === "string") {
        // Si c'est déjà une string au format ISO ou autre
        const date = new Date(term.endDate);
        if (!isNaN(date.getTime())) {
          endDate = date.toISOString().split("T")[0];
        }
      }
    }

    setEditTermFormData({
      schoolYearId: term.schoolYearId,
      name: term.name || "",
      startDate: startDate,
      endDate: endDate,
      isActive: term.isActive ?? true,
      orderNumber: term.orderNumber ?? 1,
    });
  };

  const handleUpdateTerm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTerm) return;

    if (
      !editTermFormData.name ||
      !editTermFormData.startDate ||
      !editTermFormData.endDate ||
      editTermFormData.startDate.trim() === "" ||
      editTermFormData.endDate.trim() === ""
    ) {
      showNotificationMessage(
        "Veuillez remplir tous les champs obligatoires",
        "error"
      );
      return;
    }

    // Vérifier que les dates sont valides
    const startDateObj = new Date(editTermFormData.startDate);
    const endDateObj = new Date(editTermFormData.endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      showNotificationMessage("Les dates saisies ne sont pas valides", "error");
      return;
    }

    if (
      new Date(editTermFormData.startDate) >= new Date(editTermFormData.endDate)
    ) {
      showNotificationMessage(
        "La date de fin doit être postérieure à la date de début",
        "error"
      );
      return;
    }

    // Vérifier si le numéro d'ordre existe déjà (sauf pour le trimestre en cours d'édition)
    const orderNumberExists = terms.some(
      (term) =>
        term.orderNumber === editTermFormData.orderNumber &&
        term.id !== editingTerm.id
    );

    if (orderNumberExists) {
      showNotificationMessage(
        `Le numéro d'ordre ${editTermFormData.orderNumber} est déjà utilisé. Veuillez choisir un autre numéro.`,
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      // S'assurer que les dates sont au format string valide
      // Utiliser le même format que lors de la création (YYYY-MM-DD)
      const dataToSend: UpdateTermDto = {
        name: editTermFormData.name || editingTerm.name,
        startDate: editTermFormData.startDate, // Format YYYY-MM-DD comme dans la création
        endDate: editTermFormData.endDate, // Format YYYY-MM-DD comme dans la création
        schoolYearId: editTermFormData.schoolYearId || editingTerm.schoolYearId,
        isActive:
          editTermFormData.isActive !== undefined
            ? editTermFormData.isActive
            : editingTerm.isActive,
        orderNumber:
          editTermFormData.orderNumber !== undefined
            ? editTermFormData.orderNumber
            : editingTerm.orderNumber,
      };

      // Vérifier que les dates requises sont présentes et non vides
      if (
        !dataToSend.startDate ||
        !dataToSend.endDate ||
        dataToSend.startDate.trim() === "" ||
        dataToSend.endDate.trim() === ""
      ) {
        showNotificationMessage(
          "Les dates de début et de fin sont requises",
          "error"
        );
        setLoading(false);
        return;
      }

      // Vérifier que toutes les propriétés requises sont présentes
      if (
        !dataToSend.name ||
        !dataToSend.startDate ||
        !dataToSend.endDate ||
        !dataToSend.schoolYearId
      ) {
        console.error("❌ Données incomplètes:", dataToSend);
        showNotificationMessage(
          "Les données du formulaire sont incomplètes. Veuillez réessayer.",
          "error"
        );
        setLoading(false);
        return;
      }

      console.log(
        "📤 Données envoyées pour la mise à jour du trimestre:",
        JSON.stringify(dataToSend, null, 2)
      );
      console.log("📤 ID du trimestre:", editingTerm.id);
      console.log("📤 Trimestre en cours d'édition:", editingTerm);

      const response = await apiService.updateTerm(editingTerm.id, dataToSend);

      if (response.success && response.data) {
        const updatedTerms = terms.map((term) =>
          term.id === editingTerm.id ? response.data! : term
        );
        setTerms(updatedTerms);

        // Mettre à jour aussi allTerms pour le compteur global
        setAllTerms(
          allTerms.map((term) =>
            term.id === editingTerm.id ? response.data! : term
          )
        );

        setEditingTerm(null);
        setEditTermFormData({
          schoolYearId: "",
          name: "",
          startDate: "",
          endDate: "",
          isActive: true,
          orderNumber: 1,
        });
        showNotificationMessage("Trimestre mis à jour avec succès", "success");
      } else {
        // Détecter spécifiquement les erreurs 404 et autres
        if (response.statusCode === 404) {
          setErrorModal({
            isOpen: true,
            message: response.error || "Le trimestre n'a pas été trouvé",
            details: response.error,
            statusCode: 404,
          });
        } else {
          setErrorModal({
            isOpen: true,
            message:
              response.message || "Erreur lors de la mise à jour du trimestre",
            details: response.error,
            statusCode: response.statusCode,
          });
        }
      }
    } catch (error) {
      console.error("❌ Exception capturée:", error);
      setErrorModal({
        isOpen: true,
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du trimestre",
        details: error instanceof Error ? error.stack : undefined,
        statusCode: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTerm = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trimestre ?")) {
      try {
        const response = await apiService.deleteTerm(id);
        if (response.success) {
          setTerms(terms.filter((term) => term.id !== id));
          // Mettre à jour aussi allTerms pour le compteur global
          setAllTerms(allTerms.filter((term) => term.id !== id));
          showNotificationMessage("Trimestre supprimé avec succès", "success");
        } else {
          showNotificationMessage(
            response.message || "Erreur lors de la suppression",
            "error"
          );
        }
      } catch {
        showNotificationMessage("Erreur lors de la suppression", "error");
      }
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Années scolaires
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez les années scolaires et configurez leurs trimestres
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {schoolYears.length} année{schoolYears.length > 1 ? "s" : ""}{" "}
              scolaire{schoolYears.length > 1 ? "s" : ""}
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Nouvelle année scolaire
          </Button>
        </div>

        {/* Liste des années scolaires */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {loading && schoolYears.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">
                Chargement des années scolaires...
              </p>
            </div>
          ) : schoolYears.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune année scolaire créée
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par créer votre première année scolaire
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer une année scolaire
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {schoolYears.map((schoolYear) => (
                  <div
                    key={schoolYear.id}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {schoolYear.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(
                              schoolYear.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(schoolYear.endDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getTermsCount(schoolYear.id)} trimestre
                            {getTermsCount(schoolYear.id) > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          schoolYear.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {schoolYear.isActive ? "Active" : "Inactive"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenTermsModal(schoolYear)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Configurer</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSchoolYear(schoolYear)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchoolYear(schoolYear.id)}
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

        {/* Modal de création d'année scolaire */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Créer une année scolaire
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

                <form onSubmit={handleCreateSchoolYear} className="space-y-4">
                  <Input
                    label="Nom de l'année scolaire"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Année scolaire 2024-2025"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Date de début"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Date de fin"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Année scolaire active
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de modification d'année scolaire */}
        {showEditModal && editingSchoolYear && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Modifier l'année scolaire
                  </h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingSchoolYear(null);
                      setEditFormData({
                        name: "",
                        startDate: "",
                        endDate: "",
                        isActive: true,
                      });
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

                <form onSubmit={handleUpdateSchoolYear} className="space-y-4">
                  <Input
                    label="Nom de l'année scolaire"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    placeholder="Ex: Année scolaire 2024-2025"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Date de début"
                      type="date"
                      value={editFormData.startDate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          startDate: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Date de fin"
                      type="date"
                      value={editFormData.endDate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          endDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      checked={editFormData.isActive}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isActive: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="editIsActive"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Année scolaire active
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingSchoolYear(null);
                        setEditFormData({
                          name: "",
                          startDate: "",
                          endDate: "",
                          isActive: true,
                        });
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
                      {loading ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de configuration des trimestres */}
        {showTermsModal && selectedSchoolYear && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Configuration des trimestres
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedSchoolYear.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowTermsModal(false);
                      setSelectedSchoolYear(null);
                      setTerms([]);
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
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Formulaire de création */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingTerm
                        ? "Modifier le trimestre"
                        : "Ajouter un trimestre"}
                    </h3>
                    <form
                      onSubmit={
                        editingTerm ? handleUpdateTerm : handleCreateTerm
                      }
                      className="space-y-4"
                    >
                      <Input
                        label="Nom du trimestre ou du semestre"
                        value={
                          editingTerm
                            ? editTermFormData.name
                            : termFormData.name
                        }
                        onChange={(e) =>
                          editingTerm
                            ? setEditTermFormData({
                                ...editTermFormData,
                                name: e.target.value,
                              })
                            : setTermFormData({
                                ...termFormData,
                                name: e.target.value,
                              })
                        }
                        placeholder="Ex: Trimestre 1"
                        required
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Date de début"
                          type="date"
                          value={
                            editingTerm
                              ? editTermFormData.startDate
                              : termFormData.startDate
                          }
                          onChange={(e) =>
                            editingTerm
                              ? setEditTermFormData({
                                  ...editTermFormData,
                                  startDate: e.target.value,
                                })
                              : setTermFormData({
                                  ...termFormData,
                                  startDate: e.target.value,
                                })
                          }
                          required
                        />
                        <Input
                          label="Date de fin"
                          type="date"
                          value={
                            editingTerm
                              ? editTermFormData.endDate
                              : termFormData.endDate
                          }
                          onChange={(e) =>
                            editingTerm
                              ? setEditTermFormData({
                                  ...editTermFormData,
                                  endDate: e.target.value,
                                })
                              : setTermFormData({
                                  ...termFormData,
                                  endDate: e.target.value,
                                })
                          }
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Numéro d'ordre
                          </label>
                          {!editingTerm && (
                            <button
                              type="button"
                              onClick={() => {
                                const usedNumbers = terms
                                  .map((t) => t.orderNumber)
                                  .sort((a, b) => a - b);
                                let nextNumber = 1;
                                for (const num of usedNumbers) {
                                  if (num === nextNumber) {
                                    nextNumber++;
                                  } else {
                                    break;
                                  }
                                }
                                setTermFormData({
                                  ...termFormData,
                                  orderNumber: nextNumber,
                                });
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Suggérer auto
                            </button>
                          )}
                        </div>
                        <Input
                          type="number"
                          value={
                            editingTerm
                              ? editTermFormData.orderNumber || ""
                              : termFormData.orderNumber || ""
                          }
                          onChange={(e) =>
                            editingTerm
                              ? setEditTermFormData({
                                  ...editTermFormData,
                                  orderNumber: parseInt(e.target.value) || 1,
                                })
                              : setTermFormData({
                                  ...termFormData,
                                  orderNumber: parseInt(e.target.value) || 1,
                                })
                          }
                          min="1"
                          required
                          className={
                            terms.some(
                              (t) =>
                                t.orderNumber ===
                                  (editingTerm
                                    ? editTermFormData.orderNumber
                                    : termFormData.orderNumber) &&
                                t.id !== editingTerm?.id
                            )
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }
                        />
                        {terms.some(
                          (t) =>
                            t.orderNumber ===
                              (editingTerm
                                ? editTermFormData.orderNumber
                                : termFormData.orderNumber) &&
                            t.id !== editingTerm?.id
                        ) && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Ce numéro est déjà utilisé
                          </p>
                        )}
                        {terms.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Numéros utilisés:{" "}
                            {terms
                              .map((t) => t.orderNumber)
                              .sort((a, b) => a - b)
                              .join(", ")}
                          </p>
                        )}
                      </div>

                      {editingTerm && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="editTermIsActive"
                            checked={editTermFormData.isActive}
                            onChange={(e) =>
                              setEditTermFormData({
                                ...editTermFormData,
                                isActive: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="editTermIsActive"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Trimestre actif
                          </label>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {editingTerm && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingTerm(null);
                              setEditTermFormData({
                                name: "",
                                startDate: "",
                                endDate: "",
                                isActive: true,
                                orderNumber: 1,
                              });
                            }}
                            className="flex-1"
                          >
                            Annuler
                          </Button>
                        )}
                        <Button
                          type="submit"
                          disabled={loading}
                          className={`w-full bg-blue-600 hover:bg-blue-700 ${
                            editingTerm ? "flex-1" : ""
                          }`}
                        >
                          {loading
                            ? editingTerm
                              ? "Mise à jour..."
                              : "Ajout..."
                            : editingTerm
                            ? "Mettre à jour"
                            : "Ajouter le trimestre"}
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Liste des trimestres */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Trimestres ou semestres existants ({terms.length})
                    </h3>
                    <div className="space-y-3">
                      {loadingTerms ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <p className="text-gray-600 text-sm">
                            Chargement des trimestres...
                          </p>
                        </div>
                      ) : terms.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">
                            Aucun trimestre créé
                          </p>
                        </div>
                      ) : (
                        terms
                          .sort((a, b) => a.orderNumber - b.orderNumber)
                          .map((term) => (
                            <div
                              key={term.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-sm font-bold text-blue-600">
                                    {term.orderNumber}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {term.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(
                                      term.startDate
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      term.endDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    term.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {term.isActive ? "Actif" : "Inactif"}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditTerm(term)}
                                  className="text-orange-600 hover:text-orange-700"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteTerm(term.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
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

        {/* Modale d'erreur */}
        <ErrorModal
          isOpen={errorModal.isOpen}
          onClose={() => setErrorModal({ isOpen: false, message: "" })}
          title="Erreur"
          message={errorModal.message}
          details={errorModal.details}
          statusCode={errorModal.statusCode}
        />
      </div>
    </Layout>
  );
};

export default SchoolYearsPage;
