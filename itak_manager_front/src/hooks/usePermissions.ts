import { useMemo } from "react";
import { useAuth } from "./useAuth";
import type { UserRole, MenuKey, RolePermission } from "../config/permissions";
import {
  hasMenuAccess,
  hasPermission,
  hasRouteAccess,
  getRolePermissions,
} from "../config/permissions";

interface UsePermissionsReturn {
  // Rôle de l'utilisateur
  role: UserRole | null;
  roleLabel: string;

  // Permissions
  permissions: RolePermission | null;

  // Vérifications
  canAccessMenu: (menu: MenuKey) => boolean;
  canAccessRoute: (path: string) => boolean;
  canValidateDiscounts: boolean;
  canViewAll: boolean;
  canModifyAll: boolean;
  canManageUsers: boolean;
  canViewStats: boolean;
  canExportData: boolean;
  canDeleteData: boolean;

  // Helpers
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isScolarite: boolean;
  isFinance: boolean;
  isQualite: boolean;

  // Menus autorisés
  allowedMenus: MenuKey[];
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();

  const role = useMemo(() => {
    return (user?.role as UserRole) || null;
  }, [user?.role]);

  const permissions = useMemo(() => {
    return role ? getRolePermissions(role) : null;
  }, [role]);

  const allowedMenus = useMemo(() => {
    return permissions?.menus ?? [];
  }, [permissions]);

  const canAccessMenu = (menu: MenuKey): boolean => {
    if (!role) return false;
    return hasMenuAccess(role, menu);
  };

  const canAccessRoute = (path: string): boolean => {
    if (!role) return false;
    return hasRouteAccess(role, path);
  };

  return {
    role,
    roleLabel: permissions?.label ?? "Inconnu",
    permissions,

    canAccessMenu,
    canAccessRoute,

    canValidateDiscounts: role
      ? hasPermission(role, "canValidateDiscounts")
      : false,
    canViewAll: role ? hasPermission(role, "canViewAll") : false,
    canModifyAll: role ? hasPermission(role, "canModifyAll") : false,
    canManageUsers: role ? hasPermission(role, "canManageUsers") : false,
    canViewStats: role ? hasPermission(role, "canViewStats") : false,
    canExportData: role ? hasPermission(role, "canExportData") : false,
    canDeleteData: role ? hasPermission(role, "canDeleteData") : false,

    isSuperAdmin: role === "super_admin",
    isAdmin: role === "admin",
    isScolarite: role === "scolarite",
    isFinance: role === "finance",
    isQualite: role === "qualite",

    allowedMenus,
  };
};

export default usePermissions;
