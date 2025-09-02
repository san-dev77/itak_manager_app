import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Shield,
  Users,
  BookOpen,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import logoItak from "../assets/logo itak.png";
import { apiService } from "../services/api";
import Notification, {
  type NotificationType,
} from "../components/ui/Notification";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // État pour les notifications
  const [notification, setNotification] = useState<{
    type: NotificationType;
    title: string;
    message: string;
    isVisible: boolean;
  }>({
    type: "info",
    title: "",
    message: "",
    isVisible: false,
  });

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      try {
        // Appel à l'API via le service
        const response = await apiService.login({
          email: formData.email,
          password: formData.password,
        });

        if (response.success && response.data) {
          // Stockage du token et des informations utilisateur
          const { user, token } = response.data;

          // Stockage local (vous pouvez utiliser localStorage ou sessionStorage)
          if (formData.rememberMe) {
            localStorage.setItem("itak_token", token);
            localStorage.setItem("itak_user", JSON.stringify(user));
          } else {
            sessionStorage.setItem("itak_token", token);
            sessionStorage.setItem("itak_user", JSON.stringify(user));
          }

          showNotification(
            "success",
            "Connexion réussie !",
            `Bienvenue ${user.first_name} ${user.last_name} !`
          );

          // Redirection vers le tableau de bord après 2 secondes
          setTimeout(() => {
            navigate("/dashboard"); // Vous devrez créer cette page
          }, 2000);
        } else {
          showNotification(
            "error",
            "Échec de la connexion",
            response.error || "Email ou mot de passe incorrect."
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        showNotification(
          "error",
          "Erreur de connexion",
          "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestion des Utilisateurs",
      description:
        "Accès sécurisé pour tous les membres de votre établissement",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Données Centralisées",
      description: "Toutes vos informations scolaires en un seul endroit",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sécurité Maximale",
      description:
        "Protection de vos données avec chiffrement de niveau bancaire",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Retour à l'accueil</span>
            </Link>

            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logoItak} alt="ITAK Manager" className="w-12 h-12" />
              <span className="text-2xl font-bold text-blue-900">
                ITAK Manager
              </span>
            </div>

            <h1 className="text-3xl font-bold text-blue-900 mb-2">Connexion</h1>
            <p className="text-blue-700">
              Accédez à votre espace de gestion scolaire
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Input
                  label="Adresse email"
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  icon={<Mail className="w-5 h-5" />}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <Input
                    label="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    icon={<Lock className="w-5 h-5" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <span className="text-sm text-blue-700">
                      Se souvenir de moi
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div className="divider my-6" variants={itemVariants}>
              <span className="text-blue-400 text-sm">ou</span>
            </motion.div>

            {/* Demo credentials */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Comptes de démonstration
                </span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>
                  <strong>Admin:</strong> admin@itak.com / admin123
                </div>
                <div>
                  <strong>Enseignant:</strong> teacher@itak.com / teacher123
                </div>
                <div>
                  <strong>Élève:</strong> student@itak.com / student123
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div className="text-center mt-6" variants={itemVariants}>
            <p className="text-blue-600 text-sm">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-blue-700 hover:text-blue-800 font-semibold transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Features & Info */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-12">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Bienvenue sur ITAK Manager
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              La plateforme moderne qui révolutionne la gestion scolaire.
              Simplifiez l'administration et améliorez l'expérience de tous.
            </p>
          </motion.div>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-blue-100 text-sm">Écoles</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50k+</div>
                <div className="text-blue-100 text-sm">Utilisateurs</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-blue-100 text-sm">Disponibilité</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={5000}
      />
    </div>
  );
};

export default LoginPage;
