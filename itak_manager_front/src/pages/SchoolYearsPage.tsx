import React, { useState, useEffect, useCallback } from "react";
import AuthenticatedPage from "../components/layout/AuthenticatedPage";
import PageHeader from "../components/ui/PageHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { HeaderActionButton } from "../components/ui/ActionButton";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { FormInput } from "../components/form";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";
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
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteTermDialog, setShowDeleteTermDialog] = useState(false);
  
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<SchoolYear | null>(null);
  const [editingSchoolYear, setEditingSchoolYear] = useState<SchoolYear | null>(null);
  const [schoolYearToDelete, setSchoolYearToDelete] = useState<SchoolYear | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [termToDelete, setTermToDelete] = useState<Term | null>(null);

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
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  // Fonction pour compter les trimestres d'une année scolaire
  const getTermsCount = (schoolYearId: string): number => {
    return allTerms.filter((term) => term.schoolYearId === schoolYearId).length;
  };

  const handleCreateSchoolYear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Veuillez remplir le nom de l'année scolaire");
      return;
    }

    // Vérifier les dates seulement si elles sont toutes les deux fournies
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        alert("La date de fin doit être postérieure à la date de début");
        return;
      }
    }

    try {
      setActionLoading(true);
      const dataToSend: CreateSchoolYearDto = {
        name: formData.name,
        startDate: formData.startDate || new Date().toISOString().split("T")[0],
        endDate: formData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      };

      if (formData.startDate) {
        dataToSend.startDate = formData.startDate;
      }
      if (formData.endDate) {
        dataToSend.endDate = formData.endDate;
      }

      if (formData.isActive !== undefined) {
        dataToSend.isActive = formData.isActive;
      }

      const response = await apiService.createSchoolYear(dataToSend);

      if (response.success && response.data) {
        setSchoolYears([...schoolYears, response.data]);
        setShowCreateModal(false);
        setFormData({ name: "", startDate: "", endDate: "", isActive: true });
        await fetchSchoolYears();
      } else {
        alert(response.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création de l'année scolaire");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSchoolYear = (schoolYear: SchoolYear) => {
    setEditingSchoolYear(schoolYear);
    let startDate = "";
    let endDate = "";

    if (schoolYear.startDate) {
      if (schoolYear.startDate instanceof Date) {
        startDate = schoolYear.startDate.toISOString().split("T")[0];
      } else {
        startDate = new Date(schoolYear.startDate).toISOString().split("T")[0];
      }
    }

    if (schoolYear.endDate) {
      if (schoolYear.endDate instanceof Date) {
        endDate = schoolYear.endDate.toISOString().split("T")[0];
      } else {
        endDate = new Date(schoolYear.endDate).toISOString().split("T")[0];
      }
    }

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

    if (!editingSchoolYear || !editFormData.name) {
      alert("Veuillez remplir le nom de l'année scolaire");
      return;
    }

    if (editFormData.startDate && editFormData.endDate) {
      if (new Date(editFormData.startDate) >= new Date(editFormData.endDate)) {
        alert("La date de fin doit être postérieure à la date de début");
        return;
      }
    }

    try {
      setActionLoading(true);
      // Nettoyer les données : ne garder que les champs avec des valeurs
      const dataToSend: UpdateSchoolYearDto = {
        name: editFormData.name,
        isActive: editFormData.isActive,
      };

      // Ajouter les dates seulement si elles sont fournies et non vides
      if (editFormData.startDate && editFormData.startDate.trim() !== "") {
        dataToSend.startDate = editFormData.startDate;
      }
      if (editFormData.endDate && editFormData.endDate.trim() !== "") {
        dataToSend.endDate = editFormData.endDate;
      }

      const response = await apiService.updateSchoolYear(
        editingSchoolYear.id,
        dataToSend
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
        await fetchSchoolYears();
      } else {
        alert(response.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de l'année scolaire");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSchoolYear = async () => {
    if (!schoolYearToDelete) return;
    
    try {
      setActionLoading(true);
      const response = await apiService.deleteSchoolYear(schoolYearToDelete.id);
      if (response.success) {
        setSchoolYears(schoolYears.filter((year) => year.id !== schoolYearToDelete.id));
        setShowDeleteDialog(false);
        setSchoolYearToDelete(null);
        await fetchSchoolYears();
      } else {
        alert(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenTermsModal = async (schoolYear: SchoolYear) => {
    setSelectedSchoolYear(schoolYear);
    setShowTermsModal(true);
    setLoadingTerms(true);

    try {
      const response = await apiService.getTermsBySchoolYear(schoolYear.id);

      if (!response.success) {
        const allTermsResponse = await apiService.getAllTerms();
        if (allTermsResponse.success && allTermsResponse.data) {
          const filteredTerms = allTermsResponse.data.filter(
            (term) => term.schoolYearId === schoolYear.id
          );
          setTerms(filteredTerms);
        } else {
          setTerms([]);
        }
      } else if (response.success && response.data) {
        setTerms(response.data);
      } else {
        setTerms([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des trimestres:", error);
      setTerms([]);
    } finally {
      setLoadingTerms(false);
    }
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termFormData.name || !termFormData.startDate || !termFormData.endDate) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (new Date(termFormData.startDate) >= new Date(termFormData.endDate)) {
      alert("La date de fin doit être postérieure à la date de début");
      return;
    }

    const orderNumberExists = terms.some(
      (term) => term.orderNumber === termFormData.orderNumber
    );

    if (orderNumberExists) {
      alert(`Le numéro d'ordre ${termFormData.orderNumber} est déjà utilisé.`);
      return;
    }

    try {
      setActionLoading(true);
      const dataToSend = {
        ...termFormData,
        schoolYearId: selectedSchoolYear!.id,
      };

      const response = await apiService.createTerm(dataToSend);

      if (response.success && response.data) {
        const updatedTerms = [...terms, response.data];
        setTerms(updatedTerms);
        setAllTerms([...allTerms, response.data]);

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
        await fetchSchoolYears();
      } else {
        alert(response.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création du trimestre");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTerm = (term: Term) => {
    setEditingTerm(term);
    let startDate = "";
    let endDate = "";

    if (term.startDate) {
      if (term.startDate instanceof Date) {
        startDate = term.startDate.toISOString().split("T")[0];
      } else {
        const date = new Date(term.startDate);
        if (!isNaN(date.getTime())) {
          startDate = date.toISOString().split("T")[0];
        }
      }
    }

    if (term.endDate) {
      if (term.endDate instanceof Date) {
        endDate = term.endDate.toISOString().split("T")[0];
      } else {
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
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const startDateObj = new Date(editTermFormData.startDate);
    const endDateObj = new Date(editTermFormData.endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      alert("Les dates saisies ne sont pas valides");
      return;
    }

    if (startDateObj >= endDateObj) {
      alert("La date de fin doit être postérieure à la date de début");
      return;
    }

    const orderNumberExists = terms.some(
      (term) =>
        term.orderNumber === editTermFormData.orderNumber &&
        term.id !== editingTerm.id
    );

    if (orderNumberExists) {
      alert(`Le numéro d'ordre ${editTermFormData.orderNumber} est déjà utilisé.`);
      return;
    }

    try {
      setActionLoading(true);
      const dataToSend: UpdateTermDto = {
        name: editTermFormData.name || editingTerm.name,
        startDate: editTermFormData.startDate,
        endDate: editTermFormData.endDate,
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

      const response = await apiService.updateTerm(editingTerm.id, dataToSend);

      if (response.success && response.data) {
        const updatedTerms = terms.map((term) =>
          term.id === editingTerm.id ? response.data! : term
        );
        setTerms(updatedTerms);
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
        await fetchSchoolYears();
      } else {
        alert(response.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du trimestre");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTerm = async () => {
    if (!termToDelete) return;
    
    try {
      setActionLoading(true);
      const response = await apiService.deleteTerm(termToDelete.id);
      if (response.success) {
        setTerms(terms.filter((term) => term.id !== termToDelete.id));
        setAllTerms(allTerms.filter((term) => term.id !== termToDelete.id));
        setShowDeleteTermDialog(false);
        setTermToDelete(null);
        await fetchSchoolYears();
      } else {
        alert(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <PageHeader
          title="Années scolaires"
          subtitle="Gérez les années scolaires et configurez leurs trimestres"
          icon={GraduationCap}
          iconColor="from-blue-600 to-indigo-600"
          actions={
            <HeaderActionButton
              onClick={() => setShowCreateModal(true)}
              icon={Plus}
              label="Nouvelle année scolaire"
            />
          }
        />

        {/* Liste des années scolaires */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {loading && schoolYears.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Chargement des années scolaires...</p>
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
                {schoolYears.map((schoolYear) => {
                  const hasDates = schoolYear.startDate && schoolYear.endDate;
                  return (
                    <div
                      key={schoolYear.id}
                      className={`flex items-center justify-between p-6 rounded-lg border ${
                        hasDates
                          ? "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                          : "bg-gradient-to-r from-red-50 to-red-100 border-red-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          hasDates ? "bg-blue-100" : "bg-red-200"
                        }`}>
                          <GraduationCap className={`w-6 h-6 ${
                            hasDates ? "text-blue-600" : "text-red-600"
                          }`} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            hasDates ? "text-gray-900" : "text-red-900"
                          }`}>
                            {schoolYear.name}
                          </h3>
                          <div className={`flex items-center gap-4 text-sm mt-1 ${
                            hasDates ? "text-gray-600" : "text-red-700"
                          }`}>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {hasDates ? (
                                <>
                                  {new Date(schoolYear.startDate!).toLocaleDateString()}{" "}
                                  - {new Date(schoolYear.endDate!).toLocaleDateString()}
                                </>
                              ) : (
                                "Dates non définies"
                              )}
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
                          onClick={() => {
                            setSchoolYearToDelete(schoolYear);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création d'année scolaire */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setFormData({ name: "", startDate: "", endDate: "", isActive: true });
        }}
        title="Créer une année scolaire"
        size="md"
      >
        <form onSubmit={handleCreateSchoolYear} className="space-y-4">
          <FormInput
            label="Nom de l'année scolaire"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Ex: Année scolaire 2024-2025"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Date de début (optionnel)"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <FormInput
              label="Date de fin (optionnel)"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
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
              onClick={() => {
                setShowCreateModal(false);
                setFormData({ name: "", startDate: "", endDate: "", isActive: true });
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={actionLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {actionLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de modification d'année scolaire */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSchoolYear(null);
          setEditFormData({
            name: "",
            startDate: "",
            endDate: "",
            isActive: true,
          });
        }}
        title="Modifier l'année scolaire"
        size="md"
      >
        <form onSubmit={handleUpdateSchoolYear} className="space-y-4">
          <FormInput
            label="Nom de l'année scolaire"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({ ...editFormData, name: e.target.value })
            }
            placeholder="Ex: Année scolaire 2024-2025"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Date de début (optionnel)"
              type="date"
              value={editFormData.startDate || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  startDate: e.target.value,
                })
              }
            />
            <FormInput
              label="Date de fin (optionnel)"
              type="date"
              value={editFormData.endDate || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  endDate: e.target.value,
                })
              }
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
              disabled={actionLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {actionLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de configuration des trimestres */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => {
          setShowTermsModal(false);
          setSelectedSchoolYear(null);
          setTerms([]);
          setEditingTerm(null);
        }}
        title="Configuration des trimestres"
        subtitle={selectedSchoolYear?.name}
        size="full"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulaire de création */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTerm ? "Modifier le trimestre" : "Ajouter un trimestre"}
            </h3>
            <form
              onSubmit={editingTerm ? handleUpdateTerm : handleCreateTerm}
              className="space-y-4"
            >
              <FormInput
                label="Nom du trimestre ou du semestre"
                value={
                  editingTerm ? editTermFormData.name : termFormData.name
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
                <FormInput
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
                <FormInput
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
                <FormInput
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
                  disabled={actionLoading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 ${
                    editingTerm ? "flex-1" : ""
                  }`}
                >
                  {actionLoading
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
                  <div className="rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">
                    Chargement des trimestres...
                  </p>
                </div>
              ) : terms.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Aucun trimestre créé</p>
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
                          <p className="font-semibold text-gray-900">{term.name}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(term.startDate).toLocaleDateString()} -{" "}
                            {new Date(term.endDate).toLocaleDateString()}
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
                          onClick={() => {
                            setTermToDelete(term);
                            setShowDeleteTermDialog(true);
                          }}
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
      </Modal>

      {/* Dialog de confirmation de suppression d'année scolaire */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSchoolYearToDelete(null);
        }}
        onConfirm={handleDeleteSchoolYear}
        title="Supprimer l'année scolaire"
        message={`Êtes-vous sûr de vouloir supprimer l'année scolaire "${schoolYearToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={actionLoading}
      />

      {/* Dialog de confirmation de suppression de trimestre */}
      <ConfirmDialog
        isOpen={showDeleteTermDialog}
        onClose={() => {
          setShowDeleteTermDialog(false);
          setTermToDelete(null);
        }}
        onConfirm={handleDeleteTerm}
        title="Supprimer le trimestre"
        message={`Êtes-vous sûr de vouloir supprimer le trimestre "${termToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={actionLoading}
      />
    </AuthenticatedPage>
  );
};

export default SchoolYearsPage;
