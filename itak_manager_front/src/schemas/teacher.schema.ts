import { z } from "zod";

export const teacherSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (min 2 car.)"),
  lastName: z.string().min(2, "Nom requis (min 2 car.)"),
  hireDate: z.string().min(1, "Date d'embauche requise"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  maritalStatus: z.string().optional(),
  diplomas: z.string().optional(),
  emergencyContact: z.string().optional(),
  
  // Institution
  institutionId: z.string().uuid("ID d'affectation invalide").optional(),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

export const teacherDefaultValues: TeacherFormData = {
  firstName: "",
  lastName: "",
  hireDate: new Date().toISOString().split("T")[0],
  email: "",
  phone: "",
  maritalStatus: "",
  diplomas: "",
  emergencyContact: "",
  institutionId: "",
};
