import React, { useState } from "react";
import Button from "../components/ui/Button";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  User,
  Mail,
  Lock,
  CheckCircle,
  Shield,
  AlertCircle,
  Calendar,
  Phone,
  Users,
} from "lucide-react";
import logo from "../assets/logo itak.png";
import type { AuthFormData, User as UserType } from "../types";
import { apiService } from "../services/api";

interface SignupProps {
  onLogin: (user: UserType) => void;
  onNavigate?: (page: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin, onNavigate }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    gender: "",
    birth_date: "",
    phone: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.register(formData);

      if (response.success && response.data) {
        onLogin(response.data);
      } else {
        setError(response.error || "Erreur lors de l'inscription");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const passwordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthColor = (strength: number) => {
    if (strength <= 2) return "from-red-400 to-red-600";
    if (strength <= 3) return "from-yellow-400 to-yellow-600";
    return "from-green-400 to-green-600";
  };

  const strengthText = (strength: number) => {
    if (strength <= 2) return "Faible";
    if (strength <= 3) return "Moyen";
    return "Fort";
  };

  const strengthIcon = (strength: number) => {
    if (strength <= 2) return "😰";
    if (strength <= 3) return "😐";
    return "😎";
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
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <img
                src={logo}
                alt="ITAK Academy"
                className="w-16 h-16 object-contain"
              />
              <div>
                <span className="text-4xl font-black text-white">ITAK</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-white">
                Créer un compte
              </h1>
              <p className="text-xl text-white/70 font-light">
                Rejoignez notre communauté d'apprenants
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
              {/* Username Field */}
              <div className="group">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-white/90 mb-3"
                >
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-400" />
                    Nom d'utilisateur
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                    placeholder="votre_username"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    <User className="w-4 h-4 mr-2 text-green-400" />
                    Prénom
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Prénom"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    <User className="w-4 h-4 mr-2 text-blue-400" />
                    Nom
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Nom"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white/90 mb-3"
                >
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                    placeholder="votre@email.com"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Role and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label
                    htmlFor="role"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    <Users className="w-4 h-4 mr-2 text-blue-400" />
                    Rôle
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                      required
                      disabled={isLoading}
                    >
                      <option value="student">Étudiant</option>
                      <option value="teacher">Enseignant</option>
                      <option value="staff">Personnel</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Administrateur</option>
                    </select>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    <User className="w-4 h-4 mr-2 text-pink-400" />
                    Genre
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-4 focus:ring-pink-500/30 focus:border-pink-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="">Sélectionner</option>
                      <option value="male">Masculin</option>
                      <option value="female">Féminin</option>
                      <option value="other">Autre</option>
                    </select>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Birth Date and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label
                    htmlFor="birth_date"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    <Calendar className="w-4 h-4 mr-2 text-green-400" />
                    Date de naissance
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="birth_date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 backdrop-blur-sm"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-white/90 mb-3"
                  >
                    <Phone className="w-4 h-4 mr-2 text-blue-400" />
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm"
                      placeholder="+33 6 12 34 56 78"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white/90 mb-3"
                >
                  <Lock className="w-4 h-4 mr-2 text-blue-400" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm pr-16"
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
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-white/70">
                        Force du mot de passe
                      </span>
                      <span className="text-sm font-bold text-white">
                        {strengthIcon(passwordStrength(formData.password))}
                      </span>
                    </div>
                    <div className="flex space-x-2 mb-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                            level <= passwordStrength(formData.password)
                              ? `bg-gradient-to-r ${strengthColor(
                                  passwordStrength(formData.password)
                                )}`
                              : "bg-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold bg-gradient-to-r ${strengthColor(
                          passwordStrength(formData.password)
                        )} bg-clip-text text-transparent`}
                      >
                        {strengthText(passwordStrength(formData.password))}
                      </span>
                      <span className="text-xs text-white/50">
                        {passwordStrength(formData.password)}/5 critères
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-white/90 mb-3"
                >
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-4 focus:ring-green-500/30 focus:border-green-400 transition-all duration-300 backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-2 flex items-center space-x-2">
                    {formData.password === confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">
                          Les mots de passe correspondent
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-red-400"></div>
                        <span className="text-sm text-red-400 font-medium">
                          Les mots de passe ne correspondent pas
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-300 text-lg py-4 rounded-2xl border-0 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Création du compte...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Créer mon compte
                  </div>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-white/60">
                Déjà un compte ?{" "}
                <button
                  onClick={() => onNavigate?.("login")}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:scale-105 inline-flex items-center"
                  disabled={isLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Se connecter
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

export default Signup;
