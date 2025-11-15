const API_BASE_URL = "http://localhost:3000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Type union pour les rôles utilisateur correspondant au backend
export type UserRole = "student" | "teacher" | "staff" | "parent" | "admin";

// Constantes pour les rôles
export const USER_ROLES = {
  STUDENT: "student" as const,
  TEACHER: "teacher" as const,
  STAFF: "staff" as const,
  PARENT: "parent" as const,
  ADMIN: "admin" as const,
} as const;

interface UserRegistrationData {
  username?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interface pour la réponse de connexion
interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface StudentProfileData {
  id?: string;
  userId: string;
  matricule: string;
  enrollmentDate: string | Date;
  photo?: string;
  maritalStatus?: string;
  fatherName?: string;
  motherName?: string;
  tutorName?: string;
  tutorPhone?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: User;
}

export interface Payment {
  id: string;
  studentFeeId: string;
  paymentDate: string;
  amount: number;
  method: "cash" | "bank_transfer" | "mobile_money" | "card";
  provider?: string;
  transactionRef?: string;
  receivedBy: string;
  status: "successful" | "failed" | "pending";
  createdAt: string;
  studentFee?: {
    id: string;
    studentId: string;
    feeTypeId: string;
    academicYearId: string;
    amountAssigned: string | number;
    amountPaid: string | number;
    dueDate: string;
    status: string;
  };
  receivedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// Finance Interfaces
export type FeeFrequency = "once" | "monthly" | "quarterly" | "yearly";

export interface FeeType {
  id: string;
  name: string;
  description?: string;
  amountDefault: number;
  isRecurring: boolean;
  frequency: FeeFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeeTypeDto {
  name: string;
  description?: string;
  amountDefault: number;
  isRecurring: boolean;
  frequency: FeeFrequency;
  isActive?: boolean;
}

export interface UpdateFeeTypeDto {
  name?: string;
  description?: string;
  amountDefault?: number;
  isRecurring?: boolean;
  frequency?: FeeFrequency;
  isActive?: boolean;
}

export interface StudentFee {
  id: string;
  studentId: string;
  feeTypeId: string;
  academicYearId: string;
  amountAssigned: number;
  amountPaid: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    userId: string;
    matricule: string;
    firstName?: string;
    lastName?: string;
  };
  feeType?: {
    id: string;
    name: string;
    amountDefault: number;
  };
  academicYear?: {
    id: string;
    name: string;
    isActive: boolean;
  };
}

export interface CreateStudentFeeDto {
  studentId: string;
  feeTypeId: string;
  academicYearId: string;
  amountAssigned: number;
  dueDate: string;
}

export interface UpdateStudentFeeDto {
  studentId?: string;
  feeTypeId?: string;
  academicYearId?: string;
  amountAssigned?: number;
  dueDate?: string;
}

export interface CreatePaymentDto {
  studentFeeId: string;
  paymentDate: string;
  amount: number;
  method: "cash" | "bank_transfer" | "mobile_money" | "card";
  provider?: string;
  transactionRef?: string;
  receivedBy: string;
}

export interface UpdatePaymentDto {
  studentFeeId?: string;
  paymentDate?: string;
  amount?: number;
  method?: "cash" | "bank_transfer" | "mobile_money" | "card";
  provider?: string;
  transactionRef?: string;
  receivedBy?: string;
  status?: "successful" | "failed" | "pending";
}

export interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  totalAmount: number;
  status: "unpaid" | "partial" | "paid" | "cancelled";
  issuedDate: string;
  dueDate: string;
  notes?: string;
  createdAt: string;
  student?: {
    firstName: string;
    lastName: string;
    matricule?: string;
  };
  invoiceItems?: Array<{
    id: string;
    amount: number;
    studentFee?: {
      feeType?: {
        name: string;
      };
    };
  }>;
}

export interface CreateInvoiceDto {
  studentId: string;
  invoiceNumber: string;
  totalAmount: number;
  issuedDate: string;
  dueDate: string;
  notes?: string;
}

export interface UpdateInvoiceDto {
  studentId?: string;
  invoiceNumber?: string;
  totalAmount?: number;
  status?: "unpaid" | "partial" | "paid" | "cancelled";
  issuedDate?: string;
  dueDate?: string;
  notes?: string;
}

export interface Discount {
  id: string;
  studentFeeId: string;
  amount: number;
  reason: string;
  appliedBy: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  studentFee?: StudentFee;
  appliedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateDiscountDto {
  studentFeeId: string;
  amount: number;
  reason: string;
  appliedBy: string;
}

export interface UpdateDiscountDto {
  studentFeeId?: string;
  amount?: number;
  reason?: string;
  appliedBy?: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  processedBy: string;
  processedAt: string;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
  processedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateRefundDto {
  paymentId: string;
  amount: number;
  reason: string;
  processedBy: string;
}

export interface UpdateRefundDto {
  paymentId?: string;
  amount?: number;
  reason?: string;
  processedBy?: string;
}

export interface FinanceStats {
  totalRevenue: number;
  totalPending: number;
  totalPaid: number;
  totalOverdue: number;
  monthlyRevenue?: Array<{
    month: string;
    amount: number;
  }>;
  feeTypeStats?: Array<{
    feeTypeId: string;
    feeTypeName: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
  }>;
}

interface StudentWithUser {
  id: string;
  userId: string;
  matricule: string;
  enrollmentDate: string | Date;
  photo?: string;
  maritalStatus?: string;
  fatherName?: string;
  motherName?: string;
  tutorName?: string;
  tutorPhone?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface TeacherProfileData {
  id?: string;
  userId: string;
  matricule: string;
  hireDate: string | Date;
  photo?: string;
  maritalStatus?: string;
  diplomas?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: User;
}

interface TeacherWithUser {
  id: string;
  userId: string;
  matricule: string;
  hireDate: string | Date;
  photo?: string;
  maritalStatus?: string;
  diplomas?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface StaffProfileData {
  id?: string;
  userId: string;
  matricule: string;
  hireDate: string | Date;
  position?: string;
  photo?: string;
  maritalStatus?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user?: User;
}

interface StaffWithUser {
  id: string;
  userId: string;
  matricule: string;
  hireDate: string | Date;
  position?: string;
  photo?: string;
  maritalStatus?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface ClassCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface ClassData {
  name: string;
  code: string;
  classCategoryId: string;
  description?: string;
  level: string;
  capacity: number;
  orderLevel: number;
  category?: ClassCategory;
  categoryId?: string;
}

interface Class {
  id: string;
  name: string;
  code: string;
  classCategoryId: string;
  description?: string;
  level: string;
  capacity: number;
  orderLevel: number;
  category: ClassCategory;
  createdAt: string;
}

interface SubjectData {
  name: string;
  code: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

// Nouvelles interfaces pour les affectations de configuration
interface ClassSubjectData {
  classId: string;
  subjectId: string;
  coefficient: number;
  weeklyHours: number;
  isOptional: boolean;
}

interface ClassSubject {
  id: string;
  classId: string;
  subjectId: string;
  coefficient: number;
  weeklyHours: number;
  isOptional: boolean;
  created_at: string;
  updated_at: string;
  class: {
    id: string;
    name: string;
    level: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
}

interface StudentClassData {
  studentId: string;
  classId: string;
  startDate: string;
  endDate?: string;
}

interface StudentClass {
  id: string;
  studentId: string;
  classId: string;
  startDate: string;
  endDate?: string;
  created_at: string;
  updated_at: string;
  student: StudentWithUser;
  class: Class;
}

interface TeachingAssignmentData {
  teacherId: string;
  classSubjectId: string;
  startDate: string;
  endDate?: string;
}

interface TeachingAssignment {
  id: string;
  teacherId: string;
  classSubjectId: string;
  startDate: string;
  endDate?: string;
  created_at: string;
  updated_at: string;
  teacher: TeacherWithUser;
  classSubject: ClassSubject;
}

// School Year interfaces
export interface CreateSchoolYearDto {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface UpdateSchoolYearDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface SchoolYear {
  id: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  terms?: Term[];
}

// Term interfaces
export interface CreateTermDto {
  schoolYearId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  orderNumber?: number;
}

export interface UpdateTermDto {
  schoolYearId?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  orderNumber?: number;
}

export interface Term {
  id: string;
  schoolYearId: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  orderNumber: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  schoolYear?: SchoolYear;
}

// Timetable interfaces
export const DayOfWeek = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

// Types pour les événements
export const EventTypeEnum = {
  EXAM: "exam",
  HOMEWORK: "homework",
  CULTURAL_DAY: "cultural_day",
  HEALTH_DAY: "health_day",
  BALL: "ball",
  OTHER: "other",
} as const;

export type EventType = (typeof EventTypeEnum)[keyof typeof EventTypeEnum];

export interface CreateEventDto {
  title: string;
  description?: string;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  allDay?: boolean;
  classId?: string;
  createdBy: string;
  academicYearId: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  eventType?: EventType;
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
  classId?: string;
  createdBy?: string;
  academicYearId?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventType: EventType;
  startDate: string | Date;
  endDate?: string | Date;
  allDay: boolean;
  classId?: string;
  createdBy: string;
  academicYearId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  class?: {
    id: string;
    name: string;
    level: string;
  };
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  academicYear?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };
  participants?: Array<{
    id: string;
    userId: string;
    role: string;
    status: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

export interface EventCalendarDto {
  date: string;
  events: Array<{
    id: string;
    title: string;
    eventType: EventType;
    startDate: string;
    endDate?: string;
    allDay: boolean;
    className?: string;
  }>;
}

export interface CreateTimetableDto {
  teachingAssignmentId: string;
  academicYearId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface UpdateTimetableDto {
  teachingAssignmentId?: string;
  academicYearId?: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  room?: string;
}

export interface Timetable {
  id: string;
  teachingAssignmentId: string;
  academicYearId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  teachingAssignment?: TeachingAssignment;
  academicYear?: SchoolYear;
}

export interface TimetableSlot {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room?: string;
  teachingAssignmentId: string;
}

export interface WeeklyTimetable {
  classId: string;
  className: string;
  academicYearId: string;
  schedule: {
    [key in DayOfWeek]?: TimetableSlot[];
  };
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;

      // Récupérer le token d'accès depuis le stockage
      const accessToken =
        localStorage.getItem("itak_access_token") ||
        sessionStorage.getItem("itak_access_token");

      console.log(
        "🔑 Token récupéré:",
        accessToken ? "✅ Présent" : "❌ Absent"
      );
      if (accessToken) {
        console.log(
          "🔑 Token (premiers caractères):",
          accessToken.substring(0, 20) + "..."
        );
      }

      const defaultOptions: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...options.headers,
        },
        ...options,
      };

      console.log("📤 Headers envoyés:", defaultOptions.headers);

      console.log("🌐 Appel HTTP vers:", url);
      console.log("⚙️ Options de la requête:", defaultOptions);
      console.log("📋 Body de la requête:", options.body);

      const response = await fetch(url, defaultOptions);
      console.log(
        "📡 Statut de la réponse:",
        response.status,
        response.statusText
      );
      console.log(
        "📋 Headers de la réponse:",
        Object.fromEntries(response.headers.entries())
      );

      // Vérifier si la réponse a un contenu avant de parser le JSON
      const contentType = response.headers.get("content-type");
      const hasJsonContent =
        contentType && contentType.includes("application/json");

      let data: unknown = null;

      // Ne parser le JSON que si la réponse a du contenu
      if (hasJsonContent) {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          try {
            data = JSON.parse(text);
          } catch {
            console.warn("⚠️ Impossible de parser le JSON:", text);
            data = null;
          }
        }
      }

