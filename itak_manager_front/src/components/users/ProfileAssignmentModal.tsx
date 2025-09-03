import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, UserPlus, X, Check } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { User } from "../../services/api";

interface ProfileAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileType: "student" | "teacher" | "staff";
  onAssignProfile: (
    user: User,
    profileData: StudentProfileData | TeacherProfileData | StaffProfileData
  ) => void;
  existingUsers: User[];
}

interface StudentProfileData {
  matricule: string;
  enrollment_date: string;
  photo: string | null;
  marital_status: string;
  father_name: string;
  mother_name: string;
  tutor_name: string;
  tutor_phone: string;
  address: string;
  emergency_contact: string;
  notes: string;
}

interface TeacherProfileData {
  matricule: string;
  hire_date: string;
  photo: string | null;
  marital_status: string;
  specialty: string;
  diplomas: string;
  address: string;
  emergency_contact: string;
  notes: string;
}

interface StaffProfileData {
  matricule: string;
  hire_date: string;
  position: string;
  photo: string | null;
  marital_status: string;
  address: string;
  emergency_contact: string;
  notes: string;
}

const ProfileAssignmentModal = ({
  isOpen,
  onClose,
  profileType,
  onAssignProfile,
  existingUsers,
}: ProfileAssignmentModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Form data for student profile
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>({
    matricule: "",
    enrollment_date: "",
    photo: null,
    marital_status: "single",
    father_name: "",
    mother_name: "",
    tutor_name: "",
    tutor_phone: "",
    address: "",
    emergency_contact: "",
    notes: "",
  });

  // Form data for teacher profile
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfileData>({
    matricule: "",
    hire_date: "",
    photo: null,
    marital_status: "single",
    specialty: "",
    diplomas: "",
    address: "",
    emergency_contact: "",
    notes: "",
  });

  // Form data for staff profile
  const [staffProfile, setStaffProfile] = useState<StaffProfileData>({
    matricule: "",
    hire_date: "",
    photo: null,
    marital_status: "single",
    position: "",
    address: "",
    emergency_contact: "",
    notes: "",
  });

  useEffect(() => {
    if (searchTerm) {
      const filtered = existingUsers.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      // Afficher tous les utilisateurs par défaut
      setFilteredUsers(existingUsers);
    }
  }, [searchTerm, existingUsers]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowProfileForm(true);
  };

  const handleBackToSelection = () => {
    setShowProfileForm(false);
    setSelectedUser(null);
    // Ne pas réinitialiser les formulaires ici, juste revenir à la sélection
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      let profileData:
        | StudentProfileData
        | TeacherProfileData
        | StaffProfileData;

      switch (profileType) {
        case "student":
          profileData = studentProfile;
          break;
        case "teacher":
          profileData = teacherProfile;
          break;
        case "staff":
          profileData = staffProfile;
          break;
        default:
          profileData = studentProfile;
      }

      onAssignProfile(selectedUser, profileData);
      handleCloseModal();
    }
  };

  const resetForm = () => {
    setStudentProfile({
      matricule: "",
      enrollment_date: "",
      photo: null,
      marital_status: "single",
      father_name: "",
      mother_name: "",
      tutor_name: "",
      tutor_phone: "",
      address: "",
      emergency_contact: "",
      notes: "",
    });
    setTeacherProfile({
      matricule: "",
      hire_date: "",
      photo: null,
      marital_status: "single",
      specialty: "",
      diplomas: "",
      address: "",
      emergency_contact: "",
      notes: "",
    });
    setStaffProfile({
      matricule: "",
      hire_date: "",
      photo: null,
      marital_status: "single",
      position: "",
      address: "",
      emergency_contact: "",
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
        <div className="p-6 border-b border-blue-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">
              Assigner un profil {getProfileTypeLabel()}
            </h2>
            <p className="text-blue-600 mt-2">
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
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Étape 1: Sélectionner un utilisateur
                </h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher un utilisateur par nom, email ou nom d'utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-blue-800">
                    {searchTerm
                      ? `Résultats de recherche (${filteredUsers.length})`
                      : `Tous les utilisateurs (${filteredUsers.length})`}
                  </h4>
                  {!searchTerm && (
                    <span className="text-sm text-blue-600">
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
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.first_name.charAt(0)}
                          {user.last_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-blue-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-blue-600">
                            @{user.username} • {user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rôle actuel: {user.role}
                          </div>
                        </div>
                      </div>
                      <UserPlus className="w-5 h-5 text-blue-500" />
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
                <Button
                  variant="outline"
                  onClick={handleBackToSelection}
                  className="text-sm"
                >
                  ← Retour à la sélection
                </Button>
              </div>

              {selectedUser && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xl">
                      {selectedUser.first_name.charAt(0)}
                      {selectedUser.last_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900 text-lg">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </div>
                      <div className="text-blue-600">
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
                      name="enrollment_date"
                      type="date"
                      value={studentProfile.enrollment_date}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          enrollment_date: e.target.value,
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
                        value={studentProfile.marital_status}
                        onChange={(e) =>
                          setStudentProfile({
                            ...studentProfile,
                            marital_status: e.target.value,
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
                      name="father_name"
                      value={studentProfile.father_name}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          father_name: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Nom de la mère"
                      name="mother_name"
                      value={studentProfile.mother_name}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          mother_name: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Nom du tuteur"
                      name="tutor_name"
                      value={studentProfile.tutor_name}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          tutor_name: e.target.value,
                        })
                      }
                    />

                    <Input
                      label="Téléphone du tuteur"
                      name="tutor_phone"
                      value={studentProfile.tutor_phone}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          tutor_phone: e.target.value,
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
                      name="emergency_contact"
                      value={studentProfile.emergency_contact}
                      onChange={(e) =>
                        setStudentProfile({
                          ...studentProfile,
                          emergency_contact: e.target.value,
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
                      name="hire_date"
                      type="date"
                      value={teacherProfile.hire_date}
                      onChange={(e) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          hire_date: e.target.value,
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
                        value={teacherProfile.marital_status}
                        onChange={(e) =>
                          setTeacherProfile({
                            ...teacherProfile,
                            marital_status: e.target.value,
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
                      label="Spécialité"
                      name="specialty"
                      value={teacherProfile.specialty}
                      onChange={(e) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          specialty: e.target.value,
                        })
                      }
                      required
                    />

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
                      name="emergency_contact"
                      value={teacherProfile.emergency_contact}
                      onChange={(e) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          emergency_contact: e.target.value,
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
                      name="hire_date"
                      type="date"
                      value={staffProfile.hire_date}
                      onChange={(e) =>
                        setStaffProfile({
                          ...staffProfile,
                          hire_date: e.target.value,
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
                        value={staffProfile.marital_status}
                        onChange={(e) =>
                          setStaffProfile({
                            ...staffProfile,
                            marital_status: e.target.value,
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
                      name="emergency_contact"
                      value={staffProfile.emergency_contact}
                      onChange={(e) =>
                        setStaffProfile({
                          ...staffProfile,
                          emergency_contact: e.target.value,
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
