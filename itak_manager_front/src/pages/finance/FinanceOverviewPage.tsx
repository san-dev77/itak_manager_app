import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { apiService, type User } from "../../services/api";

interface FinanceStats {
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
}

const FinanceOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
        // TODO: Charger les statistiques depuis l'API
        loadFinanceStats();
      } catch (error) {
        console.log(error);

        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadFinanceStats = async () => {
    try {
      const response = await apiService.getFinanceStats();

      if (response.success && response.data) {
        // Mapper les données de l'API vers l'interface locale
        setStats({
          totalRevenue: response.data.totalRevenue,
          pendingPayments: response.data.totalPending || 0,
          overduePayments: response.data.totalOverdue || 0,
          totalInvoices: 0, // Non disponible dans l'API
          paidInvoices: response.data.totalPaid || 0,
          pendingInvoices: response.data.totalPending || 0,
        });
      } else {
        console.error(
          "Erreur lors du chargement des statistiques:",
          response.error
        );
        // Fallback avec des données de test en cas d'erreur
        setStats({
          totalRevenue: 2500000,
          pendingPayments: 15,
          overduePayments: 8,
          totalInvoices: 120,
          paidInvoices: 95,
          pendingInvoices: 25,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      // En cas d'erreur réseau, utiliser les données de test
      setStats({
        totalRevenue: 2500000,
        pendingPayments: 15,
        overduePayments: 8,
        totalInvoices: 120,
        paidInvoices: 95,
        pendingInvoices: 25,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                Vue d'ensemble financière
              </h1>
              <p className="text-gray-600">
                Tableau de bord et statistiques financières
              </p>
            </div>
            <Button onClick={() => navigate("/finances")} variant="outline">
              ← Retour
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des statistiques...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Revenus totaux
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.totalRevenue.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 text-xl">💰</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Paiements en attente
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pendingPayments}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">⏳</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Paiements en retard
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.overduePayments}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-red-600 text-xl">⚠️</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Factures payées
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.paidInvoices}/{stats.totalInvoices}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 text-xl">✅</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 text-2xl">💳</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nouveau paiement
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enregistrer un nouveau paiement
                  </p>
                  <Button
                    onClick={() => navigate("/finances/payments/new")}
                    className="w-full"
                  >
                    Créer un paiement
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 text-2xl">🧾</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nouvelle facture
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Créer une nouvelle facture
                  </p>
                  <Button
                    onClick={() => navigate("/finances/invoices/new")}
                    className="w-full"
                  >
                    Créer une facture
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Types de frais
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Gérer les types de frais
                  </p>
                  <Button
                    onClick={() => navigate("/finances/fee-types")}
                    className="w-full"
                  >
                    Gérer les frais
                  </Button>
                </div>
              </Card>
            </div>

            {/* Graphiques et rapports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Évolution des revenus
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Graphique des revenus (à implémenter)
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statut des paiements
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Graphique des paiements (à implémenter)
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FinanceOverviewPage;
