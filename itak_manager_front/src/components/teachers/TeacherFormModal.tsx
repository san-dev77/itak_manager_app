import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teacherSchema,
  teacherDefaultValues,
  type TeacherFormData,
} from "../../schemas/teacher.schema";
import Modal from "../ui/Modal";
import { FormInput, FormSelect } from "../form";
import { useState, useEffect } from "react";
import { useInstitution } from "../../hooks/useInstitution";
import type { Institution } from "../../contexts/InstitutionContext";

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherFormData) => Promise<void>;
  initialData?: Partial<TeacherFormData>;
  mode: "create" | "edit";
  loading?: boolean;
}

const TeacherFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  loading = false,
}: TeacherFormModalProps) => {
  const [submitError, setSubmitError] = useState("");

  const { institutions, selectedInstitution } = useInstitution();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { 
      ...teacherDefaultValues, 
      ...initialData,
      institutionId: initialData?.institutionId || selectedInstitution?.id || "",
    },
  });

  // Pré-remplir l'institution si elle n'est pas déjà définie
  useEffect(() => {
    if (isOpen && mode === "create") {
      // Réinitialiser le formulaire avec les valeurs par défaut
      reset({
        ...teacherDefaultValues,
        institutionId: selectedInstitution?.id || "",
      });
      // S'assurer que l'institution est bien définie
      if (selectedInstitution) {
        setValue("institutionId", selectedInstitution.id);
      }
    } else if (isOpen && mode === "edit" && initialData) {
      // En mode édition, utiliser les données initiales
      reset({
        ...teacherDefaultValues,
        ...initialData,
        institutionId: initialData.institutionId || selectedInstitution?.id || "",
      });
    }
  }, [isOpen, mode, selectedInstitution, initialData, reset, setValue]);

  const handleClose = () => {
    reset();
    setSubmitError("");
    onClose();
  };

  const handleFormSubmit = async (data: TeacherFormData) => {
    setSubmitError("");
    try {
      await onSubmit(data);
      handleClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      setSubmitError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  const maritalOptions = [
    { value: "single", label: "Célibataire" },
    { value: "married", label: "Marié(e)" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Nouvel enseignant" : "Modifier l'enseignant"}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Identity */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Prénom"
            placeholder="Prénom"
            error={errors.firstName}
            {...register("firstName")}
          />
          <FormInput
            label="Nom"
            placeholder="Nom"
            error={errors.lastName}
            {...register("lastName")}
          />
          <FormInput
            label="Date d'embauche"
            type="date"
            error={errors.hireDate}
            {...register("hireDate")}
          />
          <FormSelect
            label="Affectation"
            placeholder="Sélectionner l'affectation"
            error={errors.institutionId}
            options={institutions.map((inst: Institution) => ({
              value: inst.id,
              label: inst.name,
            }))}
            {...register("institutionId")}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Email"
            placeholder="Email"
            type="email"
            error={errors.email}
            {...register("email")}
          />
          <FormInput
            label="Téléphone"
            placeholder="Téléphone"
            type="tel"
            {...register("phone")}
          />
        </div>

        {/* Professional */}
        <div className="grid grid-cols-2 gap-3">
          <FormSelect
            label="Situation matrimoniale"
            options={maritalOptions}
            {...register("maritalStatus")}
          />
          <FormInput
            label="Diplômes"
            placeholder="Diplômes"
            {...register("diplomas")}
          />
        </div>

        {/* Emergency */}
        <FormInput
          label="Contact d'urgence"
          placeholder="Contact d'urgence"
          {...register("emergencyContact")}
        />

        {/* Error */}
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 shadow-lg ${
              mode === "create"
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
            }`}
          >
            {loading ? "..." : mode === "create" ? "Créer" : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherFormModal;