      console.log("📥 Données de la réponse:", data);

      if (!response.ok) {
        console.error("❌ Erreur HTTP:", response.status, response.statusText);
        console.error("📋 Détails de l'erreur:", data);

        // Extraction du message d'erreur selon la structure de réponse
        let errorMessage = "Erreur inconnue";

        if (data && typeof data === "object") {
          // Priorité 1: Chercher le champ "message" (le plus informatif)
          if ("message" in data) {
            const msg = (data as { message: unknown }).message;
            if (Array.isArray(msg)) {
              errorMessage = msg[0];
            } else if (typeof msg === "string" && msg.trim()) {
              errorMessage = msg;
            }
          }

          // Priorité 2: Si pas de message ou message vide, chercher "error"
          if (errorMessage === "Erreur inconnue" && "error" in data) {
            const err = (data as { error: unknown }).error;
            if (typeof err === "string" && err.trim()) {
              errorMessage = err;
            }
          }

          // Priorité 3: Messages d'erreur NestJS typiques
          if (errorMessage === "Erreur inconnue") {
            // Structure NestJS: { statusCode: 409, message: "...", error: "..." }
            if ("statusCode" in data && "message" in data) {
              const msg = (data as { message: unknown }).message;
              if (typeof msg === "string" && msg.trim()) {
                errorMessage = msg;
              }
            }
          }
        }

        // Fallback avec le statut HTTP si aucun message trouvé
        if (errorMessage === "Erreur inconnue") {
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }

        return {
          success: false,
          error: errorMessage,
          statusCode: response.status,
        };
      }

