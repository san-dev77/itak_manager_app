import { z } from "zod";

export const studentSchema = z.object({
  // Required fields
  firstName: z.string().min(2, "Prénom requis (min 2 car.)"),
  lastName: z.string().min(2, "Nom requis (min 2 car.)"),
  matricule: z.string().min(3, "Matricule requis"),
  enrollmentDate: z.string().min(1, "Date d'inscription requise"),

  scholarshipStatus: z
    .enum(["boursier", "demi_boursier", "quart_boursier", "non_boursier"])
    .default("non_boursier"),

  // Optional fields
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  gender: z.enum(["M", "F", ""]).optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  maritalStatus: z.string().optional(),

  // Family (all optional)
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  tutorName: z.string().optional(),
  tutorPhone: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),

  // Institution
  institutionId: z
    .string()
    .uuid("ID d'affectation invalide")
    .refine((val) => val.length > 0, {
      message: "Veuillez sélectionner une affectation",
    }),
});

export type StudentFormData = z.input<typeof studentSchema>;

export const studentDefaultValues: StudentFormData = {
  firstName: "",
  lastName: "",
  matricule: "",
  enrollmentDate: new Date().toISOString().split("T")[0],
  email: "",
  phone: "",
  gender: "",
  birthDate: "",
  address: "",
  maritalStatus: "",
  fatherName: "",
  motherName: "",
  tutorName: "",
  tutorPhone: "",
  emergencyContact: "",
  notes: "",
  scholarshipStatus: "non_boursier",
  institutionId: "",
};
