import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import FormModal from "../../components/ui/FormModal";
import { apiService } from "../../services/api";

interface Payment {
  id: string;
  studentFeeId: string;
  paymentDate: string;
  amount: number;
  method: "cash" | "bank_transfer" | "mobile_money" | "card";
  provider?: string;
  transactionRef?: string;
  receivedBy: string;
  status: "successful" | "failed" | "pending";
  notes?: string;
  createdAt: string;
  studentFee: {
    id: string;
    student: {
      firstName: string;
      lastName: string;
    };
    feeType: {
      name: string;
    };
  };
  receivedByUser: {
    firstName: string;
    lastName: string;
  };
}

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    studentFeeId: "",
    paymentDate: new Date().toISOString().split("T")[0],
    amount: 0,
    method: "cash" as const,
    provider: "",
    transactionRef: "",
    notes: "",
  });

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        loadPayments();
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllPayments();

      if (response.success && response.data) {
        setPayments(response.data);
      } else {
        console.error(
          "Erreur lors du chargement des paiements:",
          response.error
        );
        // Fallback avec des données de test en cas d'erreur
        setPayments([
          {
            id: "1",
            studentFeeId: "1",
            paymentDate: "2024-01-15",
            amount: 500000,
            method: "bank_transfer",
            provider: "Orange Money",
            transactionRef: "OM123456789",
            receivedBy: "1",
            status: "successful",
            notes: "Paiement de scolarité",
            createdAt: "2024-01-15T10:30:00Z",
            studentFee: {
              id: "1",
              student: {
                firstName: "Mohamed",
                lastName: "Kamissoko",
              },
              feeType: {
                name: "Scolarité",
              },
            },
            receivedByUser: {
              firstName: "Admin",
              lastName: "User",
            },
          },
          {
            id: "2",
            studentFeeId: "2",
            paymentDate: "2024-01-16",
            amount: 25000,
            method: "cash",
            receivedBy: "1",
            status: "successful",
            notes: "Paiement cantine",
            createdAt: "2024-01-16T14:20:00Z",
            studentFee: {
              id: "2",
              student: {
                firstName: "Fatoumata",
                lastName: "Traoré",
              },
              feeType: {
                name: "Cantine",
              },
            },
            receivedByUser: {
              firstName: "Admin",
              lastName: "User",
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
      // En cas d'erreur réseau, utiliser les données de test
      setPayments([
        {
          id: "1",
          studentFeeId: "1",
          paymentDate: "2024-01-15",
          amount: 500000,
          method: "bank_transfer",
          provider: "Orange Money",
          transactionRef: "OM123456789",
          receivedBy: "1",
          status: "successful",
          notes: "Paiement de scolarité",
          createdAt: "2024-01-15T10:30:00Z",
          studentFee: {
            id: "1",
            student: {
              firstName: "Mohamed",
              lastName: "Kamissoko",
            },
            feeType: {
              name: "Scolarité",
            },
          },
          receivedByUser: {
            firstName: "Admin",
            lastName: "User",
          },
        },
        {
          id: "2",
          studentFeeId: "2",
          paymentDate: "2024-01-16",
          amount: 25000,
          method: "cash",
          receivedBy: "1",
          status: "successful",
          notes: "Paiement cantine",
          createdAt: "2024-01-16T14:20:00Z",
          studentFee: {
            id: "2",
            student: {
              firstName: "Fatoumata",
              lastName: "Traoré",
            },
            feeType: {
              name: "Cantine",
            },
          },
          receivedByUser: {
            firstName: "Admin",
            lastName: "User",
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPayment) {
        const response = await apiService.updatePayment(
          editingPayment.id,
          formData
        );
        if (response.success) {
          console.log("Paiement mis à jour avec succès");
        } else {
          console.error("Erreur lors de la mise à jour:", response.error);
          alert("Erreur lors de la mise à jour du paiement");
          return;
        }
      } else {
        const response = await apiService.createPayment(formData);
        if (response.success) {
          console.log("Paiement créé avec succès");
        } else {
          console.error("Erreur lors de la création:", response.error);
          alert("Erreur lors de la création du paiement");
          return;
        }
      }

      setIsModalOpen(false);
      setEditingPayment(null);
      resetForm();
      loadPayments();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      studentFeeId: payment.studentFeeId,
      paymentDate: payment.paymentDate,
      amount: payment.amount,
      method: payment.method,
      provider: payment.provider || "",
      transactionRef: payment.transactionRef || "",
      notes: payment.notes || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      studentFeeId: "",
      paymentDate: new Date().toISOString().split("T")[0],
      amount: 0,
      method: "cash",
      provider: "",
      transactionRef: "",
      notes: "",
    });
  };

  const openModal = () => {
    setEditingPayment(null);
    resetForm();
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "successful":
        return "Réussi";
      case "failed":
        return "Échoué";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Espèces";
      case "bank_transfer":
        return "Virement bancaire";
      case "mobile_money":
        return "Mobile Money";
      case "card":
        return "Carte bancaire";
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentFee.student.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.studentFee.student.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.studentFee.feeType.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (payment.transactionRef &&
        payment.transactionRef
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

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
                Gestion des paiements
              </h1>
              <p className="text-gray-600">
                Gérez les paiements et transactions financières
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/finances")} variant="outline">
                ← Retour
              </Button>
              <Button onClick={openModal}>+ Nouveau paiement</Button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex gap-4">
          <Input
            type="text"
            placeholder="Rechercher un paiement..."
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
            <option value="successful">Réussi</option>
            <option value="failed">Échoué</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des paiements...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {payment.studentFee.student.firstName}{" "}
                        {payment.studentFee.student.lastName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type de frais:</span>
                        <p>{payment.studentFee.feeType.name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Montant:</span>
                        <p className="font-semibold text-green-600">
                          {payment.amount.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Méthode:</span>
                        <p>{getMethodText(payment.method)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>
                        <p>
                          {new Date(payment.paymentDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>

                    {payment.transactionRef && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Référence:</span>{" "}
                        {payment.transactionRef}
                      </div>
                    )}

                    {payment.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Notes:</span>{" "}
                        {payment.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(payment)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded hover:bg-blue-50"
                    >
                      Modifier
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
          title={editingPayment ? "Modifier le paiement" : "Nouveau paiement"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ID du frais étudiant"
              type="text"
              value={formData.studentFeeId}
              onChange={(e) =>
                setFormData({ ...formData, studentFeeId: e.target.value })
              }
              required
            />

            <Input
              label="Date de paiement"
              type="date"
              value={formData.paymentDate}
              onChange={(e) =>
                setFormData({ ...formData, paymentDate: e.target.value })
              }
              required
            />

            <Input
              label="Montant (FCFA)"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              required
              min="0"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Méthode de paiement
              </label>
              <select
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="cash">Espèces</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Carte bancaire</option>
              </select>
            </div>

            <Input
              label="Fournisseur (optionnel)"
              type="text"
              value={formData.provider}
              onChange={(e) =>
                setFormData({ ...formData, provider: e.target.value })
              }
            />

            <Input
              label="Référence de transaction (optionnel)"
              type="text"
              value={formData.transactionRef}
              onChange={(e) =>
                setFormData({ ...formData, transactionRef: e.target.value })
              }
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
                {editingPayment ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </FormModal>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
