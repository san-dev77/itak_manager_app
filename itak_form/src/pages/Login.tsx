import React, { useState } from "react";
import Button from "../components/ui/Button";
import {
  GraduationCap,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Shield,
  Lock,
  AlertCircle,
} from "lucide-react";
import type { LoginFormData, User } from "../types";
import { apiService } from "../services/api";

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate?: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.login(formData);

      if (response.success && response.data) {
        onLogin(response.data);
      } else {
        setError(response.error || "Erreur de connexion");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <span className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  ITAK
                </span>
                <div className="text-sm text-blue-300 font-medium tracking-wider">
                  ACADEMY
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-white">Connexion</h1>
              <p className="text-xl text-white/70 font-light">
                Accédez à votre espace personnel
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm font-medium">
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white/90 mb-3 flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2 text-blue-400" />
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                    placeholder="votre@email.com"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white/90 mb-3 flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2 text-purple-400" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm pr-16"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500/50 bg-white/10"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="ml-3 text-sm text-white/70 group-hover:text-white transition-colors">
                    Se souvenir de moi
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors hover:scale-105"
                  disabled={isLoading}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300 text-lg py-4 rounded-2xl border-0 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Se connecter
                  </div>
                )}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="mt-8 text-center">
              <p className="text-white/60">
                Pas encore de compte ?{" "}
                <button
                  onClick={() => onNavigate?.("signup")}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:scale-105 inline-flex items-center"
                  disabled={isLoading}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  S'inscrire
                </button>
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate?.("home")}
              className="inline-flex items-center text-white/60 hover:text-white transition-all duration-300 hover:scale-105 group"
              disabled={isLoading}
            >
              <ArrowLeft
                size={18}
                className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
              />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
