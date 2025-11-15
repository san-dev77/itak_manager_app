import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../services/api";

interface UserState {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  searchTerm: string;
  selectedRole: string;

  // Actions
  setUsers: (users: User[]) => void;
  setFilteredUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSelectedRole: (role: string) => void;

  // Computed values
  getUserCounts: () => {
    all: number;
    students: number;
    teachers: number;
    staff: number;
    parents: number;
    admins: number;
  };

  // Filter logic
  filterUsers: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      filteredUsers: [],
      isLoading: false,
      searchTerm: "",
      selectedRole: "all",

      setUsers: (users) => set({ users }),
      setFilteredUsers: (users) => set({ filteredUsers: users }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedRole: (role) => set({ selectedRole: role }),

      getUserCounts: () => {
        const { users } = get();
        return {
          all: users.length,
          students: users.filter((user) => user.role === "student").length,
          teachers: users.filter((user) => user.role === "teacher").length,
          staff: users.filter((user) => user.role === "staff").length,
          parents: users.filter((user) => user.role === "parent").length,
          admins: users.filter((user) => user.role === "admin").length,
        };
      },

      filterUsers: () => {
        const { users, searchTerm } = get();
        let filtered = users;

        // Filter by search term only (role filtering is now handled by individual table components)
        if (searchTerm) {
          filtered = filtered.filter(
            (user) =>
              user.firstName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        set({ filteredUsers: filtered });
      },

      addUser: (user) => {
        const { users } = get();
        set({ users: [...users, user] });
        get().filterUsers();
      },

      updateUser: (updatedUser) => {
        const { users } = get();
        set({
          users: users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
        });
        get().filterUsers();
      },

      deleteUser: (userId) => {
        const { users } = get();
        set({
          users: users.filter((user) => user.id !== userId),
        });
        get().filterUsers();
      },
    }),
    {
      name: "itak-user-store",
      partialize: (state) => ({
        users: state.users,
        selectedRole: state.selectedRole,
      }),
    }
  )
);
