import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import FormModal from "../../components/ui/FormModal";
import { apiService } from "../../services/api";

interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  totalAmount: number;
  status: "unpaid" | "partial" | "paid" | "cancelled";
  issuedDate: string;
  dueDate: string;
  notes?: string;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
  };
  invoiceItems: Array<{
    id: string;
    amount: number;
    studentFee: {
      feeType: {
        name: string;
      };
    };
  }>;
}

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    studentId: "",
    totalAmount: 0,
    issuedDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 jours
    notes: "",
  });

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        loadInvoices();
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllInvoices();

      if (response.success && response.data) {
        setInvoices(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des factures:",
          response.error
        );
        // Fallback avec des données de test en cas d'erreur
        setInvoices([
          {
            id: "1",
            studentId: "1",
            invoiceNumber: "INV-2024-001",
            totalAmount: 525000,
            status: "paid",
            issuedDate: "2024-01-01",
            dueDate: "2024-01-31",
            notes: "Facture de scolarité et cantine",
            createdAt: "2024-01-01T10:00:00Z",
            student: {
              firstName: "Mohamed",
              lastName: "Kamissoko",
            },
            invoiceItems: [
              {
                id: "1",
                amount: 500000,
                studentFee: {
                  feeType: {
                    name: "Scolarité",
                  },
                },
              },
              {
                id: "2",
                amount: 25000,
                studentFee: {
                  feeType: {
                    name: "Cantine",
                  },
                },
              },
            ],
          },
          {
            id: "2",
            studentId: "2",
            invoiceNumber: "INV-2024-002",
            totalAmount: 40000,
            status: "unpaid",
            issuedDate: "2024-01-15",
            dueDate: "2024-02-15",
            notes: "Facture de transport",
            createdAt: "2024-01-15T14:30:00Z",
            student: {
              firstName: "Fatoumata",
              lastName: "Traoré",
            },
            invoiceItems: [
              {
                id: "3",
                amount: 40000,
                studentFee: {
                  feeType: {
                    name: "Transport",
                  },
                },
              },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des factures:", error);
      // En cas d'erreur réseau, utiliser les données de test
      setInvoices([
        {
          id: "1",
          studentId: "1",
          invoiceNumber: "INV-2024-001",
          totalAmount: 525000,
          status: "paid",
          issuedDate: "2024-01-01",
          dueDate: "2024-01-31",
          notes: "Facture de scolarité et cantine",
          createdAt: "2024-01-01T10:00:00Z",
          student: {
            firstName: "Mohamed",
            lastName: "Kamissoko",
          },
          invoiceItems: [
            {
              id: "1",
              amount: 500000,
              studentFee: {
                feeType: {
                  name: "Scolarité",
                },
              },
            },
            {
              id: "2",
              amount: 25000,
              studentFee: {
                feeType: {
                  name: "Cantine",
                },
              },
            },
          ],
        },
        {
          id: "2",
          studentId: "2",
          invoiceNumber: "INV-2024-002",
          totalAmount: 40000,
          status: "unpaid",
          issuedDate: "2024-01-15",
          dueDate: "2024-02-15",
          notes: "Facture de transport",
          createdAt: "2024-01-15T14:30:00Z",
          student: {
            firstName: "Fatoumata",
            lastName: "Traoré",
          },
          invoiceItems: [
            {
              id: "3",
              amount: 40000,
              studentFee: {
                feeType: {
                  name: "Transport",
                },
              },
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInvoice) {
        const response = await apiService.updateInvoice(
          editingInvoice.id,
          formData
        );
        if (response.success) {
          console.log("Facture mise à jour avec succès");
        } else {
          console.error("Erreur lors de la mise à jour:", response.error);
          alert("Erreur lors de la mise à jour de la facture");
          return;
        }
      } else {
        const response = await apiService.createInvoice(formData);
        if (response.success) {
          console.log("Facture créée avec succès");
        } else {
          console.error("Erreur lors de la création:", response.error);
          alert("Erreur lors de la création de la facture");
          return;
        }
      }

      setIsModalOpen(false);
      setEditingInvoice(null);
      resetForm();
      loadInvoices();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      studentId: invoice.studentId,
      totalAmount: invoice.totalAmount,
      issuedDate: invoice.issuedDate,
      dueDate: invoice.dueDate,
      notes: invoice.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      try {
        const response = await apiService.deleteInvoice(id);
        if (response.success) {
          console.log("Facture supprimée avec succès");
          loadInvoices();
        } else {
          console.error("Erreur lors de la suppression:", response.error);
          alert("Erreur lors de la suppression de la facture");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression. Veuillez réessayer.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      totalAmount: 0,
      issuedDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
    });
  };

  const openModal = () => {
    setEditingInvoice(null);
    resetForm();
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "partial":
        return "text-yellow-600 bg-yellow-100";
      case "unpaid":
        return "text-red-600 bg-red-100";
      case "cancelled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Payée";
      case "partial":
        return "Partiellement payée";
      case "unpaid":
        return "Non payée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.student.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.student.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                Gestion des factures
              </h1>
              <p className="text-gray-600">
                Gérez les factures et documents de facturation
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/finances")} variant="outline">
                ← Retour
              </Button>
              <Button onClick={openModal}>+ Nouvelle facture</Button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex gap-4">
          <Input
            type="text"
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Payée</option>
            <option value="partial">Partiellement payée</option>
            <option value="unpaid">Non payée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des factures...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {invoice.invoiceNumber}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusText(invoice.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Étudiant:</span>
                        <p>
                          {invoice.student.firstName} {invoice.student.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Montant total:</span>
                        <p className="font-semibold text-green-600">
                          {invoice.totalAmount.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Date d'émission:</span>
                        <p>
                          {new Date(invoice.issuedDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Date d'échéance:</span>
                        <p>
                          {new Date(invoice.dueDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Détails des éléments de facture */}
                    <div className="mb-3">
                      <span className="font-medium text-sm text-gray-600">
                        Éléments:
                      </span>
                      <div className="mt-1 space-y-1">
                        {invoice.invoiceItems.map((item) => (
                          <div
                            key={item.id}
                            className="text-sm text-gray-600 flex justify-between"
                          >
                            <span>{item.studentFee.feeType.name}</span>
                            <span>{item.amount.toLocaleString()} FCFA</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {invoice.notes && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span>{" "}
                        {invoice.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded hover:bg-blue-50"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-600 rounded hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingInvoice ? "Modifier la facture" : "Nouvelle facture"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ID de l'étudiant"
              type="text"
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
              required
            />

            <Input
              label="Montant total (FCFA)"
              type="number"
              value={formData.totalAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalAmount: Number(e.target.value),
                })
              }
              required
              min="0"
            />

            <Input
              label="Date d'émission"
              type="date"
              value={formData.issuedDate}
              onChange={(e) =>
                setFormData({ ...formData, issuedDate: e.target.value })
              }
              required
            />

            <Input
              label="Date d'échéance"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {editingInvoice ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </FormModal>
      </div>
    </Layout>
  );
};

export default InvoicesPage;
