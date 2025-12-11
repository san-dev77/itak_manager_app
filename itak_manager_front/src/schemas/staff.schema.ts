import { z } from "zod";

export const staffSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (min 2 car.)"),
  lastName: z.string().min(2, "Nom requis (min 2 car.)"),
  hireDate: z.string().min(1, "Date d'embauche requise"),
  position: z.string().min(2, "Poste requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  maritalStatus: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;

export const staffDefaultValues: StaffFormData = {
  firstName: "",
  lastName: "",
  hireDate: new Date().toISOString().split("T")[0],
  position: "",
  email: "",
  phone: "",
  maritalStatus: "",
  emergencyContact: "",
};