      console.log("✅ Requête réussie!");

      // Extraire le message s'il existe
      let message: string | undefined;
      if (data && typeof data === "object" && "message" in data) {
        const msg = (data as { message: unknown }).message;
        if (typeof msg === "string") {
          message = msg;
        }
      }

      return {
        success: true,
        data: data as T,
        message,
      };
    } catch (error) {
      console.error("💥 Erreur de connexion:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur de connexion",
      };
    }
  }

  // Méthode pour créer un nouvel utilisateur
  async createUser(userData: UserRegistrationData): Promise<ApiResponse<User>> {
    console.log(userData);
    return this.makeRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Méthode pour récupérer un utilisateur par ID
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${id}`);
  }

  // Méthode pour récupérer tous les utilisateurs
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.makeRequest<User[]>("/users");
  }

  // Méthode pour mettre à jour un utilisateur
  async updateUser(
    id: number,
    userData: Partial<UserRegistrationData>
  ): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Méthode pour supprimer un utilisateur
  async deleteUser(id: string | number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Méthode pour la connexion
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Méthode pour rafraîchir le token
  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ access_token: string; refresh_token: string }>> {
    return this.makeRequest<{ access_token: string; refresh_token: string }>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );
  }

  // Méthode pour se déconnecter
  async logout(): Promise<ApiResponse<void>> {
    return this.makeRequest<void>("/auth/logout", {
      method: "POST",
    });
  }

  // Méthode pour créer un profil étudiant
  async createStudentProfile(
    profileData: StudentProfileData
  ): Promise<ApiResponse<StudentWithUser>> {
    console.log(profileData);
    return this.makeRequest<StudentWithUser>("/students", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  }

  // Méthode pour récupérer tous les étudiants avec leurs données utilisateur
  async getAllStudents(): Promise<ApiResponse<StudentWithUser[]>> {
    return this.makeRequest<StudentWithUser[]>("/students");
  }

  // Méthode pour créer un profil enseignant
  async createTeacherProfile(
    profileData: TeacherProfileData
  ): Promise<ApiResponse<TeacherWithUser>> {
    console.log(profileData);
    return this.makeRequest<TeacherWithUser>("/teachers", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  }

  // Méthode pour récupérer tous les enseignants avec leurs données utilisateur
  async getAllTeachers(): Promise<ApiResponse<TeacherWithUser[]>> {
    return this.makeRequest<TeacherWithUser[]>("/teachers");
  }

  // Méthode pour créer un profil personnel administratif
  async createStaffProfile(
    profileData: StaffProfileData
  ): Promise<ApiResponse<StaffWithUser>> {
    console.log(profileData);
    return this.makeRequest<StaffWithUser>("/staff", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  }

  // Méthode pour récupérer tout le personnel administratif avec leurs données utilisateur
  async getAllStaff(): Promise<ApiResponse<StaffWithUser[]>> {
    return this.makeRequest<StaffWithUser[]>("/staff");
  }

  // Méthode pour mettre à jour un profil étudiant
  async updateStudentProfile(
    id: string,
    profileData: Partial<StudentProfileData>
  ): Promise<ApiResponse<StudentWithUser>> {
    return this.makeRequest<StudentWithUser>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Méthode pour mettre à jour un profil enseignant
  async updateTeacherProfile(
    id: string,
    profileData: Partial<TeacherProfileData>
  ): Promise<ApiResponse<TeacherWithUser>> {
    return this.makeRequest<TeacherWithUser>(`/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Méthode pour mettre à jour un profil personnel
  async updateStaffProfile(
    id: string,
    profileData: Partial<StaffProfileData>
  ): Promise<ApiResponse<StaffWithUser>> {
    return this.makeRequest<StaffWithUser>(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Méthode pour créer une classe
  async createClass(classData: ClassData): Promise<ApiResponse<Class>> {
    console.log(classData);
    return this.makeRequest<Class>("/classes", {
      method: "POST",
      body: JSON.stringify(classData),
    });
  }

  // Méthode pour récupérer toutes les classes
  async getAllClasses(): Promise<ApiResponse<Class[]>> {
    return this.makeRequest<Class[]>("/classes");
  }

  // Méthode pour mettre à jour une classe
  async updateClass(
    id: string | number,
    classData: Partial<ClassData>
  ): Promise<ApiResponse<Class>> {
    return this.makeRequest<Class>(`/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(classData),
    });
  }

  // Méthode pour supprimer une classe
  async deleteClass(id: string | number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/classes/${id}`, {
      method: "DELETE",
    });
  }

  // Méthode pour récupérer les classes par catégorie
  async getClassesByCategory(
    categoryId: number
  ): Promise<ApiResponse<Class[]>> {
    return this.makeRequest<Class[]>(`/classes/category/${categoryId}`);
  }

  // Méthode pour récupérer les classes par niveau
  async getClassesByLevel(level: string): Promise<ApiResponse<Class[]>> {
    return this.makeRequest<Class[]>(`/classes/level/${level}`);
  }

  // Méthode pour créer une catégorie de classe
  async createClassCategory(categoryData: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<ClassCategory>> {
    return this.makeRequest<ClassCategory>("/class-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  // Méthode pour récupérer toutes les catégories de classes
  async getAllClassCategories(): Promise<ApiResponse<ClassCategory[]>> {
    return this.makeRequest<ClassCategory[]>("/class-categories");
  }

  // Méthode pour récupérer une catégorie de classe par ID
  async getClassCategoryById(id: number): Promise<ApiResponse<ClassCategory>> {
    return this.makeRequest<ClassCategory>(`/class-categories/${id}`);
  }

  // Méthode pour mettre à jour une catégorie de classe
  async updateClassCategory(
    id: number,
    categoryData: { name: string; description?: string }
  ): Promise<ApiResponse<ClassCategory>> {
    return this.makeRequest<ClassCategory>(`/class-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  // Méthode pour supprimer une catégorie de classe
  async deleteClassCategory(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/class-categories/${id}`, {
      method: "DELETE",
    });
  }

  // Méthode pour initialiser les catégories par défaut
  async initializeClassCategories(): Promise<ApiResponse<ClassCategory[]>> {
    return this.makeRequest<ClassCategory[]>("/class-categories/initialize", {
      method: "POST",
    });
  }

  // Méthode pour créer une matière
  async createSubject(subjectData: SubjectData): Promise<ApiResponse<Subject>> {
    return this.makeRequest<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(subjectData),
    });
  }

  // Méthode pour récupérer toutes les matières
  async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
    return this.makeRequest<Subject[]>("/subjects");
  }

  // Méthode pour mettre à jour une matière
  async updateSubject(
    id: string | number,
    subjectData: Partial<SubjectData>
  ): Promise<ApiResponse<Subject>> {
    return this.makeRequest<Subject>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(subjectData),
    });
  }

  // Méthode pour supprimer une matière
  async deleteSubject(id: string | number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/subjects/${id}`, {
      method: "DELETE",
    });
  }

  // Méthodes pour les affectations de configuration
  // Méthode pour créer une affectation de matière à une classe
  async createClassSubject(
    classSubjectData: ClassSubjectData
  ): Promise<ApiResponse<ClassSubject>> {
    console.log(classSubjectData);
    return this.makeRequest<ClassSubject>("/class-subjects", {
      method: "POST",
      body: JSON.stringify(classSubjectData),
    });
  }

  // Méthode pour récupérer toutes les affectations de matières
  async getAllClassSubjects(): Promise<ApiResponse<ClassSubject[]>> {
    return this.makeRequest<ClassSubject[]>("/class-subjects");
  }

  // Méthode pour créer une affectation d'étudiant à une classe
  async createStudentClass(
    studentClassData: StudentClassData
  ): Promise<ApiResponse<StudentClass>> {
    console.log(studentClassData);
    return this.makeRequest<StudentClass>("/student-classes", {
      method: "POST",
      body: JSON.stringify(studentClassData),
    });
  }

  // Méthode pour récupérer tous les étudiants avec leurs classes
  async getAllStudentClasses(): Promise<ApiResponse<StudentClass[]>> {
    return this.makeRequest<StudentClass[]>("/student-classes");
  }

  // Méthode pour créer une affectation d'enseignant
  async createTeachingAssignment(
    teachingAssignmentData: TeachingAssignmentData
  ): Promise<ApiResponse<TeachingAssignment>> {
    console.log(teachingAssignmentData);
    return this.makeRequest<TeachingAssignment>("/teaching-assignments", {
      method: "POST",
      body: JSON.stringify(teachingAssignmentData),
    });
  }

  // Méthode pour récupérer toutes les affectations d'enseignants
  async getAllTeachingAssignments(): Promise<
    ApiResponse<TeachingAssignment[]>
  > {
    return this.makeRequest<TeachingAssignment[]>("/teaching-assignments");
  }

  // Méthode pour supprimer une affectation d'étudiant à une classe
  async deleteStudentClass(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/student-classes/${id}`, {
      method: "DELETE",
    });
  }

