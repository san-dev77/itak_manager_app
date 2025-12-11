import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  UserCheck,
  School,
} from "lucide-react";
import { apiService } from "../../services/api";

interface ScolariteDashboardProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  currentTime: Date;
}

interface ScolariteStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  activeAssignments: number;
  recentStudents: {
    id: string;
    name: string;
    matricule: string;
    class: string;
    date: string;
  }[];
}

const ScolariteDashboard = ({
  user,
  currentTime,
}: ScolariteDashboardProps) => {
  const [stats, setStats] = useState<ScolariteStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
    activeAssignments: 0,
    recentStudents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [studentsRes, classesRes, teachersRes, studentClassesRes] =
        await Promise.allSettled([
          apiService.getAllStudents(),
          apiService.getAllClasses(),
          apiService.getAllTeachers(),
          apiService.getAllStudentClasses(),
        ]);

      const newStats: ScolariteStats = {
        totalStudents: 0,
        totalClasses: 0,
        totalTeachers: 0,
        activeAssignments: 0,
        recentStudents: [],
      };

      // Traiter les étudiants
      if (studentsRes.status === "fulfilled" && studentsRes.value.success) {
        const studentsData = studentsRes.value.data || [];
        newStats.totalStudents = studentsData.length;

        // Trier par date de création décroissante pour les étudiants récents
        const sortedStudents = [...studentsData].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        // Étudiants récents
        newStats.recentStudents = sortedStudents.slice(0, 5).map((s) => ({
          id: s.id,
          name: s.user
            ? `${s.user.firstName} ${s.user.lastName}`
            : "Étudiant",
          matricule: s.matricule || "N/A",
          class: "N/A", // À améliorer avec les classes
          date: typeof s.createdAt === "string" ? s.createdAt : s.createdAt?.toISOString() || "",
        }));
      }

      // Traiter les classes
      if (classesRes.status === "fulfilled" && classesRes.value.success) {
        const classesData = classesRes.value.data || [];
        newStats.totalClasses = classesData.length;
      }

      // Traiter les enseignants
      if (teachersRes.status === "fulfilled" && teachersRes.value.success) {
        const teachersData = teachersRes.value.data || [];
        newStats.totalTeachers = teachersData.length;
      }

      // Traiter les affectations étudiant-classe
      if (
        studentClassesRes.status === "fulfilled" &&
        studentClassesRes.value.success
      ) {
        const studentClassesData = studentClassesRes.value.data || [];
        // Compter les affectations actives (sans date de fin)
        newStats.activeAssignments = studentClassesData.filter(
          (sc) => !sc.endDate
        ).length;
      }

      setStats(newStats);
    } catch (error) {
      console.error("Error loading scolarite stats:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">
              Service Scolarité - UPCD-ITAK
            </p>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour, {user.firstName} {user.lastName}
            </h1>
            <p className="text-blue-100">{formatDate(currentTime)}</p>
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
          title="Étudiants"
          value={stats.totalStudents}
          icon={<GraduationCap className="w-5 h-5" />}
          color="bg-blue-500"
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
          title="Enseignants"
          value={stats.totalTeachers}
          icon={<Users className="w-5 h-5" />}
          color="bg-emerald-500"
          loading={loading}
          link="/students"
        />
        <StatCard
          title="Affectations"
          value={stats.activeAssignments}
          icon={<UserCheck className="w-5 h-5" />}
          color="bg-amber-500"
          loading={loading}
          link="/settings/student-class-assignment"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-500" />
            Vue d'ensemble
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-600 font-medium">
                Total Étudiants
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {loading ? "..." : stats.totalStudents}
              </p>
            </div>
            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
              <p className="text-sm text-violet-600 font-medium">
                Total Classes
              </p>
              <p className="text-2xl font-bold text-violet-700">
                {loading ? "..." : stats.totalClasses}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium">
                Enseignants
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {loading ? "..." : stats.totalTeachers}
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-600 font-medium">
                Affectations Actives
              </p>
              <p className="text-2xl font-bold text-amber-700">
                {loading ? "..." : stats.activeAssignments}
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
              <strong>Gestion étudiante complète</strong>
            </p>
            <p className="text-xs text-slate-500">
              Gérez les inscriptions, les affectations aux classes, les notes et
              les diplômes des étudiants.
            </p>
          </div>
        </div>

        {/* Quick Actions & Recent Students */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/students"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600">
                  Étudiants
                </span>
              </Link>
              <Link
                to="/classes-subjects"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600">
                  Classes
                </span>
              </Link>
              <Link
                to="/settings/student-class-assignment"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600">
                  Affectations
                </span>
              </Link>
              <Link
                to="/calendar"
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600">
                  Calendrier
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Étudiants récents
            </h2>

            {stats.recentStudents.length > 0 ? (
              <div className="space-y-3">
                {stats.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {student.matricule} • {formatRelativeTime(student.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">
                Aucun étudiant récent
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

export default ScolariteDashboard;

