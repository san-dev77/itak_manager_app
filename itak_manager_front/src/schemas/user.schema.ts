import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (min 2 car.)"),
  lastName: z.string().min(2, "Nom requis (min 2 car.)"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  password: z.string().min(6, "Mot de passe min 6 car."),
  role: z.enum(["super_admin", "admin", "scolarite", "finance", "qualite"]),
});

export const userEditSchema = userSchema
  .omit({ password: true, email: true })
  .extend({
    email: z.string().email("Email invalide").optional(),
    newPassword: z
      .string()
      .min(6, "Mot de passe min 6 car.")
      .optional()
      .or(z.literal("")),
  });

export type UserFormData = z.infer<typeof userSchema>;
export type UserEditFormData = z.infer<typeof userEditSchema>;

export const userDefaultValues: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "scolarite",
};

export const roleOptions = [
  { value: "scolarite", label: "Scolarité" },
  { value: "finance", label: "Comptabilité" },
  { value: "qualite", label: "Assurance Qualité" },
  { value: "admin", label: "Administrateur" },
  { value: "super_admin", label: "Président / DG" },
];
