import type { ApiResponse, AuthFormData, LoginFormData, User } from "../types";

// Backend routes are exposed at the root (e.g. /users, /auth)
// Swagger lives at /api/docs but the API itself doesn't use the /api prefix.
const API_BASE_URL = "http://localhost:3000/";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = new URL(endpoint, API_BASE_URL).toString();

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async register(userData: AuthFormData): Promise<ApiResponse<User>> {
    // Map frontend snake_case fields to backend camelCase DTO (firstName, lastName, birthDate)
    const payload = {
      username: (userData as any).username,
      email: (userData as any).email,
      password: (userData as any).password,
      firstName: (userData as any).first_name || (userData as any).firstName,
      lastName: (userData as any).last_name || (userData as any).lastName,
      gender: (userData as any).gender,
      birthDate: (userData as any).birth_date || (userData as any).birthDate,
      phone: (userData as any).phone,
      role: (userData as any).role,
    };

    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async login(credentials: LoginFormData): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/me", {
      method: "GET",
    });
  }

  async updateUser(
    userId: number,
    userData: Partial<AuthFormData>
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${userId}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
