import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Phone,
  CheckCircle,
  Shield,
  Users,
  BookOpen,
  Calendar,
  UserCheck,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import logoItak from "../assets/logo itak.png";
import { apiService, type UserRegistrationData } from "../services/api";
import Notification, {
  type NotificationType,
} from "../components/ui/Notification";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // student, teacher, staff, parent, admin
    first_name: "",
    last_name: "",
    gender: "",
    birth_date: "",
    phone: "",
    acceptTerms: false,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

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

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    } else if (formData.username.length < 3) {
      newErrors.username =
        "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Le prénom est requis";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Le nom de famille est requis";
    }

    if (!formData.gender) {
      newErrors.gender = "Le genre est requis";
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "La date de naissance est requise";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      try {
        // Prepare data for API (remove confirmPassword and acceptTerms)
        const userData: UserRegistrationData = {
          username: formData.username,
          email: formData.email,
          password: formData.password, // This will be hashed on the backend
          role: formData.role,
          first_name: formData.first_name,
          last_name: formData.last_name,
          gender: formData.gender,
          birth_date: formData.birth_date,
          phone: formData.phone,
        };

        // Appel à l'API via le service
        const response = await apiService.createUser(userData);

        if (response.success) {
          showNotification(
            "success",
            "Compte créé avec succès !",
            "Votre compte a été créé. Vous pouvez maintenant vous connecter."
          );

          // Redirection vers la page de connexion après 2 secondes
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          showNotification(
            "error",
            "Erreur lors de la création",
            response.error ||
              "Une erreur est survenue lors de la création du compte."
          );
        }
      } catch (error) {
        console.error("Registration error:", error);
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
      title: "Gestion Complète",
      description: "Tous les aspects de votre école en une seule plateforme",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Interface Intuitive",
      description: "Facile à utiliser pour tous les membres de votre équipe",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sécurité Garantie",
      description: "Vos données sont protégées avec les meilleurs standards",
    },
  ];

  const roleOptions = [
    { value: "student", label: "Élève" },
    { value: "teacher", label: "Enseignant/Enseignante" },
    { value: "staff", label: "Personnel administratif" },
    { value: "parent", label: "Parent" },
    { value: "admin", label: "Administrateur/Administratrice" },
  ];

  const genderOptions = [
    { value: "male", label: "Masculin" },
    { value: "female", label: "Féminin" },
    { value: "other", label: "Autre" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Notification */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={5000}
      />

      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-lg"
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

            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-blue-700">
              Rejoignez ITAK Manager et accédez à votre espace
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2">
                  Informations du compte
                </h3>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Nom d'utilisateur"
                    type="text"
                    name="username"
                    placeholder="Votre nom d'utilisateur"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={errors.username}
                    icon={<UserCheck className="w-5 h-5" />}
                  />
                </motion.div>

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

                <div className="grid md:grid-cols-2 gap-4">
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
                    <div className="relative">
                      <Input
                        label="Confirmer le mot de passe"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                        icon={<Lock className="w-5 h-5" />}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2">
                  Informations personnelles
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <Input
                      label="Prénom"
                      type="text"
                      name="first_name"
                      placeholder="Votre prénom"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      error={errors.first_name}
                      icon={<User className="w-5 h-5" />}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Input
                      label="Nom de famille"
                      type="text"
                      name="last_name"
                      placeholder="Votre nom"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      error={errors.last_name}
                      icon={<User className="w-5 h-5" />}
                    />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Genre
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white text-slate-800 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    >
                      <option value="" className="text-slate-800">
                        Sélectionnez votre genre
                      </option>
                      {genderOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="text-slate-800"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.gender && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.gender}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Input
                      label="Date de naissance"
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      error={errors.birth_date}
                      icon={<Calendar className="w-5 h-5 " />}
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Numéro de téléphone"
                    type="tel"
                    name="phone"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    icon={<Phone className="w-5 h-5" />}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Rôle dans l'établissement
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white text-slate-800 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  >
                    {roleOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="text-slate-800"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="text-sm text-blue-700">
                    <span>
                      J'accepte les{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                      >
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                      >
                        politique de confidentialité
                      </a>
                    </span>
                    {errors.acceptTerms && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.acceptTerms}
                      </div>
                    )}
                  </div>
                </label>
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
                      Création du compte...
                    </div>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div className="text-center mt-6" variants={itemVariants}>
              <p className="text-blue-600 text-sm">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="text-blue-700 hover:text-blue-800 font-semibold transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </motion.div>
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
              Rejoignez la révolution scolaire
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Des centaines d'écoles font déjà confiance à ITAK Manager.
              Simplifiez votre administration et améliorez l'expérience de tous.
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

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <h3 className="text-xl font-semibold mb-4">
              Pourquoi choisir ITAK Manager ?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-blue-100">Essai gratuit de 30 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-blue-100">Support technique 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-blue-100">Mise à jour automatique</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-blue-100">
                  Formation gratuite incluse
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
