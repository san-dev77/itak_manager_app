import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  UserPlus,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import AuthenticatedPage from "../components/layout/AuthenticatedPage";
import PageHeader from "../components/ui/PageHeader";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { HeaderActionButton } from "../components/ui/ActionButton";
import TableActions from "../components/ui/TableActions";
import { UserFormModal } from "../components/users";
import {
  apiService,
  type User,
  USER_ROLE_LABELS,
  type UserRole,
} from "../services/api";
import type { UserFormData, UserEditFormData } from "../schemas/user.schema";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUsers();
      const data = response.data || response;
      if (Array.isArray(data)) {
        setUsers(
          data.filter((u: User) =>
            [
              "super_admin",
              "admin",
              "scolarite",
              "finance",
              "qualite",
            ].includes(u.role)
          )
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: UserFormData) => {
    setActionLoading(true);
    try {
      // Ne pas inclure isActive - le backend le gère automatiquement
      const response = await apiService.createUser(data);
      if (!response.success) {
        throw new Error(
          response.error || "Erreur lors de la création du compte"
        );
      }
      setShowCreate(false);
      fetchUsers();
    } catch (error) {
      console.error("Erreur création:", error);
      throw error; // Re-throw pour que UserFormModal puisse l'afficher
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (data: UserFormData | UserEditFormData) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const response = await apiService.updateUser(selected.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
      });
      if (!response.success) {
        throw new Error(
          response.error || "Erreur lors de la modification du compte"
        );
      }
      setShowEdit(false);
      setSelected(null);
      fetchUsers();
    } catch (error) {
      console.error("Erreur modification:", error);
      throw error; // Re-throw pour que UserFormModal puisse l'afficher
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await apiService.deleteUser(selected.id);
      setShowDelete(false);
      setSelected(null);
      fetchUsers();
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      if (user.isActive) {
        await apiService.deactivateUser(user.id);
      } else {
        await apiService.activateUser(user.id);
      }
      fetchUsers();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const filteredUsers =
    selectedRole === "all"
      ? users
      : users.filter((u) => u.role === selectedRole);

  const roleStats = [
    { value: "super_admin", label: "Président / DG", color: "bg-red-500" },
    { value: "admin", label: "Admin", color: "bg-purple-500" },
    { value: "scolarite", label: "Scolarité", color: "bg-blue-500" },
    { value: "finance", label: "Finance", color: "bg-emerald-500" },
    { value: "qualite", label: "Qualité", color: "bg-amber-500" },
  ];

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: "bg-red-100 text-red-700",
      admin: "bg-purple-100 text-purple-700",
      scolarite: "bg-blue-100 text-blue-700",
      finance: "bg-emerald-100 text-emerald-700",
      qualite: "bg-amber-100 text-amber-700",
    };
    return colors[role] || "bg-slate-100 text-slate-700";
  };

  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-";

  const columns = [
    {
      key: "user",
      header: "Utilisateur",
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
            {u.firstName?.[0]}
            {u.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-xs text-slate-500">@{u.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (u: User) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Mail className="w-3 h-3" />
            {u.email}
          </div>
          {u.phone && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Phone className="w-3 h-3" />
              {u.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "role",
      header: "Rôle",
      render: (u: User) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleBadge(
            u.role
          )}`}
        >
          <Shield className="w-3 h-3" />
          {USER_ROLE_LABELS[u.role as UserRole] || u.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (u: User) => (
        <button
          onClick={() => handleToggleActive(u)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${
            u.isActive
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {u.isActive ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Actif
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              Inactif
            </>
          )}
        </button>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (u: User) => (
        <TableActions
          onView={() => {
            setSelected(u);
            setShowView(true);
          }}
          onEdit={() => {
            setSelected(u);
            setShowEdit(true);
          }}
          onDelete={() => {
            setSelected(u);
            setShowDelete(true);
          }}
        />
      ),
    },
  ];

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des Utilisateurs"
          subtitle="Comptes avec accès au système"
          icon={Users}
          iconColor="from-violet-600 to-purple-700"
          actions={
            <HeaderActionButton
              onClick={() => setShowCreate(true)}
              icon={UserPlus}
              label="Nouveau compte"
            />
          }
        />

        {/* Role Stats */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedRole("all")}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
              selectedRole === "all"
                ? "bg-white shadow-lg border-2 border-slate-300"
                : "bg-white/60 hover:bg-white border border-slate-200"
            }`}
          >
            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center text-white shadow">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p
                className={`text-sm font-bold ${
                  selectedRole === "all" ? "text-slate-900" : "text-slate-700"
                }`}
              >
                Tous
              </p>
              <p className="text-xs font-medium text-slate-500">
                {users.length}
              </p>
            </div>
          </button>
          {roleStats.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedRole(r.value)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                selectedRole === r.value
                  ? "bg-white shadow-lg border-2 border-slate-300"
                  : "bg-white/60 hover:bg-white border border-slate-200"
              }`}
            >
              <div
                className={`w-10 h-10 ${r.color} rounded-lg flex items-center justify-center text-white shadow`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p
                  className={`text-sm font-bold ${
                    selectedRole === r.value
                      ? "text-slate-900"
                      : "text-slate-700"
                  }`}
                >
                  {r.label}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {users.filter((u) => u.role === r.value).length}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable
            data={filteredUsers}
            columns={columns}
            searchPlaceholder="Rechercher..."
            pageSize={10}
            emptyMessage="Aucun utilisateur"
          />
        )}

        {/* Modals */}
        <UserFormModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          mode="create"
          loading={actionLoading}
        />

        <UserFormModal
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            setSelected(null);
          }}
          onSubmit={handleEdit}
          mode="edit"
          loading={actionLoading}
          initialData={
            selected
              ? {
                  firstName: selected.firstName,
                  lastName: selected.lastName,
                  email: selected.email,
                  phone: selected.phone || "",
                  role: selected.role as UserFormData["role"],
                }
              : undefined
          }
        />

        {/* View Modal */}
        <Modal
          isOpen={showView}
          onClose={() => {
            setShowView(false);
            setSelected(null);
          }}
          title="Détails"
          size="sm"
        >
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">
                  {selected.firstName?.[0]}
                  {selected.lastName?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <p className="text-sm text-slate-500">@{selected.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                <InfoItem icon={Mail} label="Email" value={selected.email} />
                <InfoItem
                  icon={Phone}
                  label="Téléphone"
                  value={selected.phone}
                />
                <InfoItem
                  icon={Shield}
                  label="Rôle"
                  value={USER_ROLE_LABELS[selected.role as UserRole]}
                  badge={getRoleBadge(selected.role)}
                />
                <InfoItem
                  icon={UserIcon}
                  label="Statut"
                  value={selected.isActive ? "Actif" : "Inactif"}
                  badge={
                    selected.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }
                />
                {selected.createdAt && (
                  <InfoItem
                    icon={Calendar}
                    label="Créé le"
                    value={formatDate(selected.createdAt)}
                  />
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowView(false);
                    setShowEdit(true);
                  }}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setShowView(false)}
                  className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          isOpen={showDelete}
          onClose={() => {
            setShowDelete(false);
            setSelected(null);
          }}
          onConfirm={handleDelete}
          title="Supprimer ?"
          message={`Voulez-vous supprimer ${selected?.firstName} ${selected?.lastName} ?`}
          type="danger"
          confirmText="Supprimer"
          loading={actionLoading}
        />
      </div>
    </AuthenticatedPage>
  );
};

// Helper component
const InfoItem = ({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
  badge?: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg">
      <Icon className="w-4 h-4 text-slate-400" />
      <div className="flex-1">
        <p className="text-[10px] text-slate-400 uppercase">{label}</p>
        {badge ? (
          <span
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${badge}`}
          >
            {value}
          </span>
        ) : (
          <p className="text-sm text-slate-700">{value}</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
