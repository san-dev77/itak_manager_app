// Types de rôles disponibles
export type UserRole =
  | "super_admin"
  | "admin"
  | "scolarite"
  | "finance"
  | "qualite";

// Types de menus disponibles
export type MenuKey =
  | "dashboard"
  | "users"
  | "classes"
  | "calendar"
  | "school-years"
  | "finances"
  | "settings"
  | "students"
  | "qualite";

// Configuration des permissions par rôle
export interface RolePermission {
  label: string;
  description: string;
  menus: MenuKey[];
  canValidateDiscounts: boolean; // Peut valider les remises financières
  canViewAll: boolean; // Accès en lecture à tout
  canModifyAll: boolean; // Peut modifier partout
  canManageUsers: boolean; // Peut gérer les utilisateurs
  canViewStats: boolean; // Peut voir les statistiques globales
  canExportData: boolean; // Peut exporter des données
  canDeleteData: boolean; // Peut supprimer des données
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  super_admin: {
    label: "Président / DG",
    description: "Accès total à toutes les fonctionnalités",
    menus: [
      "dashboard",
      "users",
      "students",
      "classes",
      "calendar",
      "school-years",
      "finances",
      "qualite",
      "settings",
    ],
    canValidateDiscounts: true,
    canViewAll: true,
    canModifyAll: true,
    canManageUsers: true,
    canViewStats: true,
    canExportData: true,
    canDeleteData: true,
  },
  admin: {
    label: "Administrateur",
    description: "Vue globale avec droits limités",
    menus: [
      "dashboard",
      "users",
      "students",
      "classes",
      "calendar",
      "school-years",
      "settings",
    ],
    canValidateDiscounts: false,
    canViewAll: true,
    canModifyAll: false,
    canManageUsers: true,
    canViewStats: true,
    canExportData: true,
    canDeleteData: false,
  },
  scolarite: {
    label: "Service Scolarité",
    description: "Gestion des étudiants, notes, diplômes",
    menus: [
      "dashboard",
      "students",
      "classes",
      "calendar",
      "school-years",
      "settings",
    ],
    canValidateDiscounts: false,
    canViewAll: false,
    canModifyAll: false,
    canManageUsers: false,
    canViewStats: false,
    canExportData: true,
    canDeleteData: false,
  },
  finance: {
    label: "Service Comptabilité",
    description: "Gestion des finances et paiements",
    menus: ["dashboard", "finances", "students"],
    canValidateDiscounts: false, // Doit demander validation au DG/Président
    canViewAll: false,
    canModifyAll: false,
    canManageUsers: false,
    canViewStats: true, // Stats financières uniquement
    canExportData: true,
    canDeleteData: false,
  },
  qualite: {
    label: "Assurance Qualité & RP",
    description: "Suivi qualité, volumes horaires, modules",
    menus: ["dashboard", "qualite", "classes", "calendar"],
    canValidateDiscounts: false,
    canViewAll: false,
    canModifyAll: false,
    canManageUsers: false,
    canViewStats: true,
    canExportData: true,
    canDeleteData: false,
  },
};

// Labels des rôles pour l'affichage
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Président / DG",
  admin: "Administrateur",
  scolarite: "Scolarité",
  finance: "Comptabilité",
  qualite: "Assurance Qualité",
};

// Options de rôles pour les selects
export const ROLE_OPTIONS = [
  { value: "super_admin", label: "Président / DG" },
  { value: "admin", label: "Administrateur" },
  { value: "scolarite", label: "Service Scolarité" },
  { value: "finance", label: "Service Comptabilité" },
  { value: "qualite", label: "Assurance Qualité & RP" },
];

// Vérifier si un rôle a accès à un menu
export const hasMenuAccess = (role: UserRole, menu: MenuKey): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.menus.includes(menu) ?? false;
};

// Vérifier si un rôle a une permission spécifique
export const hasPermission = (
  role: UserRole,
  permission: keyof Omit<RolePermission, "label" | "description" | "menus">
): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions?.[permission] ?? false;
};

// Obtenir les permissions d'un rôle
export const getRolePermissions = (role: UserRole): RolePermission | null => {
  return ROLE_PERMISSIONS[role] ?? null;
};

// Routes protégées par menu
export const MENU_ROUTES: Record<MenuKey, string[]> = {
  dashboard: ["/dashboard"],
  users: ["/users"],
  students: ["/students", "/students/*"],
  classes: ["/classes-subjects"],
  calendar: ["/calendar", "/calendar/*"],
  "school-years": ["/school-years"],
  finances: ["/finances", "/finances/*"],
  qualite: ["/qualite", "/qualite/*"],
  settings: ["/settings", "/settings/*"],
};

// Vérifier si un rôle a accès à une route
export const hasRouteAccess = (role: UserRole, path: string): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  // Super admin a accès à tout
  if (role === "super_admin") return true;

  // Vérifier chaque menu autorisé
  for (const menu of permissions.menus) {
    const routes = MENU_ROUTES[menu];
    for (const route of routes) {
      if (route.endsWith("*")) {
        // Route avec wildcard
        const baseRoute = route.slice(0, -1);
        if (path.startsWith(baseRoute)) return true;
      } else {
        // Route exacte
        if (path === route) return true;
      }
    }
  }

  return false;
};
