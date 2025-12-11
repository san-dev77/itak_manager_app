import { useNavigate } from "react-router-dom";
import AuthenticatedPage from "../components/layout/AuthenticatedPage";
import PageHeader from "../components/ui/PageHeader";
import {
  CreditCard,
  FileText,
  DollarSign,
  GraduationCap,
  Percent,
  TrendingUp,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const FinancesPage = () => {
  const navigate = useNavigate();

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <PageHeader
          title="Gestion Financière"
          subtitle="Gérez les finances, paiements et factures"
          icon={TrendingUp}
          iconColor="from-blue-600 to-blue-800"
        />

        {/* Stats rapides - En haut pour hiérarchie visuelle */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border-2 border-emerald-200 cursor-pointer"
            onClick={() => navigate("/finances/payments")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Paiements</h3>
            <p className="text-sm text-slate-600">Transactions</p>
          </div>

          <div
            className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-5 border-2 border-violet-200 cursor-pointer"
            onClick={() => navigate("/finances/student-fees")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              Frais étudiants
            </h3>
            <p className="text-sm text-slate-600">Par étudiant</p>
          </div>

          <div
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border-2 border-amber-200 cursor-pointer"
            onClick={() => navigate("/finances/fee-types")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              Types de frais
            </h3>
            <p className="text-sm text-slate-600">Configuration</p>
          </div>

          <div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 cursor-pointer"
            onClick={() => navigate("/finances/invoices")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Factures</h3>
            <p className="text-sm text-slate-600">Créer et gérer</p>
          </div>
        </div>

        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actions principales - Détails */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              Accès rapides
            </h2>
            <div className="space-y-3">
              <div
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer"
                onClick={() => navigate("/finances/payments")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Paiements</h3>
                    <p className="text-xs text-slate-500">
                      Gérer les transactions
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer"
                onClick={() => navigate("/finances/student-fees")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">
                      Frais étudiants
                    </h3>
                    <p className="text-xs text-slate-500">Frais par étudiant</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer"
                onClick={() => navigate("/finances/fee-types")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">
                      Types de frais
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configurer les frais
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer"
                onClick={() => navigate("/finances/invoices")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Factures</h3>
                    <p className="text-xs text-slate-500">Créer et gérer</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions secondaires */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 text-slate-500 mr-2" />
              Outils
            </h2>
            <div className="space-y-3">
              <div
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer"
                onClick={() => navigate("/finances/overview")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">
                      Vue d'ensemble
                    </h3>
                    <p className="text-xs text-slate-500">Statistiques</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div
                className="bg-white rounded-xl p-4 border border-slate-200 cursor-pointer"
                onClick={() => navigate("/finances/discounts")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Percent className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Réductions</h3>
                    <p className="text-xs text-slate-500">Bourses et remises</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  );
};

export default FinancesPage;
