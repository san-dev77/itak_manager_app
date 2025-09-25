import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";

const FinancesPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Financière
          </h1>
          <p className="text-gray-600">
            Gérez les finances, paiements et factures de l'établissement
          </p>
        </div>

        {/* Menu des finances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vue d'ensemble
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tableau de bord financier et statistiques
              </p>
            </div>
            <Button
              onClick={() => navigate("/finances/overview")}
              className="w-full"
            >
              Accéder au tableau de bord
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Paiements
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Gérer les paiements et transactions
              </p>
            </div>
            <Button
              onClick={() => navigate("/finances/payments")}
              className="w-full"
            >
              Gérer les paiements
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">🧾</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Factures
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Créer et gérer les factures
              </p>
            </div>
            <Button
              onClick={() => navigate("/finances/invoices")}
              className="w-full"
            >
              Gérer les factures
            </Button>
          </div>
        </div>

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Module Finances
          </h3>
          <p className="text-blue-800 text-sm">
            Ce module vous permet de gérer tous les aspects financiers de votre
            établissement. Commencez par la vue d'ensemble pour avoir une vision
            claire de votre situation financière.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default FinancesPage;
