import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FormModal from "../../components/ui/FormModal";
import { apiService, type User } from "../../services/api";

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
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Fonctions utilitaires pour le formatage des montants
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("fr-FR");
  };

  const parseAmount = (value: string): number => {
    // Supprimer tous les espaces et points, puis convertir en nombre
    const cleanValue = value.replace(/[\s.]/g, "");
    return parseInt(cleanValue) || 0;
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseAmount(value);
    setFormData({ ...formData, amountDefault: numericValue });
    setDisplayAmount(formatAmount(numericValue));
  };

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        loadFeeTypes();
      } catch (error) {
        console.log(error);
        console.log("Erreur lors du chargement des types de frais:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadFeeTypes = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllFeeTypes();

      if (response.success && response.data) {
        console.log("📥 Données reçues de l'API:", response.data);
        setFeeTypes(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des types de frais:",
          response.error
        );
        setFeeTypes([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des types de frais:", error);
      setFeeTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("📤 Données envoyées:", formData);

      if (editingFeeType) {
        const response = await apiService.updateFeeType(
          editingFeeType.id,
          formData
        );
        if (response.success) {
          console.log("Type de frais mis à jour avec succès");
        } else {
          console.error("Erreur lors de la mise à jour:", response.error);
          alert("Erreur lors de la mise à jour du type de frais");
          return;
        }
      } else {
        const response = await apiService.createFeeType(formData);
        if (response.success) {
          console.log("Type de frais créé avec succès");
        } else {
          console.error("Erreur lors de la création:", response.error);
          alert("Erreur lors de la création du type de frais");
          return;
        }
      }

      setIsModalOpen(false);
      setEditingFeeType(null);
      resetForm();
      loadFeeTypes();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    }
  };

  const handleEdit = (feeType: FeeType) => {
    setEditingFeeType(feeType);
    setFormData({
      name: feeType.name,
      description: feeType.description || "",
      amountDefault: feeType.amountDefault,
      isRecurring: feeType.isRecurring,
      frequency: feeType.frequency as any,
    });
    setDisplayAmount(formatAmount(feeType.amountDefault));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce type de frais ?")
    ) {
      try {
        const response = await apiService.deleteFeeType(id);
        if (response.success) {
          console.log("Type de frais supprimé avec succès");
          loadFeeTypes();
        } else {
          console.error("Erreur lors de la suppression:", response.error);
          alert("Erreur lors de la suppression du type de frais");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression. Veuillez réessayer.");
      }
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

  const openModal = () => {
    setEditingFeeType(null);
    resetForm();
    setIsModalOpen(true);
  };

  const filteredFeeTypes = feeTypes.filter(
    (feeType) =>
      feeType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feeType.description &&
        feeType.description.toLowerCase().includes(searchTerm.toLowerCase()))
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

  return (
    <Layout user={user}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Types de frais
              </h1>
              <p className="text-gray-600">
                Gérez les différents types de frais de l'établissement
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/finances")} variant="outline">
                ← Retour
              </Button>
              <Button onClick={openModal}>+ Nouveau type de frais</Button>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Rechercher un type de frais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des types de frais...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant par défaut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fréquence
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFeeTypes.map((feeType) => (
                    <tr key={feeType.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {feeType.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {feeType.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {feeType.amountDefault.toLocaleString("fr-FR")} FCFA
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {feeType.frequency === "once" && "Unique"}
                          {feeType.frequency === "monthly" && "Mensuel"}
                          {feeType.frequency === "quarterly" && "Trimestriel"}
                          {feeType.frequency === "yearly" && "Annuel"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(feeType)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(feeType.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredFeeTypes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Aucun type de frais
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez par créer un nouveau type de frais.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            editingFeeType
              ? "Modifier le type de frais"
              : "Nouveau type de frais"
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom du type de frais"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant par défaut (FCFA)
              </label>
              <input
                type="text"
                value={displayAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Ex: 20.000"
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Récurrent</span>
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="once">Unique</option>
                  <option value="monthly">Mensuel</option>
                  <option value="quarterly">Trimestriel</option>
                  <option value="yearly">Annuel</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {editingFeeType ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </FormModal>
      </div>
    </Layout>
  );
};

export default FeeTypesPage;
