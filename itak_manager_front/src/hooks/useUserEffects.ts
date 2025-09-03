import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";

export const useUserEffects = () => {
  const { users, searchTerm, selectedRole, filterUsers } = useUserStore();

  // Synchroniser les filtres quand les données changent
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, filterUsers]);

  // Effet pour nettoyer les filtres quand on change de rôle
  useEffect(() => {
    filterUsers();
  }, [selectedRole, filterUsers]);
};
