import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  UserCheck,
  Clock,
  PieChart,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import FinanceDashboard from "../components/dashboard/FinanceDashboard";
import ScolariteDashboard from "../components/dashboard/ScolariteDashboard";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalClasses: number;
  totalPayments: number;
  pendingPayments: number;
  totalAmount: number;
  recentActivities: Activity[];
  paymentsByMethod: { method: string; count: number; amount: number }[];
}

interface Activity {
  id: string;
  type: "payment" | "student" | "user";
  title: string;
  description: string;
  time: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalPayments: 0,
    pendingPayments: 0,
    totalAmount: 0,
    recentActivities: [],
    paymentsByMethod: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      navigate("/login");
      return;
    }

    fetchStats(token);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [navigate]);

  const fetchStats = async (token: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [
        usersRes,
        studentsRes,
        classesRes,
        paymentsRes,
        paymentsSummaryRes,
      ] = await Promise.allSettled([
        fetch("/api/users", { headers }),
        fetch("/api/students", { headers }),
        fetch("/api/classes", { headers }),
        fetch("/api/payments", { headers }),
        fetch("/api/payments/summary", { headers }),
      ]);

      const newStats: DashboardStats = {
        totalUsers: 0,
        totalStudents: 0,
        totalClasses: 0,
        totalPayments: 0,
        pendingPayments: 0,
        totalAmount: 0,
        recentActivities: [],
        paymentsByMethod: [],
      };

      if (usersRes.status === "fulfilled" && usersRes.value.ok) {
        const users = await usersRes.value.json();
        newStats.totalUsers = Array.isArray(users) ? users.length : 0;
      }

      if (studentsRes.status === "fulfilled" && studentsRes.value.ok) {
        const students = await studentsRes.value.json();
        newStats.totalStudents = Array.isArray(students) ? students.length : 0;
      }

      if (classesRes.status === "fulfilled" && classesRes.value.ok) {
        const classes = await classesRes.value.json();
        newStats.totalClasses = Array.isArray(classes) ? classes.length : 0;
      }

      if (paymentsRes.status === "fulfilled" && paymentsRes.value.ok) {
        const payments = await paymentsRes.value.json();
        if (Array.isArray(payments)) {
          newStats.totalPayments = payments.length;

          const methodCounts: Record<
            string,
            { count: number; amount: number }
          > = {};
          payments.forEach((p: { method?: string; amount?: number }) => {
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

          const recentPayments = payments
            .slice(0, 5)
            .map(
              (
                p: { amount?: number; method?: string; createdAt?: string },
                i: number
              ) => ({
                id: `payment-${i}`,
                type: "payment" as const,
                title: "Paiement reçu",
                description: `${formatCurrency(
                  p.amount || 0
                )} - ${getMethodLabel(p.method || "other")}`,
                time: formatRelativeTime(p.createdAt || ""),
              })
            );
          newStats.recentActivities = recentPayments;
        }
      }

      if (
        paymentsSummaryRes.status === "fulfilled" &&
        paymentsSummaryRes.value.ok
      ) {
        const summary = await paymentsSummaryRes.value.json();
        newStats.totalAmount = summary.totalAmount || 0;
        newStats.pendingPayments = summary.pendingCount || 0;
      }

      setStats(newStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: "Président / DG",
      admin: "Administrateur",
      scolarite: "Scolarité",
      finance: "Comptabilité",
      qualite: "Assurance Qualité",
    };
    return labels[role] || role;
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
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) return "Récemment";

      const now = new Date();
      const diff = now.getTime() - date.getTime();

      // Si date dans le futur ou trop ancienne (> 1 an), afficher "Récemment"
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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Afficher le dashboard approprié selon le rôle
  if (user.role === "finance") {
    return (
      <Layout
        user={{
          firstName: user.firstName || "Utilisateur",
          lastName: user.lastName || "",
          role: user.role || "user",
          email: user.email || "",
        }}
      >
        <FinanceDashboard user={user} currentTime={currentTime} />
      </Layout>
    );
  }

  if (user.role === "scolarite") {
    return (
      <Layout
        user={{
          firstName: user.firstName || "Utilisateur",
          lastName: user.lastName || "",
          role: user.role || "user",
          email: user.email || "",
        }}
      >
        <ScolariteDashboard user={user} currentTime={currentTime} />
      </Layout>
    );
  }

  // Dashboard complet pour super_admin, admin, et autres rôles
  const quickActions = [
    {
      label: "Étudiants",
      path: "/students",
      icon: GraduationCap,
      color: "bg-blue-600",
    },
    {
      label: "Paiements",
      path: "/finances",
      icon: DollarSign,
      color: "bg-emerald-600",
    },
    {
      label: "Calendrier",
      path: "/calendar",
      icon: Calendar,
      color: "bg-violet-600",
    },
    {
      label: "Utilisateurs",
      path: "/users",
      icon: Users,
      color: "bg-amber-600",
    },
  ];

  // Data for distribution chart
  const distributionData = [
    { label: "Utilisateurs", value: stats.totalUsers, color: "#3B82F6" },
    { label: "Étudiants", value: stats.totalStudents, color: "#10B981" },
    { label: "Classes", value: stats.totalClasses, color: "#8B5CF6" },
    { label: "Paiements", value: stats.totalPayments, color: "#F59E0B" },
  ];

  const totalDistribution =
    distributionData.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <Layout
      user={{
        firstName: user.firstName || "Utilisateur",
        lastName: user.lastName || "",
        role: user.role || "user",
        email: user.email || "",
      }}
    >
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm mb-1">
                Bienvenue sur UPCD-ITAK
              </p>
              <h1 className="text-3xl font-bold mb-2">
                Bonjour, {user.firstName} {user.lastName}
              </h1>
              <p className="text-blue-100">
                {getRoleLabel(user.role)} • {formatDate(currentTime)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-light">{formatTime(currentTime)}</p>
              <p className="text-blue-200 text-sm mt-1">Heure locale</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon={<Users className="w-5 h-5" />}
            color="bg-blue-500"
            loading={loading}
            link="/users"
          />
          <StatCard
            title="Étudiants"
            value={stats.totalStudents}
            icon={<GraduationCap className="w-5 h-5" />}
            color="bg-emerald-500"
            loading={loading}
            link="/students"
          />
          <StatCard
            title="Classes"
            value={stats.totalClasses}
            icon={<BookOpen className="w-5 h-5" />}
            color="bg-violet-500"
            loading={loading}
            link="/classes-subjects"
          />
          <StatCard
            title="Paiements"
            value={stats.totalPayments}
            icon={<CreditCard className="w-5 h-5" />}
            color="bg-amber-500"
            loading={loading}
            link="/finances"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Distribution Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Répartition
            </h2>

            {/* Donut Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {distributionData.map((item, index) => {
                    const percentage = (item.value / totalDistribution) * 100;
                    const offset = distributionData
                      .slice(0, index)
                      .reduce(
                        (sum, d) => sum + (d.value / totalDistribution) * 100,
                        0
                      );
                    return (
                      <circle
                        key={item.label}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={`${percentage * 2.51} 251`}
                        strokeDashoffset={`${-offset * 2.51}`}
                        className="transition-all duration-700"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">
                      {totalDistribution}
                    </p>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
              {distributionData.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-semibold text-slate-800 ml-auto">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Finances
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

            {/* Bar Chart for Payment Methods */}
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
                            {item.count}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
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

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Actions
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                  >
                    <div
                      className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}
                    >
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Activité
              </h2>

              {stats.recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === "payment"
                            ? "bg-emerald-100 text-emerald-600"
                            : activity.type === "student"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-violet-100 text-violet-600"
                        }`}
                      >
                        {activity.type === "payment" ? (
                          <DollarSign className="w-4 h-4" />
                        ) : activity.type === "student" ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-sm">
                  Aucune activité
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
          <p>UPCD-ITAK v1.0</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            {user.email}
          </p>
        </div>
      </div>
    </Layout>
  );
};

interface StatCardProps {
  title: string;
  value: number;
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
    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-blue-300 hover:shadow-md transition-all group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-slate-500">{title}</p>
        {loading ? (
          <div className="h-7 w-14 bg-slate-200 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            {value.toLocaleString("fr-FR")}
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

export default DashboardPage;
