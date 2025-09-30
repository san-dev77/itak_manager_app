const API_BASE_URL = "http://localhost:3000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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

interface StudentProfileData {
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

interface TeacherProfileData {
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

interface StaffProfileData {
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
  class_id: string;
  subject_id: string;
  coefficient: number;
  weeklyHours: number;
  is_optional: boolean;
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

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;

      const defaultOptions: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

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

      const data = await response.json();
      console.log("📥 Données de la réponse:", data);

      if (!response.ok) {
        console.error("❌ Erreur HTTP:", response.status, response.statusText);
        console.error("📋 Détails de l'erreur:", data);

        // Extraction du message d'erreur selon la structure de réponse
        let errorMessage = "Erreur inconnue";

        if (data.message && Array.isArray(data.message)) {
          // Si le message est un tableau, prendre le premier élément
          errorMessage = data.message[0];
        } else if (data.message && typeof data.message === "string") {
          // Si le message est une chaîne
          errorMessage = data.message;
        } else if (data.error && typeof data.error === "string") {
          // Si l'erreur est une chaîne
          errorMessage = data.error;
        } else {
          // Fallback avec le statut HTTP
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      console.log("✅ Requête réussie!");
      return {
        success: true,
        data,
        message: data.message,
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
  async deleteUser(id: number): Promise<ApiResponse<void>> {
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
    id: number,
    classData: Partial<ClassData>
  ): Promise<ApiResponse<Class>> {
    return this.makeRequest<Class>(`/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(classData),
    });
  }

  // Méthode pour supprimer une classe
  async deleteClass(id: number): Promise<ApiResponse<void>> {
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
    id: number,
    subjectData: Partial<SubjectData>
  ): Promise<ApiResponse<Subject>> {
    return this.makeRequest<Subject>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(subjectData),
    });
  }

  // Méthode pour supprimer une matière
  async deleteSubject(id: number): Promise<ApiResponse<void>> {
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
    return this.makeRequest<StudentClass>("/config/student-classes", {
      method: "POST",
      body: JSON.stringify(studentClassData),
    });
  }

  // Méthode pour récupérer tous les étudiants avec leurs classes
  async getAllStudentClasses(): Promise<ApiResponse<StudentClass[]>> {
    return this.makeRequest<StudentClass[]>("/config/student-classes");
  }

  // Méthode pour créer une affectation d'enseignant
  async createTeachingAssignment(
    teachingAssignmentData: TeachingAssignmentData
  ): Promise<ApiResponse<TeachingAssignment>> {
    console.log(teachingAssignmentData);
    return this.makeRequest<TeachingAssignment>(
      "/config/teaching-assignments",
      {
        method: "POST",
        body: JSON.stringify(teachingAssignmentData),
      }
    );
  }

  // Méthode pour récupérer toutes les affectations d'enseignants
  async getAllTeachingAssignments(): Promise<
    ApiResponse<TeachingAssignment[]>
  > {
    return this.makeRequest<TeachingAssignment[]>(
      "/config/teaching-assignments"
    );
  }

  // Méthode pour supprimer une affectation d'étudiant à une classe
  async deleteStudentClass(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/config/student-classes/${id}`, {
      method: "DELETE",
    });
  }

  // Méthode pour supprimer une affectation de matière à une classe
  async deleteClassSubject(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/config/class-subjects/${id}`, {
      method: "DELETE",
    });
  }

  // Méthode pour supprimer une affectation d'enseignant
  async deleteTeachingAssignment(id: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/config/teaching-assignments/${id}`, {
      method: "DELETE",
    });
  }
}

// Export d'une instance unique du service
export const apiService = new ApiService();

// Export des types pour utilisation dans d'autres composants
export type {
  UserRegistrationData,
  User,
  LoginResponse,
  StudentProfileData,
  StudentWithUser,
  TeacherProfileData,
  TeacherWithUser,
  StaffProfileData,
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
