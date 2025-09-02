import React from "react";
import Button from "../components/ui/Button";
import {
  GraduationCap,
  LogOut,
  User,
  Mail,
  Calendar,
  Phone,
  Users,
  Shield,
  Settings,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react";
import type { User as UserType } from "../types";

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const getRoleLabel = (role: string) => {
    const roleLabels = {
      student: "Étudiant",
      teacher: "Enseignant",
      staff: "Personnel",
      parent: "Parent",
      admin: "Administrateur",
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      student: "from-blue-400 to-blue-600",
      teacher: "from-purple-400 to-purple-600",
      staff: "from-green-400 to-green-600",
      parent: "from-orange-400 to-orange-600",
      admin: "from-red-400 to-red-600",
    };
    return (
      roleColors[role as keyof typeof roleColors] || "from-gray-400 to-gray-600"
    );
  };

  const getRoleIcon = (role: string) => {
    const roleIcons = {
      student: "🎓",
      teacher: "👨‍🏫",
      staff: "👷‍♂️",
      parent: "👨‍👩‍👧‍👦",
      admin: "👑",
    };
    return roleIcons[role as keyof typeof roleIcons] || "👤";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  ITAK
                </span>
                <div className="text-xs text-blue-300 font-medium tracking-wider">
                  ACADEMY
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-white/30 text-white hover:border-white/60 hover:bg-white/10 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl text-white rounded-full text-lg font-semibold border border-white/20 shadow-2xl mb-6">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Bienvenue sur votre tableau de bord
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              Bonjour, {user.first_name} ! 👋
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Accédez à toutes les fonctionnalités de votre espace personnel
              ITAK Academy
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-400" />
                  Informations personnelles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm text-white/60">Rôle</div>
                        <div className="text-white font-semibold">
                          {getRoleLabel(user.role)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-sm text-white/60">Email</div>
                        <div className="text-white font-semibold">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-sm text-white/60">
                          Nom d'utilisateur
                        </div>
                        <div className="text-white font-semibold">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {user.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-orange-400" />
                        <div>
                          <div className="text-sm text-white/60">Téléphone</div>
                          <div className="text-white font-semibold">
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    )}
                    {user.gender && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-pink-400" />
                        <div>
                          <div className="text-sm text-white/60">Genre</div>
                          <div className="text-white font-semibold capitalize">
                            {user.gender}
                          </div>
                        </div>
                      </div>
                    )}
                    {user.birth_date && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-sm text-white/60">
                            Date de naissance
                          </div>
                          <div className="text-white font-semibold">
                            {new Date(user.birth_date).toLocaleDateString(
                              "fr-FR"
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Role Badge */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${getRoleColor(
                    user.role
                  )} rounded-3xl flex items-center justify-center shadow-2xl mb-4`}
                >
                  <span className="text-4xl">{getRoleIcon(user.role)}</span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-2">
                    {getRoleLabel(user.role)}
                  </div>
                  <div className="text-sm text-white/60">
                    Membre ITAK Academy
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    Membre depuis{" "}
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Mes cours",
                description: "Accédez à vos formations",
                icon: BookOpen,
                color: "from-blue-400 to-blue-600",
                action: () => console.log("Cours"),
              },
              {
                title: "Progression",
                description: "Suivez votre avancement",
                icon: TrendingUp,
                color: "from-green-400 to-green-600",
                action: () => console.log("Progression"),
              },
              {
                title: "Certifications",
                description: "Vos diplômes obtenus",
                icon: Award,
                color: "from-purple-400 to-purple-600",
                action: () => console.log("Certifications"),
              },
              {
                title: "Paramètres",
                description: "Gérez votre compte",
                icon: Settings,
                color: "from-orange-400 to-orange-600",
                action: () => console.log("Paramètres"),
              },
            ].map((action, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-500`}
                  >
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">
                      {action.title}
                    </div>
                    <div className="text-white/70 text-sm">
                      {action.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
              Activité récente
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-white font-medium">
                    Connexion réussie
                  </div>
                  <div className="text-white/60 text-sm">
                    Vous vous êtes connecté à votre compte
                  </div>
                </div>
                <div className="text-white/40 text-sm">
                  {new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-white font-medium">
                    Profil mis à jour
                  </div>
                  <div className="text-white/60 text-sm">
                    Vos informations ont été synchronisées
                  </div>
                </div>
                <div className="text-white/40 text-sm">
                  {new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
