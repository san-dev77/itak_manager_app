import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, UserPlus, X, Check } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type {
  User,
  StudentProfileData,
  TeacherProfileData,
  StaffProfileData,
} from "../../services/api";

interface ProfileAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileType: "student" | "teacher" | "staff";
  onAssignProfile: (
    user: User,
    profileData: StudentProfileData | TeacherProfileData | StaffProfileData
  ) => void | Promise<void>;
  existingUsers: User[];
  preselectedUser?: User | null;
  existingProfileData?:
    | StudentProfileData
    | TeacherProfileData
    | StaffProfileData
    | null;
}

const ProfileAssignmentModal = ({
  isOpen,
  onClose,
  profileType,
  onAssignProfile,
  existingUsers,
  preselectedUser,
  existingProfileData,
}: ProfileAssignmentModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(
    preselectedUser || null
  );
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showProfileForm, setShowProfileForm] = useState(!!preselectedUser);

  // Form data for student profile
  const [studentProfile, setStudentProfile] = useState<
    Partial<StudentProfileData>
  >({
    matricule: "",
    enrollmentDate: "",
    photo: undefined,
    maritalStatus: "single",
    fatherName: "",
    motherName: "",
    tutorName: "",
    tutorPhone: "",
    address: "",
    emergencyContact: "",
    notes: "",
  });

  // Form data for teacher profile
  const [teacherProfile, setTeacherProfile] = useState<
    Partial<TeacherProfileData>
  >({
    matricule: "",
    hireDate: "",
    photo: undefined,
    maritalStatus: "single",
    diplomas: "",
    address: "",
    emergencyContact: "",
    notes: "",
  });

  // Form data for staff profile
  const [staffProfile, setStaffProfile] = useState<Partial<StaffProfileData>>({
    matricule: "",
    hireDate: "",
    photo: undefined,
    maritalStatus: "single",
    position: "",
    address: "",
    emergencyContact: "",
    notes: "",
  });

  // Initialiser le formulaire avec les données existantes si disponibles
  useEffect(() => {
    if (existingProfileData && preselectedUser) {
      if (
        profileType === "student" &&
        "enrollmentDate" in existingProfileData
      ) {
        setStudentProfile({
          matricule: existingProfileData.matricule || "",
          enrollmentDate: existingProfileData.enrollmentDate || "",
          maritalStatus: existingProfileData.maritalStatus || "single",
          fatherName: existingProfileData.fatherName || "",
          motherName: existingProfileData.motherName || "",
          tutorName: existingProfileData.tutorName || "",
          tutorPhone: existingProfileData.tutorPhone || "",
          address: existingProfileData.address || "",
          emergencyContact: existingProfileData.emergencyContact || "",
          notes: existingProfileData.notes || "",
        });
      } else if (
        profileType === "teacher" &&
        "hireDate" in existingProfileData &&
        "diplomas" in existingProfileData
      ) {
        setTeacherProfile({
          matricule: existingProfileData.matricule || "",
          hireDate: existingProfileData.hireDate || "",
          maritalStatus: existingProfileData.maritalStatus || "single",
          diplomas: existingProfileData.diplomas || "",
          address: existingProfileData.address || "",
          emergencyContact: existingProfileData.emergencyContact || "",
          notes: existingProfileData.notes || "",
        });
      } else if (
        profileType === "staff" &&
        "hireDate" in existingProfileData &&
        "position" in existingProfileData
      ) {
        setStaffProfile({
          matricule: existingProfileData.matricule || "",
          hireDate: existingProfileData.hireDate || "",
          maritalStatus: existingProfileData.maritalStatus || "single",
          position: existingProfileData.position || "",
          address: existingProfileData.address || "",
          emergencyContact: existingProfileData.emergencyContact || "",
          notes: existingProfileData.notes || "",
        });
      }
    }
  }, [existingProfileData, preselectedUser, profileType]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = existingUsers.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      // Afficher tous les utilisateurs par défaut
      setFilteredUsers(existingUsers);
    }
  }, [searchTerm, existingUsers]);

  // Réinitialiser l'état quand la modale s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      setSelectedUser(preselectedUser || null);
      setShowProfileForm(!!preselectedUser);
    } else {
      // Réinitialiser quand la modale se ferme
      setSelectedUser(null);
      setShowProfileForm(false);
      setSearchTerm("");
    }
  }, [isOpen, preselectedUser]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowProfileForm(true);
  };

  // const handleBackToSelection = () => {
  //   setShowProfileForm(false);
  //   setSelectedUser(null);
  //   // Ne pas réinitialiser les formulaires ici, juste revenir à la sélection
  // };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      let profileData:
        | StudentProfileData
        | TeacherProfileData
        | StaffProfileData;

      switch (profileType) {
        case "student":
          profileData = {
            id: undefined,
            userId: selectedUser.id,
            matricule: studentProfile.matricule || "",
            enrollmentDate: studentProfile.enrollmentDate
              ? typeof studentProfile.enrollmentDate === "string"
                ? studentProfile.enrollmentDate
                : studentProfile.enrollmentDate.toISOString()
              : "",
            photo: studentProfile.photo,
            maritalStatus: studentProfile.maritalStatus,
            fatherName: studentProfile.fatherName,
            motherName: studentProfile.motherName,
            tutorName: studentProfile.tutorName,
            tutorPhone: studentProfile.tutorPhone,
            address: studentProfile.address,
            emergencyContact: studentProfile.emergencyContact,
            notes: studentProfile.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: selectedUser,
          };
          break;
        case "teacher":
          profileData = {
            id: undefined,
            userId: selectedUser.id,
            matricule: teacherProfile.matricule || "",
            hireDate: teacherProfile.hireDate
              ? typeof teacherProfile.hireDate === "string"
                ? teacherProfile.hireDate
                : teacherProfile.hireDate.toString()
              : new Date().toISOString(),
            photo: teacherProfile.photo,
            maritalStatus: teacherProfile.maritalStatus,
            diplomas: teacherProfile.diplomas,
            address: teacherProfile.address,
            emergencyContact: teacherProfile.emergencyContact,
            notes: teacherProfile.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: selectedUser,
          };
          break;
        case "staff":
          profileData = {
            id: undefined,
            userId: selectedUser.id,
            matricule: staffProfile.matricule || "",
            hireDate: staffProfile.hireDate
              ? typeof staffProfile.hireDate === "string"
                ? staffProfile.hireDate
                : staffProfile.hireDate.toString()
              : new Date().toISOString(),
            photo: staffProfile.photo,
            maritalStatus: staffProfile.maritalStatus,
            position: staffProfile.position,
            address: staffProfile.address,
            emergencyContact: staffProfile.emergencyContact,
            notes: staffProfile.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: selectedUser,
          };
          break;
        default:
          profileData = {
            id: undefined,
            userId: selectedUser.id,
            matricule: studentProfile.matricule || "",
            enrollmentDate: studentProfile.enrollmentDate
              ? typeof studentProfile.enrollmentDate === "string"
                ? studentProfile.enrollmentDate
                : studentProfile.enrollmentDate.toISOString()
              : "",
            photo: studentProfile.photo,
            maritalStatus: studentProfile.maritalStatus,
            fatherName: studentProfile.fatherName,
            motherName: studentProfile.motherName,
            tutorName: studentProfile.tutorName,
            tutorPhone: studentProfile.tutorPhone,
            address: studentProfile.address,
            emergencyContact: studentProfile.emergencyContact,
            notes: studentProfile.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: selectedUser,
          };
      }

      onAssignProfile(selectedUser, profileData);
      handleCloseModal();
    }
  };

  const resetForm = () => {
    setStudentProfile({
      matricule: "",
      enrollmentDate: "",
      photo: undefined,
      maritalStatus: "single",
      fatherName: "",
      motherName: "",
      tutorName: "",
      tutorPhone: "",
      address: "",
      emergencyContact: "",
      notes: "",
    });
    setTeacherProfile({
      matricule: "",
      hireDate: "",
      photo: undefined,
      maritalStatus: "single",
      diplomas: "",
      address: "",
      emergencyContact: "",
      notes: "",
    });
    setStaffProfile({
      matricule: "",
      hireDate: "",
      photo: undefined,
      maritalStatus: "single",
      position: "",
      address: "",
      emergencyContact: "",
      notes: "",
    });
    setSelectedUser(null);
    setShowProfileForm(false);
    setSearchTerm("");
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const getProfileTypeLabel = () => {
    switch (profileType) {
      case "student":
        return "Élève";
      case "teacher":
        return "Enseignant";
      case "staff":
        return "Personnel administratif";
      default:
        return "Utilisateur";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Assigner un profil {getProfileTypeLabel()}
            </h2>
            <p className="text-slate-600 mt-2">
              Sélectionnez un utilisateur et configurez son profil
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!showProfileForm ? (
            /* User Selection Step */
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Étape 1: Sélectionner un utilisateur
                </h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher un utilisateur par nom, email ou nom d'utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-slate-800">
                    {searchTerm
                      ? `Résultats de recherche (${filteredUsers.length})`
                      : `Tous les utilisateurs (${filteredUsers.length})`}
                  </h4>
                  {!searchTerm && (
                    <span className="text-sm text-slate-600">
                      Commencez à taper pour filtrer
                    </span>
                  )}
                </div>
              </div>

              {/* User List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucun utilisateur trouvé
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.firstName?.charAt(0) || "?"}
                          {user.lastName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.firstName || "Prénom"}{" "}
                            {user.lastName || "Nom"}
                          </div>
                          <div className="text-sm text-slate-600">
                            @{user.username} • {user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rôle actuel: {user.role}
                          </div>
                        </div>
                      </div>
                      <UserPlus className="w-5 h-5 text-slate-500" />
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Profile Configuration Step */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-900">
                  Étape 2: Configurer le profil {getProfileTypeLabel()}
                </h3>
              </div>

              {selectedUser && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-medium text-xl">
                      {selectedUser.firstName?.charAt(0) || "?"}
                      {selectedUser.lastName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-lg">
                        {selectedUser.firstName || "Prénom"}{" "}
                        {selectedUser.lastName || "Nom"}
                      </div>
                      <div className="text-slate-600">
                        @{selectedUser.username} • {selectedUser.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileType === "student" && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Matricule"
                      name="matricule"
                      value={studentProfile.matricule}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          matricule: e.target.value,
                        })
                      }
                      required
                    />

                    <Input
                      label="Date d'inscription"
                      name="enrollmentDate"
                      type="date"
                      value={
                        typeof studentProfile.enrollmentDate === "string"
                          ? studentProfile.enrollmentDate
                          : studentProfile.enrollmentDate instanceof Date
                          ? studentProfile.enrollmentDate
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          enrollmentDate: e.target.value,
                        })
                      }
                      required
                    />

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-slate-700 font-medium">
                          Statut matrimonial
                        </span>
                      </label>
                      <select
                        value={studentProfile.maritalStatus}
                        onChange={(e) =>
                          setStudentProfile({
                            ...studentProfile,
                            maritalStatus: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                      >
                        <option value="single">Célibataire</option>
                        <option value="married">Marié(e)</option>
                        <option value="divorced">Divorcé(e)</option>
                        <option value="widowed">Veuf/Veuve</option>
                      </select>
                    </div>

                    <Input
                      label="Nom du père"
                      name="fatherName"
                      value={studentProfile.fatherName}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          fatherName: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Nom de la mère"
                      name="motherName"
                      value={studentProfile.motherName}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          motherName: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Nom du tuteur"
                      name="tutorName"
                      value={studentProfile.tutorName}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          tutorName: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Téléphone du tuteur"
                      name="tutorPhone"
                      value={studentProfile.tutorPhone}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          tutorPhone: e.target.value,
                        })
                      }
                    />

                    <div className="col-span-2">
                      <Input
                        label="Adresse"
                        name="address"
                        value={studentProfile.address}
                        onChange={(e) =>
                          setStudentProfile({
                            ...studentProfile,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Input
                      label="Contact d'urgence"
                      name="emergencyContact"
                      value={studentProfile.emergencyContact}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          emergencyContact: e.target.value,
                        })
                      }
                    />

                    <div className="col-span-2">
                      <label className="label">
                        <span className="label-text text-slate-700 font-medium">
                          Notes
                        </span>
                      </label>
                      <textarea
                        value={studentProfile.notes}
                        onChange={(e) =>
                          setStudentProfile({
                            ...studentProfile,
                            notes: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                        rows={3}
                        placeholder="Informations supplémentaires..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-blue-100">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Annuler
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Assigner le profil
                    </Button>
                  </div>
                </form>
              )}

              {profileType === "teacher" && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Matricule"
                      name="matricule"
                      value={teacherProfile.matricule}
                      onChange={(e) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          matricule: e.target.value,
                        })
                      }
                      required
                    />

                    <Input
                      label="Date d'embauche"
                      name="hireDate"
                      type="date"
                      value={
                        teacherProfile.hireDate
                          ? typeof teacherProfile.hireDate === "string"
                            ? teacherProfile.hireDate
                            : teacherProfile.hireDate instanceof Date
                            ? teacherProfile.hireDate
                                .toISOString()
                                .split("T")[0]
                            : ""
                          : ""
                      }
                      onChange={(e) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          hireDate: e.target.value,
                        })
                      }
                      required
                    />

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-slate-700 font-medium">
                          Statut matrimonial
                        </span>
                      </label>
                      <select
                        value={teacherProfile.maritalStatus}
                        onChange={(e) =>
                          setTeacherProfile({
                            ...teacherProfile,
                            maritalStatus: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                      >
                        <option value="single">Célibataire</option>
                        <option value="married">Marié(e)</option>
                        <option value="divorced">Divorcé(e)</option>
                        <option value="widowed">Veuf/Veuve</option>
                      </select>
                    </div>

                    <Input
                      label="Diplômes"
                      name="diplomas"
                      value={teacherProfile.diplomas}
                      onChange={(e) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          diplomas: e.target.value,
                        })
                      }
                      required
                    />

                    <div className="col-span-2">
                      <Input
                        label="Adresse"
                        name="address"
                        value={teacherProfile.address}
                        onChange={(e) =>
                          setTeacherProfile({
                            ...teacherProfile,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Input
                      label="Contact d'urgence"
                      name="emergencyContact"
                      value={teacherProfile.emergencyContact}
                      onChange={(e) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          emergencyContact: e.target.value,
                        })
                      }
                    />

                    <div className="col-span-2">
                      <label className="label">
                        <span className="label-text text-slate-700 font-medium">
                          Notes
                        </span>
                      </label>
                      <textarea
                        value={teacherProfile.notes}
                        onChange={(e) =>
                          setTeacherProfile({
                            ...teacherProfile,
                            notes: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                        rows={3}
                        placeholder="Informations supplémentaires..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-blue-100">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Annuler
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Assigner le profil
                    </Button>
                  </div>
                </form>
              )}

              {profileType === "staff" && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Matricule"
                      name="matricule"
                      value={staffProfile.matricule}
                      onChange={(e) =>
                        setStaffProfile({
                          ...staffProfile,
                          matricule: e.target.value,
                        })
                      }
                      required
                    />

                    <Input
                      label="Date d'embauche"
                      name="hireDate"
                      type="date"
                      value={
                        staffProfile.hireDate
                          ? typeof staffProfile.hireDate === "string"
                            ? staffProfile.hireDate
                            : staffProfile.hireDate instanceof Date
                            ? staffProfile.hireDate.toISOString().split("T")[0]
                            : ""
                          : ""
                      }
                      onChange={(e) =>
                        setStaffProfile({
                          ...staffProfile,
                          hireDate: e.target.value,
                        })
                      }
                      required
                    />

                    <Input
                      label="Poste"
                      name="position"
                      value={staffProfile.position}
                      onChange={(e) =>
                        setStaffProfile({
                          ...staffProfile,
                          position: e.target.value,
                        })
                      }
                      required
                    />

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text text-slate-700 font-medium">
                          Statut matrimonial
                        </span>
                      </label>
                      <select
                        value={staffProfile.maritalStatus}
                        onChange={(e) =>
                          setStaffProfile({
                            ...staffProfile,
                            maritalStatus: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                      >
                        <option value="single">Célibataire</option>
                        <option value="married">Marié(e)</option>
                        <option value="divorced">Divorcé(e)</option>
                        <option value="widowed">Veuf/Veuve</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <Input
                        label="Adresse"
                        name="address"
                        value={staffProfile.address}
                        onChange={(e) =>
                          setStaffProfile({
                            ...staffProfile,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Input
                      label="Contact d'urgence"
                      name="emergencyContact"
                      value={staffProfile.emergencyContact}
                      onChange={(e) =>
                        setStaffProfile({
                          ...staffProfile,
                          emergencyContact: e.target.value,
                        })
                      }
                    />

                    <div className="col-span-2">
                      <label className="label">
                        <span className="label-text text-slate-700 font-medium">
                          Notes
                        </span>
                      </label>
                      <textarea
                        value={staffProfile.notes}
                        onChange={(e) =>
                          setStaffProfile({
                            ...staffProfile,
                            notes: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                        rows={3}
                        placeholder="Informations supplémentaires..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-blue-100">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Annuler
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Assigner le profil
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileAssignmentModal;
