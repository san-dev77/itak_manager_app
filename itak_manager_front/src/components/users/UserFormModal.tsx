import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userSchema,
  userEditSchema,
  userDefaultValues,
  roleOptions,
  type UserFormData,
  type UserEditFormData,
} from "../../schemas/user.schema";
import Modal from "../ui/Modal";
import { FormInput, FormSelect } from "../form";
import { useState, useEffect, useRef } from "react";

type UserFormModalProps =
  | {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (data: UserFormData) => Promise<void>;
      initialData?: Partial<UserFormData>;
      mode: "create";
      loading?: boolean;
    }
  | {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (data: UserEditFormData) => Promise<void>;
      initialData?: Partial<UserEditFormData>;
      mode: "edit";
      loading?: boolean;
    };

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  loading = false,
}: UserFormModalProps) => {
  const [submitError, setSubmitError] = useState("");
  const previousEmailRef = useRef<string | undefined>(undefined);

  const form = useForm<UserFormData | UserEditFormData>({
    resolver: zodResolver(mode === "create" ? userSchema : userEditSchema),
    defaultValues: { ...userDefaultValues, ...initialData },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // Réinitialiser le formulaire quand la modale s'ouvre
  useEffect(() => {
    if (!isOpen) {
      previousEmailRef.current = undefined;
      return;
    }

    if (mode === "create") {
      // Mode création : réinitialiser avec les valeurs par défaut
      reset({
        ...userDefaultValues,
      });
      previousEmailRef.current = undefined;
    } else if (mode === "edit" && initialData) {
      // Mode édition : toujours réinitialiser avec les données initiales quand la modale s'ouvre
      // Ne pas inclure password en mode édition
      const editData = { ...initialData };
      delete (editData as any).password; // Supprimer password si présent
      reset({
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        email: editData.email || "",
        phone: editData.phone || "",
        role: editData.role || "scolarite",
      });
      previousEmailRef.current = initialData?.email;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]); // Réinitialiser à chaque ouverture de la modale

  const handleClose = () => {
    reset();
    setSubmitError("");
    onClose();
  };

  const handleFormSubmit = async (data: UserFormData | UserEditFormData) => {
    setSubmitError("");
    try {
      if (mode === "create") {
        await (onSubmit as (data: UserFormData) => Promise<void>)(data as UserFormData);
      } else {
        await (onSubmit as (data: UserEditFormData) => Promise<void>)(data as UserEditFormData);
      }
      handleClose();
    } catch (error: unknown) {
      const err = error as { message?: string };
      setSubmitError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Nouveau compte" : "Modifier le compte"}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
        {/* Identity */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Prénom"
            placeholder="Jean"
            error={errors.firstName}
            {...register("firstName")}
          />
          <FormInput
            label="Nom"
            placeholder="Dupont"
            error={errors.lastName}
            {...register("lastName")}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Email"
            type="email"
            placeholder="email@upcd-itak.com"
            error={errors.email}
            {...register("email")}
          />
          <FormInput
            label="Téléphone"
            type="tel"
            placeholder="+223 XX XX XX XX"
            {...register("phone")}
          />
        </div>

        {/* Password (only on create) */}
        {mode === "create" && (
          <FormInput
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={mode === "create" ? (errors as any).password : undefined}
            {...register("password" as any)}
          />
        )}

        {/* Role */}
        <FormSelect
          label="Rôle"
          options={roleOptions}
          error={errors.role}
          {...register("role")}
        />

        {/* Error */}
        {submitError && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
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

export default UserFormModal;
