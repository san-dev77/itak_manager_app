import type { AuthFormData, LoginFormData, User, ApiResponse } from "../types";

const API_BASE_URL = "http://localhost:3000/api";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
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
