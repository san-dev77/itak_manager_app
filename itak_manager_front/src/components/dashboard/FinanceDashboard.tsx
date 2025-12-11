import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  GraduationCap,
  Clock,
  FileText,
} from "lucide-react";
import { apiService } from "../../services/api";

interface FinanceDashboardProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  currentTime: Date;
}

interface FinanceStats {
  totalAmount: number;
  totalPayments: number;
  pendingPayments: number;
  totalStudents: number;
  paymentsByMethod: { method: string; count: number; amount: number }[];
  recentPayments: {
    id: string;
    studentName: string;
    amount: number;
    method: string;
    date: string;
  }[];
}

const FinanceDashboard = ({ user, currentTime }: FinanceDashboardProps) => {
  const [stats, setStats] = useState<FinanceStats>({
    totalAmount: 0,
    totalPayments: 0,
    pendingPayments: 0,
    totalStudents: 0,
    paymentsByMethod: [],
    recentPayments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [paymentsRes, studentsRes] = await Promise.allSettled([
        apiService.getAllPayments(),
        apiService.getAllStudents(),
      ]);

      const newStats: FinanceStats = {
        totalAmount: 0,
        totalPayments: 0,
        pendingPayments: 0,
        totalStudents: 0,
        paymentsByMethod: [],
        recentPayments: [],
      };

      if (paymentsRes.status === "fulfilled" && paymentsRes.value.success) {
        const paymentsData = paymentsRes.value.data || [];
        newStats.totalPayments = paymentsData.length;

        // Calculer le montant total encaissé
        newStats.totalAmount = paymentsData.reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0
        );

        // Calculer les paiements par méthode
        const methodCounts: Record<
          string,
          { count: number; amount: number }
        > = {};
        paymentsData.forEach((p) => {
          const method = p.method || "other";
          if (!methodCounts[method]) {
            methodCounts[method] = { count: 0, amount: 0 };
          }
          methodCounts[method].count++;
          methodCounts[method].amount += Number(p.amount) || 0;
        });

        newStats.paymentsByMethod = Object.entries(methodCounts).map(
          ([method, data]) => ({
            method,
            count: data.count,
            amount: data.amount,
          })
        );

        // Compter les paiements en attente (status pending)
        newStats.pendingPayments = paymentsData.filter(
          (p) => p.status === "pending"
        ).length;

        // Paiements récents (trier par date de création décroissante)
        const sortedPayments = [...paymentsData].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        newStats.recentPayments = sortedPayments.slice(0, 5).map((p) => ({
          id: p.id,
          studentName: "Étudiant", // Le nom sera chargé séparément si nécessaire
          amount: Number(p.amount) || 0,
          method: p.method || "other",
          date: p.createdAt || "",
        }));
      }

      if (studentsRes.status === "fulfilled" && studentsRes.value.success) {
        const studentsData = studentsRes.value.data || [];
        newStats.totalStudents = studentsData.length;
      }

      setStats(newStats);
    } catch (error) {
      console.error("Error loading finance stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return "Récemment";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Récemment";
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      if (diff < 0 || diff > 365 * 24 * 60 * 60 * 1000) return "Récemment";
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days > 30) return `Il y a ${Math.floor(days / 30)} mois`;
      if (days > 0) return `Il y a ${days}j`;
      if (hours > 0) return `Il y a ${hours}h`;
      if (minutes > 0) return `Il y a ${minutes}min`;
      return "À l'instant";
    } catch {
      return "Récemment";
    }
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Espèces",
      bank_transfer: "Virement",
      mobile_money: "Mobile Money",
      card: "Carte",
      other: "Autre",
    };
    return labels[method] || method;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-emerald-200 text-sm mb-1">
              Service Comptabilité - UPCD-ITAK
            </p>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user.firstName} {user.lastName}
            </h1>
            <p className="text-emerald-100">
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-light">{formatTime(currentTime)}</p>
            <p className="text-emerald-200 text-sm mt-1">Heure locale</p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Finance & Students */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Encaissé"
          value={formatCurrency(stats.totalAmount)}
          icon={<DollarSign className="w-5 h-5" />}
          color="bg-emerald-500"
          loading={loading}
          link="/finances"
        />
        <StatCard
          title="Paiements"
          value={stats.totalPayments}
          icon={<CreditCard className="w-5 h-5" />}
          color="bg-blue-500"
          loading={loading}
          link="/finances/payments"
        />
        <StatCard
          title="En Attente"
          value={stats.pendingPayments}
          icon={<Clock className="w-5 h-5" />}
          color="bg-amber-500"
          loading={loading}
          link="/finances"
        />
        <StatCard
          title="Étudiants"
          value={stats.totalStudents}
          icon={<GraduationCap className="w-5 h-5" />}
          color="bg-violet-500"
          loading={loading}
          link="/students"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Vue d'ensemble financière
          </h2>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium">
                Total Encaissé
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {loading ? "..." : formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-600 font-medium">En Attente</p>
              <p className="text-2xl font-bold text-amber-700">
                {loading ? "..." : stats.pendingPayments}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <p className="text-sm font-medium text-slate-600 mb-3">
              Méthodes de paiement
            </p>
            {stats.paymentsByMethod.length > 0 ? (
              <div className="space-y-2">
                {stats.paymentsByMethod.map((item) => {
                  const maxCount = Math.max(
                    ...stats.paymentsByMethod.map((p) => p.count),
                    1
                  );
                  return (
                    <div key={item.method} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">
                          {getMethodLabel(item.method)}
                        </span>
                        <span className="font-medium text-slate-800">
                          {item.count} ({formatCurrency(item.amount)})
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.count / maxCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">
                Aucun paiement enregistré
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Payments */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/finances/payments"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-600">
                  Paiements
                </span>
              </Link>
              <Link
                to="/finances/student-fees"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-600">
                  Frais
                </span>
              </Link>
              <Link
                to="/students"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-600">
                  Étudiants
                </span>
              </Link>
              <Link
                to="/finances/invoices"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-600">
                  Factures
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Paiements récents
            </h2>

            {stats.recentPayments.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {payment.studentName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(payment.amount)} • {getMethodLabel(payment.method)} • {formatRelativeTime(payment.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">
                Aucun paiement récent
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
  link: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  loading,
  link,
}: StatCardProps) => (
  <Link
    to={link}
    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-slate-500">{title}</p>
        {loading ? (
          <div className="h-7 w-14 bg-slate-200 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
          </p>
        )}
      </div>
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 ${color} rounded-lg flex items-center justify-center text-white`}
      >
        {icon}
      </div>
    </div>
  </Link>
);

export default FinanceDashboard;

