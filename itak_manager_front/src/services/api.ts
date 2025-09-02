const API_BASE_URL = "http://localhost:3000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  phone: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  phone: string;
  created_at: string;
  updated_at: string;
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
    return this.makeRequest<User>("/users", {
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

  // Méthode pour la connexion (pour plus tard)
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.makeRequest<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }
}

// Export d'une instance unique du service
export const apiService = new ApiService();

// Export des types pour utilisation dans d'autres composants
export type { UserRegistrationData, User, ApiResponse };
