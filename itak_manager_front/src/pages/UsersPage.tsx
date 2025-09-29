import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, EyeIcon, Plus, Search, Trash2 } from "lucide-react";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  apiService,
  type User,
  type StudentWithUser,
  type TeacherWithUser,
  type StaffWithUser,
} from "../services/api";
import Notification, {
  type NotificationType,
} from "../components/ui/Notification";
import {
  UserTabs,
  ProfileAssignmentModal,
  StudentDataTable,
  TeacherDataTable,
  StaffDataTable,
} from "../components/users";
import { useUserStore } from "../stores/userStore";
import { useUserEffects } from "../hooks/useUserEffects";

// Interface union pour les données de profil
// Supprimer cette ligne car elle entre en conflit avec les types importés

const UsersPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProfileAssignmentModal, setShowProfileAssignmentModal] =
    useState(false);
  const [selectedProfileType, setSelectedProfileType] = useState<
    "student" | "teacher" | "staff"
  >("student");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // États pour les compteurs et profils
  const [userCounts, setUserCounts] = useState({
    all: 0,
    students: 0,
    teachers: 0,
    staff: 0,
    parents: 0,
    admins: 0,
  });

  // Zustand store
  const {
    filteredUsers,
    isLoading,
    searchTerm,
    selectedRole,
    setUsers,
    setLoading,
    setSearchTerm,
    setSelectedRole,
    addUser,
  } = useUserStore();

  // Utiliser le hook pour les effets
  useUserEffects();

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

  const showNotification = useCallback(
    (type: NotificationType, title: string, message: string) => {
      setNotification({ type, title, message, isVisible: true });
    },
    []
  );

  // Fonction utilitaire pour vérifier la compatibilité rôle/profil
  const isProfileTypeCompatible = (
    userRole: string,
    profileType: string
  ): boolean => {
    switch (profileType) {
      case "student":
        return userRole === "student";
      case "teacher":
        return userRole === "teacher";
      case "staff":
        return userRole === "teacher" || userRole === "staff";
      default:
        return false;
    }
  };

  // Fonction pour calculer les compteurs en tenant compte des profils
  const calculateUserCounts = useCallback(async () => {
    try {
      // Récupérer tous les profils
      const [studentsRes, teachersRes, staffRes] = await Promise.all([
        apiService.getAllStudents(),
        apiService.getAllTeachers(),
        apiService.getAllStaff(),
      ]);

      const studentProfilesData = studentsRes.success
        ? studentsRes.data || []
        : [];
      const teacherProfilesData = teachersRes.success
        ? teachersRes.data || []
        : [];
      const staffProfilesData = staffRes.success ? staffRes.data || [] : [];

      // Calculer les compteurs
      const counts = {
        all: filteredUsers.length,
        students: filteredUsers.filter(
          (user) =>
            user.role === "student" ||
            studentProfilesData.some((profile) => profile.userId === user.id)
        ).length,
        teachers: filteredUsers.filter(
          (user) =>
            user.role === "teacher" ||
            teacherProfilesData.some((profile) => profile.user.id === user.id)
        ).length,
        staff: filteredUsers.filter(
          (user) =>
            user.role === "staff" ||
            user.role === "teacher" ||
            staffProfilesData.some((profile) => profile.userId === user.id)
        ).length,
        parents: filteredUsers.filter((user) => user.role === "parent").length,
        admins: filteredUsers.filter((user) => user.role === "admin").length,
      };

      setUserCounts(counts);
    } catch (error) {
      console.error("Erreur lors du calcul des compteurs:", error);
    }
  }, [filteredUsers]);

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Form data for creating new user
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    firstName: "",
    lastName: "",
    gender: "male",
    birthDate: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        showNotification(
          "error",
          "Erreur",
          "Impossible de récupérer les utilisateurs"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      showNotification("error", "Erreur", "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }, [setUsers, setLoading, showNotification]);

  useEffect(() => {
    // Vérifier l'authentification
    const userData =
      localStorage.getItem("itak_user") || sessionStorage.getItem("itak_user");
    const token =
      localStorage.getItem("itak_access_token") ||
      sessionStorage.getItem("itak_access_token");

    if (!userData || !token) {
      navigate("/login");
      return;
    }

    try {
      setCurrentUser(JSON.parse(userData));
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors du parsing des données utilisateur:", error);
      navigate("/login");
    }
  }, [navigate, fetchUsers]);

  // Calculer les compteurs quand les utilisateurs filtrés changent
  useEffect(() => {
    if (filteredUsers.length > 0) {
      calculateUserCounts();
    }
  }, [filteredUsers.length, calculateUserCounts]);

  // Recalculer les compteurs quand le refreshTrigger change
  useEffect(() => {
    if (filteredUsers.length > 0) {
      calculateUserCounts();
    }
  }, [refreshTrigger, filteredUsers.length, calculateUserCounts]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.username.trim())
      errors.username = "Le nom d'utilisateur est requis";
    if (!formData.email.trim()) errors.email = "L'email est requis";
    if (!formData.password.trim())
      errors.password = "Le mot de passe est requis";
    if (!formData.firstName.trim()) errors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim())
      errors.lastName = "Le nom de famille est requis";
    if (!formData.phone.trim()) errors.phone = "Le téléphone est requis";

    if (formData.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAssignProfile = (
    profileType: "student" | "teacher" | "staff"
  ) => {
    setSelectedProfileType(profileType);
    setShowProfileAssignmentModal(true);
  };

  const handleProfileAssignment = async (
    user: User,
    profileData: Record<string, unknown>
  ) => {
    try {
      // Validation du rôle avant la création du profil
      if (selectedProfileType === "student" && user.role !== "student") {
        showNotification(
          "error",
          "Erreur de rôle",
          "Seuls les utilisateurs avec le rôle 'étudiant' peuvent avoir un profil étudiant"
        );
        return;
      }

      if (selectedProfileType === "teacher" && user.role !== "teacher") {
        showNotification(
          "error",
          "Erreur de rôle",
          "Seuls les utilisateurs avec le rôle 'enseignant' peuvent avoir un profil enseignant"
        );
        return;
      }

      if (
        selectedProfileType === "staff" &&
        !["teacher", "staff"].includes(user.role)
      ) {
        showNotification(
          "error",
          "Erreur de rôle",
          "Seuls les utilisateurs avec le rôle 'enseignant' ou 'personnel' peuvent avoir un profil personnel"
        );
        return;
      }

      if (
        selectedProfileType === "student" &&
        "enrollmentDate" in profileData
      ) {
        // Préparer les données pour l'API (nouveau format)
        const studentData = {
          userId: user.id, // ID de l'utilisateur sélectionné
          matricule: String(profileData.matricule || ""),
          enrollmentDate: String(profileData.enrollmentDate || ""),
          photo: undefined, // Optionnel
          maritalStatus: String(profileData.maritalStatus || ""),
          fatherName: String(profileData.fatherName || ""),
          motherName: String(profileData.motherName || ""),
          tutorName: String(profileData.tutorName || ""),
          tutorPhone: String(profileData.tutorPhone || ""),
          address: String(profileData.address || ""),
          emergencyContact: String(profileData.emergencyContact || ""),
          notes: String(profileData.notes || ""),
        };

        // Appel API vers /api/students
        const response = await apiService.createStudentProfile(studentData);

        if (response.success) {
          showNotification(
            "success",
            "Succès",
            `Profil étudiant assigné avec succès à ${user.firstName} ${user.lastName}`
          );

          // Rafraîchir la liste des utilisateurs pour mettre à jour les compteurs
          fetchUsers();
          // Déclencher le rechargement des tables
          setRefreshTrigger((prev) => prev + 1);
          // Déclencher le rechargement des tables
          setRefreshTrigger((prev) => prev + 1);
        } else {
          showNotification(
            "error",
            "Erreur",
            response.error || "Erreur lors de l'assignation du profil étudiant"
          );
        }
      } else if (
        selectedProfileType === "teacher" &&
        "hireDate" in profileData
      ) {
        // Préparer les données pour l'API enseignants (nouveau format)
        const teacherData = {
          userId: user.id, // ID de l'utilisateur sélectionné
          matricule: String(profileData.matricule || ""),
          hireDate: String(profileData.hireDate || ""),
          photo: undefined, // Optionnel
          maritalStatus: String(profileData.maritalStatus || ""),
          diplomas: String(profileData.diplomas || ""),
          address: String(profileData.address || ""),
          emergencyContact: String(profileData.emergencyContact || ""),
          notes: String(profileData.notes || ""),
        };

        // Appel API vers /api/teachers
        const response = await apiService.createTeacherProfile(teacherData);

        if (response.success) {
          showNotification(
            "success",
            "Succès",
            `Profil enseignant assigné avec succès à ${user.firstName} ${user.lastName}`
          );
          fetchUsers();
          // Déclencher le rechargement des tables
          setRefreshTrigger((prev) => prev + 1);
        } else {
          showNotification(
            "error",
            "Erreur",
            response.error ||
              "Erreur lors de l'assignation du profil enseignant"
          );
        }
      } else if (selectedProfileType === "staff" && "hireDate" in profileData) {
        // Préparer les données pour l'API personnel (nouveau format)
        const staffData = {
          userId: user.id, // ID de l'utilisateur sélectionné
          matricule: String(profileData.matricule || ""),
          hireDate: String(profileData.hireDate || ""),
          position: String(profileData.position || ""),
          photo: undefined, // Optionnel
          maritalStatus: String(profileData.maritalStatus || ""),
          address: String(profileData.address || ""),
          emergencyContact: String(profileData.emergencyContact || ""),
          notes: String(profileData.notes || ""),
        };

        // Appel API vers /api/staff
        const response = await apiService.createStaffProfile(staffData);

        if (response.success) {
          showNotification(
            "success",
            "Succès",
            `Profil personnel assigné avec succès à ${user.firstName} ${user.lastName}`
          );
          fetchUsers();
          // Déclencher le rechargement des tables
          setRefreshTrigger((prev) => prev + 1);
        } else {
          showNotification(
            "error",
            "Erreur",
            response.error || "Erreur lors de l'assignation du profil personnel"
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation du profil:", error);
      showNotification(
        "error",
        "Erreur",
        "Erreur lors de l'assignation du profil"
      );
    }
  };

  const handleEditStudentProfile = (student: StudentWithUser) => {
    // Ouvrir la modal d'édition avec les données existantes
    setSelectedProfileType("student");
    setShowProfileAssignmentModal(true);
    // TODO: Passer les données existantes à la modal pour édition
    console.log("Édition du profil étudiant:", student);
  };

  const handleEditTeacherProfile = (teacher: TeacherWithUser) => {
    // Ouvrir la modal d'édition avec les données existantes
    setSelectedProfileType("teacher");
    setShowProfileAssignmentModal(true);
    // TODO: Passer les données existantes à la modal pour édition
    console.log("Édition du profil enseignant:", teacher);
  };

  const handleEditStaffProfile = (staff: StaffWithUser) => {
    // Ouvrir la modal d'édition avec les données existantes
    setSelectedProfileType("staff");
    setShowProfileAssignmentModal(true);
    // TODO: Passer les données existantes à la modal pour édition
    console.log("Édition du profil personnel:", staff);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const birthDate = formData.birthDate;
      //   if (birthDate) {
      //     const date = new Date(birthDate);
      //     if (isNaN(date.getTime())) {
      //       throw new Error("Date de naissance invalide");
      //     }
      //     birthDate = date.toISOString();
      //   }

      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role as
          | "student"
          | "teacher"
          | "staff"
          | "parent"
          | "admin",
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        birthDate: birthDate,
        phone: formData.phone,
      };

      const response = await apiService.createUser(userData);

      if (response.success) {
        showNotification("success", "Succès", "Utilisateur créé avec succès !");
        setShowCreateModal(false);
        resetForm();
        // Add user to store and refresh
        if (response.data) {
          addUser(response.data);
        }
      } else {
        showNotification(
          "error",
          "Erreur",
          response.error || "Erreur lors de la création"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      showNotification("error", "Erreur", "Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "student",
      firstName: "",
      lastName: "",
      gender: "male",
      birthDate: "",
      phone: "",
    });
    setFormErrors({});
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      student: "Élève",
      teacher: "Enseignant/Enseignante",
      staff: "Personnel administratif",
      parent: "Parent",
      admin: "Administrateur/Administratrice",
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      student: "bg-blue-100 text-blue-800",
      teacher: "bg-green-100 text-green-800",
      staff: "bg-purple-100 text-purple-800",
      parent: "bg-orange-100 text-orange-800",
      admin: "bg-red-100 text-red-800",
    };
    return roleColors[role] || "bg-gray-100 text-gray-800";
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      user={{
        firstName: currentUser?.firstName || "Utilisateur",
        lastName: currentUser?.lastName || "Anonyme",
        role: currentUser?.role || "user",
        email: currentUser?.email || "",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Gestion des Utilisateurs
            </h1>
            <p className="text-blue-600 mt-2">
              Gérez tous les utilisateurs de votre établissement
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvel Utilisateur
          </Button>
        </motion.div>

        {/* User Tabs */}
        <motion.div variants={itemVariants}>
          <UserTabs
            activeTab={selectedRole}
            onTabChange={setSelectedRole}
            userCounts={userCounts}
            onAssignProfile={handleAssignProfile}
          />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900 bg-white"
              >
                <option value="all">Tous les rôles</option>
                <option value="student">Élèves</option>
                <option value="teacher">Enseignants</option>
                <option value="staff">Personnel administratif</option>
                <option value="parent">Parents</option>
                <option value="admin">Administrateurs</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-blue-600">
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </div>
        </motion.div>

        {/* Users List or Profile Data based on selected role */}
        {selectedRole === "student" ? (
          <StudentDataTable
            onEditProfile={handleEditStudentProfile}
            refreshTrigger={refreshTrigger}
            users={filteredUsers}
            isProfileTypeCompatible={isProfileTypeCompatible}
          />
        ) : selectedRole === "teacher" ? (
          <TeacherDataTable
            onEditProfile={handleEditTeacherProfile}
            refreshTrigger={refreshTrigger}
            users={filteredUsers}
            isProfileTypeCompatible={isProfileTypeCompatible}
          />
        ) : selectedRole === "staff" ? (
          <StaffDataTable
            onEditProfile={handleEditStaffProfile}
            refreshTrigger={refreshTrigger}
            users={filteredUsers}
            isProfileTypeCompatible={isProfileTypeCompatible}
          />
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-600">Chargement des utilisateurs...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-blue-600">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-50 border-b border-blue-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                              {user.firstName?.charAt(0) || "U"}
                              {user.lastName?.charAt(0) || "U"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-blue-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-blue-600">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-blue-600">
                            {user.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Actif
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900">
                Créer un nouvel utilisateur
              </h2>
              <p className="text-blue-600 mt-2">
                Remplissez les informations ci-dessous
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nom d'utilisateur"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={formErrors.username}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  required
                />

                <Input
                  label="Mot de passe"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={formErrors.password}
                  required
                />

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">
                      Rôle
                    </span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                  >
                    <option value="student">Élève</option>
                    <option value="teacher">Enseignant/Enseignante</option>
                    <option value="staff">Personnel administratif</option>
                    <option value="parent">Parent</option>
                    <option value="admin">
                      Administrateur/Administratrice
                    </option>
                  </select>
                </div>

                <Input
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={formErrors.firstName}
                  required
                />

                <Input
                  label="Nom de famille"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={formErrors.lastName}
                  required
                />

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">
                      Genre
                    </span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                  >
                    <option value="male">Masculin</option>
                    <option value="female">Féminin</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <Input
                  label="Date de naissance"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />

                <Input
                  label="Téléphone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-blue-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? "Création..." : "Créer l'utilisateur"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full"
          >
            <div className="p-6 border-b border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xl">
                  {selectedUser.firstName?.charAt(0) || "U"}
                  {selectedUser.lastName?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <p className="text-blue-600">@{selectedUser.username}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-600">Rôle:</span>
                  <span className="ml-2 text-blue-900">
                    {getRoleLabel(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Genre:</span>
                  <span className="ml-2 text-blue-900">
                    {selectedUser.gender === "male"
                      ? "Masculin"
                      : selectedUser.gender === "female"
                      ? "Féminin"
                      : "Autre"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Email:</span>
                  <span className="ml-2 text-blue-900">
                    {selectedUser.email}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Téléphone:</span>
                  <span className="ml-2 text-blue-900">
                    {selectedUser.phone}
                  </span>
                </div>
                {selectedUser.birthDate && (
                  <div className="col-span-2">
                    <span className="font-medium text-blue-600">
                      Date de naissance:
                    </span>
                    <span className="ml-2 text-blue-900">
                      {new Date(selectedUser.birthDate).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-blue-100 flex justify-end">
              <Button onClick={() => setShowUserModal(false)} variant="outline">
                Fermer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Profile Assignment Modal */}
      {showProfileAssignmentModal && (
        <ProfileAssignmentModal
          isOpen={showProfileAssignmentModal}
          onClose={() => setShowProfileAssignmentModal(false)}
          profileType={selectedProfileType}
          onAssignProfile={handleProfileAssignment}
          existingUsers={filteredUsers}
        />
      )}{" "}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={5000}
      />
    </Layout>
  );
};

export default UsersPage;
