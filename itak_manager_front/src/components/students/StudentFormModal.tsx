import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentSchema,
  studentDefaultValues,
  type StudentFormData,
} from "../../schemas/student.schema";
import Modal from "../ui/Modal";
import ImageUpload from "../ui/ImageUpload";
import { FormInput, FormSelect } from "../form";
import { useState, useEffect } from "react";
import { useInstitution } from "../../hooks/useInstitution";
import type { Institution } from "../../contexts/InstitutionContext";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData, photo: File | null) => Promise<void>;
  initialData?: Partial<StudentFormData>;
  initialPhoto?: string | null;
  mode: "create" | "edit";
  loading?: boolean;
}

const StudentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  initialPhoto,
  mode,
  loading = false,
}: StudentFormModalProps) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialPhoto || null
  );
  const [submitError, setSubmitError] = useState("");

  const { institutions, selectedInstitution } = useInstitution();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...studentDefaultValues,
      ...initialData,
      institutionId:
        initialData?.institutionId || selectedInstitution?.id || "",
    },
  });

  // Réinitialiser le formulaire quand la modale s'ouvre ou que les données changent
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "create") {
      // Mode création : réinitialiser avec les valeurs par défaut
      reset({
        ...studentDefaultValues,
        institutionId: selectedInstitution?.id || "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    } else if (mode === "edit" && initialData) {
      // Mode édition : réinitialiser avec les données initiales
      reset({
        ...studentDefaultValues,
        ...initialData,
        institutionId:
          initialData.institutionId || selectedInstitution?.id || "",
      });
    }
  }, [isOpen, mode, initialData, selectedInstitution, reset]);

  // Gérer la photo séparément pour qu'elle se mette à jour correctement
  useEffect(() => {
    if (isOpen && mode === "edit") {
      // Réinitialiser la photo preview si elle existe
      if (initialPhoto) {
        // Si la photo est une URL relative, la convertir en URL absolue
        const photoUrl = initialPhoto.startsWith('http') || initialPhoto.startsWith('/')
          ? initialPhoto
          : `/${initialPhoto}`;
        setPhotoPreview(photoUrl);
        setPhotoFile(null);
      } else {
        setPhotoPreview(null);
        setPhotoFile(null);
      }
    } else if (isOpen && mode === "create") {
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  }, [isOpen, mode, initialPhoto]);

  const handleClose = () => {
    reset();
    setPhotoFile(null);
    setPhotoPreview(null);
    setSubmitError("");
    onClose();
  };

  const handleFormSubmit = async (data: StudentFormData) => {
    setSubmitError("");
    try {
      await onSubmit(data, photoFile);
      handleClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      setSubmitError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" },
  ];

  const maritalOptions = [
    { value: "single", label: "Célibataire" },
    { value: "married", label: "Marié(e)" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Nouvel étudiant" : "Modifier l'étudiant"}
      size="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
        {/* Row 1: Photo + Identity + Academic */}
        <div className="grid grid-cols-12 gap-4">
          {/* Photo */}
          <div className="col-span-2">
            <ImageUpload
              currentImage={photoPreview}
              onImageChange={(file, preview) => {
                setPhotoFile(file);
                setPhotoPreview(preview);
              }}
              size="sm"
              label=""
            />
          </div>

          {/* Identity */}
          <div className="col-span-5 grid grid-cols-2 gap-2">
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
            <FormSelect
              label="Genre"
              options={genderOptions}
              error={errors.gender}
              {...register("gender")}
            />
            <FormInput
              label="Naissance"
              type="date"
              error={errors.birthDate}
              {...register("birthDate")}
            />
          </div>

          {/* Academic - Required */}
          <div className="col-span-5 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-[10px] font-bold text-blue-700 uppercase mb-2">
              Inscription
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                placeholder="Matricule"
                className="font-mono"
                error={errors.matricule}
                {...register("matricule")}
              />
              <FormInput
                type="date"
                error={errors.enrollmentDate}
                {...register("enrollmentDate")}
              />
              <div className="col-span-2">
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
            </div>
          </div>
        </div>

        {/* Row 2: Contact + Family */}
        <div className="grid grid-cols-2 gap-4">
          {/* Contact */}
          <div className="p-3 bg-slate-50 rounded-xl">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase mb-2">
              Contact
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                placeholder="Email"
                type="email"
                error={errors.email}
                {...register("email")}
              />
              <FormInput
                placeholder="Téléphone"
                type="tel"
                {...register("phone")}
              />
              <FormInput
                placeholder="Adresse"
                className="col-span-2"
                {...register("address")}
              />
            </div>
          </div>

          {/* Family */}
          <div className="p-3 bg-slate-50 rounded-xl">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase mb-2">
              Famille
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <FormInput placeholder="Père" {...register("fatherName")} />
              <FormInput placeholder="Mère" {...register("motherName")} />
              <FormInput placeholder="Tuteur" {...register("tutorName")} />
              <FormInput
                placeholder="Tél. tuteur"
                type="tel"
                {...register("tutorPhone")}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Emergency + Notes */}
        <div className="grid grid-cols-3 gap-3">
          <FormInput
            placeholder="Contact urgence"
            {...register("emergencyContact")}
          />
          <FormSelect
            options={maritalOptions}
            placeholder="Situation"
            {...register("maritalStatus")}
          />
          <FormInput placeholder="Notes" {...register("notes")} />
        </div>

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

export default StudentFormModal;
