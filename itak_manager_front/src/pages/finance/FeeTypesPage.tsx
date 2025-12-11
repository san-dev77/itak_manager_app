import React, { useState, useEffect, useCallback } from "react";
import AuthenticatedPage from "../../components/layout/AuthenticatedPage";
import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";
import { HeaderActionButton } from "../../components/ui/ActionButton";
import TableActions from "../../components/ui/TableActions";
import { FormInput } from "../../components/form";
import StudentFeeAssignmentModal from "../../components/finance/StudentFeeAssignmentModal";
import { DollarSign, Plus, UserPlus } from "lucide-react";
import { apiService } from "../../services/api";

type FeeFrequency = "once" | "monthly" | "quarterly" | "yearly";

interface FeeType {
  id: string;
  name: string;
  description?: string;
  amountDefault: number;
  isRecurring: boolean;
  frequency: FeeFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const FeeTypesPage: React.FC = () => {
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFeeType, setSelectedFeeType] = useState<FeeType | null>(null);
  const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null);
  const [assigningFeeType, setAssigningFeeType] = useState<FeeType | null>(
    null
  );

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    amountDefault: number;
    isRecurring: boolean;
    frequency: FeeFrequency;
  }>({
    name: "",
    description: "",
    amountDefault: 0,
    isRecurring: false,
    frequency: "once",
  });

  const [displayAmount, setDisplayAmount] = useState("");

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("fr-FR");
  };

  const parseAmount = (value: string): number => {
    const cleanValue = value.replace(/[\s.]/g, "");
    return parseInt(cleanValue) || 0;
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseAmount(value);
    setFormData({ ...formData, amountDefault: numericValue });
    setDisplayAmount(formatAmount(numericValue));
  };

  const loadFeeTypes = useCallback(async () => {
    try {
      const response = await apiService.getAllFeeTypes();

      if (response.success && response.data) {
        setFeeTypes(response.data);
      } else {
        setFeeTypes([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des types de frais:", error);
      setFeeTypes([]);
    }
  }, []);

  useEffect(() => {
    loadFeeTypes();
  }, [loadFeeTypes]);

  const openAssignModal = (feeType: FeeType) => {
    setAssigningFeeType(feeType);
    setShowAssignModal(true);
  };

  const handleAssignSuccess = () => {
    loadFeeTypes();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const response = await apiService.createFeeType(formData);
      if (response.success) {
        setShowCreateModal(false);
        resetForm();
        await loadFeeTypes();
      } else {
        alert(response.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert("Erreur lors de la création");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (feeType: FeeType) => {
    setEditingFeeType(feeType);
    setFormData({
      name: feeType.name,
      description: feeType.description || "",
      amountDefault: feeType.amountDefault,
      isRecurring: feeType.isRecurring,
      frequency: feeType.frequency,
    });
    setDisplayAmount(formatAmount(feeType.amountDefault));
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeeType) return;

    // S'assurer que le montant est valide et positif
    // Convertir en nombre si nécessaire et utiliser la valeur originale comme fallback
    const currentAmount =
      typeof formData.amountDefault === "number"
        ? formData.amountDefault
        : Number(formData.amountDefault) || editingFeeType.amountDefault;

    const amountToSend =
      currentAmount > 0 ? currentAmount : editingFeeType.amountDefault;

    // Validation finale
    if (!amountToSend || amountToSend <= 0) {
      alert("Le montant doit être positif");
      return;
    }

    try {
      setActionLoading(true);
      const response = await apiService.updateFeeType(editingFeeType.id, {
        ...formData,
        amountDefault: Number(amountToSend), // S'assurer que c'est un nombre
      });
      if (response.success) {
        setShowEditModal(false);
        setEditingFeeType(null);
        resetForm();
        await loadFeeTypes();
      } else {
        alert(response.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeeType) return;

    try {
      setActionLoading(true);
      const response = await apiService.deleteFeeType(selectedFeeType.id);
      if (response.success) {
        setShowDeleteDialog(false);
        setSelectedFeeType(null);
        await loadFeeTypes();
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      amountDefault: 0,
      isRecurring: false,
      frequency: "once",
    });
    setDisplayAmount("");
  };

  const getFrequencyLabel = (frequency: FeeFrequency): string => {
    const labels: Record<FeeFrequency, string> = {
      once: "Unique",
      monthly: "Mensuel",
      quarterly: "Trimestriel",
      yearly: "Annuel",
    };
    return labels[frequency];
  };

  const columns = [
    {
      key: "name",
      header: "Nom",
      render: (feeType: FeeType) => (
        <div className="font-semibold text-slate-900">{feeType.name}</div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (feeType: FeeType) => (
        <div className="text-slate-600 max-w-xs truncate">
          {feeType.description || "-"}
        </div>
      ),
    },
    {
      key: "amountDefault",
      header: "Montant par défaut",
      render: (feeType: FeeType) => (
        <div className="font-medium text-slate-900">
          {feeType.amountDefault.toLocaleString("fr-FR")} FCFA
        </div>
      ),
    },
    {
      key: "frequency",
      header: "Fréquence",
      render: (feeType: FeeType) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {getFrequencyLabel(feeType.frequency)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (feeType: FeeType) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAssignModal(feeType)}
            className="text-green-600 hover:text-green-900 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
          <TableActions
            onEdit={() => handleEdit(feeType)}
            onDelete={() => {
              setSelectedFeeType(feeType);
              setShowDeleteDialog(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Finances", path: "/finances" },
            { label: "Types de frais" },
          ]}
        />
        <PageHeader
          title="Types de frais"
          subtitle="Gérez les différents types de frais de l'établissement"
          icon={DollarSign}
          iconColor="from-amber-600 to-amber-700"
          actions={
            <HeaderActionButton
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              icon={Plus}
              label="Nouveau type de frais"
            />
          }
        />

        <DataTable
          data={feeTypes}
          columns={columns}
          searchPlaceholder="Rechercher un type de frais..."
          searchKeys={["name", "description"]}
          emptyMessage="Aucun type de frais trouvé"
        />
      </div>

      {/* Modal de création */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Nouveau type de frais"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormInput
            label="Nom du type de frais"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm font-medium border-2 rounded-lg bg-white text-slate-800 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Montant par défaut (FCFA)
            </label>
            <input
              type="text"
              value={displayAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Ex: 20.000"
              className="w-full px-3 py-2.5 text-sm font-medium border-2 rounded-lg bg-white text-slate-800 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-slate-700">Récurrent</span>
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Fréquence
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frequency: e.target.value as FeeFrequency,
                  })
                }
                className="w-full px-3 py-2.5 text-sm font-medium border-2 rounded-lg bg-white text-slate-800 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2"
              >
                <option value="once">Unique</option>
                <option value="monthly">Mensuel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {actionLoading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de modification */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingFeeType(null);
          resetForm();
        }}
        title="Modifier le type de frais"
        size="md"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <FormInput
            label="Nom du type de frais"
            type="text"
            value={formData.name}
            onChange={(e) => {
              // Préserver le montant lors de la modification du nom
              setFormData({
                ...formData,
                name: e.target.value,
                amountDefault:
                  formData.amountDefault > 0
                    ? formData.amountDefault
                    : editingFeeType?.amountDefault || formData.amountDefault,
              });
            }}
            required
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm font-medium border-2 rounded-lg bg-white text-slate-800 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Montant par défaut (FCFA)
            </label>
            <input
              type="text"
              value={displayAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Ex: 20.000"
              className="w-full px-3 py-2.5 text-sm font-medium border-2 rounded-lg bg-white text-slate-800 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-slate-700">Récurrent</span>
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Fréquence
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frequency: e.target.value as FeeFrequency,
                  })
                }
                className="w-full px-3 py-2.5 text-sm font-medium border-2 rounded-lg bg-white text-slate-800 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none focus:ring-2"
              >
                <option value="once">Unique</option>
                <option value="monthly">Mensuel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditingFeeType(null);
                resetForm();
              }}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {actionLoading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedFeeType(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer le type de frais"
        message={`Êtes-vous sûr de vouloir supprimer le type de frais "${selectedFeeType?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={actionLoading}
      />

      {/* Modal d'affectation aux étudiants */}
      <StudentFeeAssignmentModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssigningFeeType(null);
        }}
        feeType={assigningFeeType}
        onSuccess={handleAssignSuccess}
      />
    </AuthenticatedPage>
  );
};

export default FeeTypesPage;
