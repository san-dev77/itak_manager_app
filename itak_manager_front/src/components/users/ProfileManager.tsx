import { motion } from "framer-motion";
import { useState } from "react";
import { UserPlus, X, Save, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { User } from "../../services/api";

interface ProfileManagerProps {
  user: User;
  profileType: "teacher" | "staff";
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: any) => void;
}

const ProfileManager = ({
  user,
  profileType,
  isOpen,
  onClose,
  onSave,
}: ProfileManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Champs communs
    department: "",
    position: "",
    hire_date: "",
    salary: "",
    supervisor: "",

    // Champs spécifiques aux enseignants
    subjects: "",
    education_level: "",
    experience_years: "",
    certifications: "",

    // Champs spécifiques au personnel administratif
    office_location: "",
    work_schedule: "",
    responsibilities: "",
    access_level: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validation des champs communs
    if (!formData.department.trim())
      errors.department = "Le département est requis";
    if (!formData.position.trim()) errors.position = "Le poste est requis";
    if (!formData.hire_date.trim())
      errors.hire_date = "La date d'embauche est requise";

    // Validation spécifique aux enseignants
    if (profileType === "teacher") {
      if (!formData.subjects.trim())
        errors.subjects = "Les matières enseignées sont requises";
      if (!formData.education_level.trim())
        errors.education_level = "Le niveau d'éducation est requis";
    }

    // Validation spécifique au personnel administratif
    if (profileType === "staff") {
      if (!formData.office_location.trim())
        errors.office_location = "L'emplacement du bureau est requis";
      if (!formData.responsibilities.trim())
        errors.responsibilities = "Les responsabilités sont requises";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const profileData = {
        user_id: user.id,
        profile_type: profileType,
        ...formData,
      };

      await onSave(profileData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileTitle = () => {
    return profileType === "teacher"
      ? "Profil Enseignant"
      : "Profil Personnel Administratif";
  };

  const getProfileDescription = () => {
    return profileType === "teacher"
      ? "Configurez le profil enseignant pour cet utilisateur"
      : "Configurez le profil administratif pour cet utilisateur";
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
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">
                {getProfileTitle()}
              </h2>
              <p className="text-blue-600 mt-2">{getProfileDescription()}</p>
              <p className="text-sm text-blue-500 mt-1">
                Utilisateur: {user.firstName} {user.lastName} ({user.email})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Champs communs */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Informations Générales
              </h3>
            </div>

            <Input
              label="Département"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              error={errors.department}
              required
            />

            <Input
              label="Poste"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              error={errors.position}
              required
            />

            <Input
              label="Date d'embauche"
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleInputChange}
              error={errors.hire_date}
              required
            />

            <Input
              label="Salaire"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Montant en FCFA"
            />

            <Input
              label="Superviseur"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleInputChange}
              placeholder="Nom du superviseur"
            />

            {/* Champs spécifiques aux enseignants */}
            {profileType === "teacher" && (
              <>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Informations Pédagogiques
                  </h3>
                </div>

                <Input
                  label="Matières enseignées"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                  error={errors.subjects}
                  placeholder="Mathématiques, Physique, Chimie..."
                  required
                />

                <Input
                  label="Niveau d'éducation"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleInputChange}
                  error={errors.education_level}
                  placeholder="Licence, Master, Doctorat..."
                  required
                />

                <Input
                  label="Années d'expérience"
                  name="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  placeholder="Nombre d'années"
                />

                <Input
                  label="Certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  placeholder="CAPES, Agrégation..."
                />
              </>
            )}

            {/* Champs spécifiques au personnel administratif */}
            {profileType === "staff" && (
              <>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Informations Administratives
                  </h3>
                </div>

                <Input
                  label="Emplacement du bureau"
                  name="office_location"
                  value={formData.office_location}
                  onChange={handleInputChange}
                  error={errors.office_location}
                  placeholder="Bâtiment A, Bureau 101..."
                  required
                />

                <Input
                  label="Horaires de travail"
                  name="work_schedule"
                  value={formData.work_schedule}
                  onChange={handleInputChange}
                  placeholder="8h-17h, Lundi-Vendredi..."
                />

                <Input
                  label="Responsabilités"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  error={errors.responsibilities}
                  placeholder="Gestion des inscriptions, Comptabilité..."
                  required
                />

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-slate-700 font-medium">
                      Niveau d'accès
                    </span>
                  </label>
                  <select
                    name="access_level"
                    value={formData.access_level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                  >
                    <option value="">Sélectionner un niveau</option>
                    <option value="basic">Accès de base</option>
                    <option value="intermediate">Accès intermédiaire</option>
                    <option value="advanced">Accès avancé</option>
                    <option value="admin">Accès administrateur</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Avertissement */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Information importante
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  En créant ce profil, l'utilisateur aura accès aux
                  fonctionnalités spécifiques à son rôle. Assurez-vous que
                  toutes les informations sont correctes avant de continuer.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-blue-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Sauvegarde..." : "Créer le profil"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileManager;