  // Méthode pour supprimer une affectation de matière à une classe
  async deleteClassSubject(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/class-subjects/${id}`, {
      method: "DELETE",
    });
  }

  // Méthode pour supprimer une affectation d'enseignant
  async deleteTeachingAssignment(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/teaching-assignments/${id}`, {
      method: "DELETE",
    });
  }

  // ============ School Year Methods ============

  // Créer une année scolaire
  async createSchoolYear(
    data: CreateSchoolYearDto
  ): Promise<ApiResponse<SchoolYear>> {
    return this.makeRequest<SchoolYear>("/school-years", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Récupérer toutes les années scolaires
  async getAllSchoolYears(): Promise<ApiResponse<SchoolYear[]>> {
    return this.makeRequest<SchoolYear[]>("/school-years");
  }

  // Récupérer une année scolaire par ID
  async getSchoolYearById(id: string): Promise<ApiResponse<SchoolYear>> {
    return this.makeRequest<SchoolYear>(`/school-years/${id}`);
  }

  // Mettre à jour une année scolaire
  async updateSchoolYear(
    id: string,
    data: UpdateSchoolYearDto
  ): Promise<ApiResponse<SchoolYear>> {
    return this.makeRequest<SchoolYear>(`/school-years/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Supprimer une année scolaire
  async deleteSchoolYear(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/school-years/${id}`, {
      method: "DELETE",
    });
  }

  // ============ Term Methods ============

  // Créer un trimestre
  async createTerm(data: CreateTermDto): Promise<ApiResponse<Term>> {
    return this.makeRequest<Term>("/terms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Récupérer tous les trimestres
  async getAllTerms(): Promise<ApiResponse<Term[]>> {
    return this.makeRequest<Term[]>("/terms");
  }

  // Récupérer un trimestre par ID
  async getTermById(id: string): Promise<ApiResponse<Term>> {
    return this.makeRequest<Term>(`/terms/${id}`);
  }

  // Récupérer les trimestres d'une année scolaire
  async getTermsBySchoolYear(
    schoolYearId: string
  ): Promise<ApiResponse<Term[]>> {
    return this.makeRequest<Term[]>(`/terms/school-years/${schoolYearId}`);
  }

  // Mettre à jour un trimestre
  async updateTerm(
    id: string,
    data: UpdateTermDto
  ): Promise<ApiResponse<Term>> {
    return this.makeRequest<Term>(`/terms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Supprimer un trimestre
  async deleteTerm(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/terms/${id}`, {
      method: "DELETE",
    });
  }

  // ============ Timetable Methods ============

  // Créer un emploi du temps
  async createTimetable(
    data: CreateTimetableDto
  ): Promise<ApiResponse<Timetable>> {
    return this.makeRequest<Timetable>("/timetables", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Récupérer tous les emplois du temps
  async getAllTimetables(): Promise<ApiResponse<Timetable[]>> {
    return this.makeRequest<Timetable[]>("/timetables");
  }

  // Récupérer un emploi du temps par ID
  async getTimetableById(id: string): Promise<ApiResponse<Timetable>> {
    return this.makeRequest<Timetable>(`/timetables/${id}`);
  }

  // Récupérer les emplois du temps d'une classe pour une année scolaire
  async getTimetablesByClass(
    classId: string,
    academicYearId: string
  ): Promise<ApiResponse<Timetable[]>> {
    return this.makeRequest<Timetable[]>(
      `/timetables/class/${classId}?academicYearId=${academicYearId}`
    );
  }

  // Récupérer l'emploi du temps hebdomadaire d'une classe
  async getWeeklyTimetable(
    classId: string,
    academicYearId: string
  ): Promise<ApiResponse<WeeklyTimetable>> {
    return this.makeRequest<WeeklyTimetable>(
      `/timetables/weekly/${classId}?academicYearId=${academicYearId}`
    );
  }

  // Mettre à jour un emploi du temps
  async updateTimetable(
    id: string,
    data: UpdateTimetableDto
  ): Promise<ApiResponse<Timetable>> {
    return this.makeRequest<Timetable>(`/timetables/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Supprimer un emploi du temps
  async deleteTimetable(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/timetables/${id}`, {
      method: "DELETE",
    });
  }

  // ============ Event Methods ============

  // Créer un événement
  async createEvent(data: CreateEventDto): Promise<ApiResponse<Event>> {
    return this.makeRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Récupérer tous les événements
  async getAllEvents(): Promise<ApiResponse<Event[]>> {
    return this.makeRequest<Event[]>("/events");
  }

  // Récupérer un événement par ID
  async getEventById(id: string): Promise<ApiResponse<Event>> {
    return this.makeRequest<Event>(`/events/${id}`);
  }

  // Récupérer les événements d'une année scolaire
  async getEventsByAcademicYear(
    academicYearId: string
  ): Promise<ApiResponse<Event[]>> {
    return this.makeRequest<Event[]>(`/events/academic-year/${academicYearId}`);
  }

  // Récupérer les événements d'une classe
  async getEventsByClass(classId: string): Promise<ApiResponse<Event[]>> {
    return this.makeRequest<Event[]>(`/events/class/${classId}`);
  }

  // Récupérer les événements d'un calendrier (par date)
  async getEventsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<EventCalendarDto[]>> {
    return this.makeRequest<EventCalendarDto[]>(
      `/events/calendar?startDate=${startDate}&endDate=${endDate}`
    );
  }

  // Mettre à jour un événement
  async updateEvent(
    id: string,
    data: UpdateEventDto
  ): Promise<ApiResponse<Event>> {
    return this.makeRequest<Event>(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Supprimer un événement
  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/events/${id}`, {
      method: "DELETE",
    });
  }

  // ============ Finance Methods ============

  // Fee Types
  async getAllFeeTypes(): Promise<ApiResponse<FeeType[]>> {
    return this.makeRequest<FeeType[]>("/fee-types");
  }

  async createFeeType(data: CreateFeeTypeDto): Promise<ApiResponse<FeeType>> {
    return this.makeRequest<FeeType>("/fee-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateFeeType(
    id: string,
    data: UpdateFeeTypeDto
  ): Promise<ApiResponse<FeeType>> {
    return this.makeRequest<FeeType>(`/fee-types/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteFeeType(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/fee-types/${id}`, {
      method: "DELETE",
    });
  }

  // Student Fees
  async getAllStudentFees(): Promise<ApiResponse<StudentFee[]>> {
    return this.makeRequest<StudentFee[]>("/student-fees");
  }

  async createStudentFee(
    data: CreateStudentFeeDto
  ): Promise<ApiResponse<StudentFee>> {
    return this.makeRequest<StudentFee>("/student-fees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateStudentFee(
    id: string,
    data: UpdateStudentFeeDto
  ): Promise<ApiResponse<StudentFee>> {
    return this.makeRequest<StudentFee>(`/student-fees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteStudentFee(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/student-fees/${id}`, {
      method: "DELETE",
    });
  }

  // Payments
  async getAllPayments(): Promise<ApiResponse<Payment[]>> {
    return this.makeRequest<Payment[]>("/payments");
  }

  async createPayment(data: CreatePaymentDto): Promise<ApiResponse<Payment>> {
    return this.makeRequest<Payment>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePayment(
    id: string,
    data: UpdatePaymentDto
  ): Promise<ApiResponse<Payment>> {
    return this.makeRequest<Payment>(`/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/payments/${id}`, {
      method: "DELETE",
    });
  }

  // Invoices
  async getAllInvoices(): Promise<ApiResponse<Invoice[]>> {
    return this.makeRequest<Invoice[]>("/invoices");
  }

  async createInvoice(data: CreateInvoiceDto): Promise<ApiResponse<Invoice>> {
    return this.makeRequest<Invoice>("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateInvoice(
    id: string,
    data: UpdateInvoiceDto
  ): Promise<ApiResponse<Invoice>> {
    return this.makeRequest<Invoice>(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/invoices/${id}`, {
      method: "DELETE",
    });
  }

  // Discounts
  async getAllDiscounts(): Promise<ApiResponse<Discount[]>> {
    return this.makeRequest<Discount[]>("/discounts");
  }

  async createDiscount(
    data: CreateDiscountDto
  ): Promise<ApiResponse<Discount>> {
    return this.makeRequest<Discount>("/discounts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDiscount(
    id: string,
    data: UpdateDiscountDto
  ): Promise<ApiResponse<Discount>> {
    return this.makeRequest<Discount>(`/discounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteDiscount(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/discounts/${id}`, {
      method: "DELETE",
    });
  }

  // Refunds
  async getAllRefunds(): Promise<ApiResponse<Refund[]>> {
    return this.makeRequest<Refund[]>("/refunds");
  }

  async createRefund(data: CreateRefundDto): Promise<ApiResponse<Refund>> {
    return this.makeRequest<Refund>("/refunds", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRefund(
    id: string,
    data: UpdateRefundDto
  ): Promise<ApiResponse<Refund>> {
    return this.makeRequest<Refund>(`/refunds/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRefund(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/refunds/${id}`, {
      method: "DELETE",
    });
  }

  // Finance Statistics
  async getFinanceStats(): Promise<ApiResponse<FinanceStats>> {
    return this.makeRequest<FinanceStats>("/finance/stats");
  }
}

// Export d'une instance unique du service
export const apiService = new ApiService();

// Export des types pour utilisation dans d'autres composants
export type {
  UserRegistrationData,
  User,
  LoginResponse,
  StudentWithUser,
  TeacherWithUser,
  StaffWithUser,
  ClassData,
  Class,
  ClassCategory,
  SubjectData,
  Subject,
  ClassSubjectData,
  ClassSubject,
  StudentClassData,
  StudentClass,
  TeachingAssignmentData,
  TeachingAssignment,
  ApiResponse,
};
