import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  CreditCard,
  FileText,
  DollarSign,
  GraduationCap,
  Percent,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { type User } from "../services/api";

const FinancesPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.log(error);
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
        {/* Header avec gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Gestion Financière</h1>
                  <p className="text-blue-100">
                    UPCD ITAK - Institut Technique l'Antidote de Kati
                  </p>
                </div>
              </div>
              <p className="text-blue-100 text-lg">
                Gérez efficacement les finances, paiements et factures de votre
                établissement
              </p>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Actions principales */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
              Actions Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paiements */}
              <div
                className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/finances/payments")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Paiements
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Gérer les paiements et transactions des étudiants
                </p>
                <div className="flex items-center text-green-600 text-sm font-semibold">
                  <span>Gérer les paiements</span>
                </div>
              </div>

              {/* Frais étudiants */}
              <div
                className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/finances/student-fees")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Frais étudiants
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Gérer les frais assignés par étudiant
                </p>
                <div className="flex items-center text-purple-600 text-sm font-semibold">
                  <span>Gérer les frais étudiants</span>
                </div>
              </div>

              {/* Types de frais */}
              <div
                className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate("/finances/fee-types")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Types de frais
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Configurer les différents types de frais
                </p>
                <div className="flex items-center text-orange-600 text-sm font-semibold">
                  <span>Gérer les types de frais</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions secondaires */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 text-gray-600 mr-3" />
              Actions Secondaires
            </h2>
            <div className="space-y-4">
              {/* Factures */}
              <div
                className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/finances/invoices")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Factures</h3>
                    <p className="text-sm text-gray-600">
                      Créer et gérer les factures
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Réductions */}
              <div
                className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate("/finances/discounts")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Percent className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Réductions</h3>
                    <p className="text-sm text-gray-600">
                      Gérer les réductions et bourses
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations et statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Étudiants</h3>
            </div>
            <p className="text-sm text-gray-600">
              Gérez les frais et paiements de tous vos étudiants
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Suivi</h3>
            </div>
            <p className="text-sm text-gray-600">
              Suivez les échéances et paiements en temps réel
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Analysez les tendances financières de votre établissement
            </p>
          </div>
        </div>

        {/* Message d'aide */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                💡 Module Finances UPCD ITAK
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Ce module vous permet de gérer tous les aspects financiers de
                votre établissement. Commencez par la{" "}
                <strong>Vue d'ensemble</strong> pour avoir une vision claire de
                votre situation financière, puis utilisez les autres sections
                pour gérer les paiements, frais et factures de manière efficace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FinancesPage;
