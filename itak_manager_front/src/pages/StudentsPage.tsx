import { useState, useEffect, useCallback } from "react";
import {
  GraduationCap,
  Users,
  Briefcase,
  Plus,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import AuthenticatedPage from "../components/layout/AuthenticatedPage";
import PageHeader from "../components/ui/PageHeader";
import DataTable from "../components/ui/DataTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { HeaderActionButton } from "../components/ui/ActionButton";
import TableActions from "../components/ui/TableActions";
import { StudentFormModal, StudentViewModal } from "../components/students";
import { TeacherFormModal, TeacherViewModal } from "../components/teachers";
import { StaffFormModal, StaffViewModal } from "../components/staff";
import StudentCardGenerator from "../components/users/StudentCardGenerator";
import { apiService } from "../services/api";
import { useInstitution } from "../hooks/useInstitution";
import type { Institution } from "../contexts/InstitutionContext";
import type {
  StudentWithUser,
  StudentProfileData,
  TeacherProfileData,
  StaffProfileData,
} from "../services/api";
import type { StudentFormData } from "../schemas/student.schema";
import type { TeacherFormData } from "../schemas/teacher.schema";
import type { StaffFormData } from "../schemas/staff.schema";

// Types
interface Student {
  id: string;
  matricule: string;
  enrollmentDate: string | Date;
  photo?: string;
  fatherName?: string;
  motherName?: string;
  tutorName?: string;
  tutorPhone?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  scholarshipStatus?: string;
  institutionId?: string;
  institution?: {
    id: string;
    name: string;
    code: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
  };
}

interface Teacher {
  id: string;
  hireDate: string | Date;
  photo?: string;
  diplomas?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  maritalStatus?: string;
  institutionId?: string;
  institution?: {
    id: string;
    name: string;
    code: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
  };
}

interface Staff {
  id: string;
  position?: string;
  hireDate: string | Date;
  photo?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
  maritalStatus?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    birthDate?: string;
  };
}

type TabType = "students" | "teachers" | "staff";

const StudentsPage = () => {
  const { institutions } = useInstitution();
  const [activeInstitution, setActiveInstitution] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [selected, setSelected] = useState<Student | Teacher | Staff | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);

  // Initialiser l'institution active au chargement
  useEffect(() => {
    if (institutions.length > 0 && !activeInstitution) {
      // Par défaut, sélectionner ITAK s'il existe, sinon la première institution
      const itak = institutions.find(
        (inst: Institution) => inst.code === "ITAK"
      );
      setActiveInstitution(itak ? itak.id : institutions[0].id);
    }
  }, [institutions, activeInstitution]);

  const fetchData = useCallback(async () => {
    if (!activeInstitution) return;
    setLoading(true);
    const institutionId = activeInstitution;
    console.log(
      "🔍 fetchData - institutionId utilisé pour filtrage:",
      institutionId
    );
    const [s, t, st] = await Promise.allSettled([
      apiService.getAllStudents(institutionId),
      apiService.getAllTeachers(institutionId),
      apiService.getAllStaff(),
    ]);
    if (s.status === "fulfilled") {
      const response = s.value;
      console.log("📚 Students response:", response);
      // La réponse peut être { success: true, data: [...] } ou directement [...]
      const data = response?.success
        ? response.data
        : response?.data || response;
      console.log("📚 Students data:", data);
      setStudents(Array.isArray(data) ? (data as unknown as Student[]) : []);
    } else {
      console.error("❌ Erreur récupération students:", s.reason);
    }
    if (t.status === "fulfilled") {
      const response = t.value;
      console.log("📚 Teachers response:", response);
      // La réponse peut être { success: true, data: [...] } ou directement [...]
      const data = response?.success
        ? response.data
        : response?.data || response;
      console.log("📚 Teachers data:", data);
      setTeachers(Array.isArray(data) ? (data as unknown as Teacher[]) : []);
    } else {
      console.error("❌ Erreur récupération teachers:", t.reason);
    }
    if (st.status === "fulfilled") {
      const response = st.value;
      console.log("👔 Staff response:", response);
      // La réponse peut être { success: true, data: [...] } ou directement [...]
      const data = response?.success
        ? response.data
        : response?.data || response;
      console.log("👔 Staff data:", data);
      setStaff(Array.isArray(data) ? (data as unknown as Staff[]) : []);
    } else {
      console.error("❌ Erreur récupération staff:", st.reason);
    }
    setLoading(false);
  }, [activeInstitution]);

  useEffect(() => {
    if (activeInstitution) {
      fetchData();
    }
  }, [activeInstitution, fetchData]);

  const formatDate = (d: string | Date | undefined) => {
    if (!d) return "-";
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatScholarship = (status?: string) => {
    switch (status) {
      case "boursier":
        return { label: "Boursier", color: "bg-emerald-100 text-emerald-800" };
      case "demi_boursier":
        return { label: "Demi-boursier", color: "bg-blue-100 text-blue-800" };
      case "quart_boursier":
        return { label: "Quart-boursier", color: "bg-amber-100 text-amber-800" };
      default:
        return { label: "Non-boursier", color: "bg-slate-100 text-slate-800" };
    }
  };

  const normalizeScholarshipStatus = (
    status?: string
  ): StudentFormData["scholarshipStatus"] => {
    switch (status) {
      case "boursier":
      case "demi_boursier":
      case "quart_boursier":
      case "non_boursier":
        return status;
      default:
        return "non_boursier";
    }
  };

  // Handlers
  const handleCreateStudent = async (
    data: StudentFormData,
    photo: File | null
  ) => {
    setActionLoading(true);
    try {
      // Toujours créer un User d'abord (email optionnel)
      const userRes = await apiService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email && data.email.trim() ? data.email.trim() : undefined,
        phone: data.phone,
        password: "temp123456",
        role: "scolarite",
      });

      console.log("Réponse createUser:", userRes);

      // Vérifier si la création a échoué
      if (!userRes.success) {
        const errorMsg =
          userRes.error || "Erreur lors de la création de l'utilisateur";
        throw new Error(errorMsg);
      }

      // La réponse peut être { data: { user: {...} } } ou { data: {...} } ou directement l'user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = userRes as any;
      const userData =
        response?.data?.user || response?.data || response?.user || response;
      console.log("userData extrait:", userData);

      const userId = userData?.id;
      console.log("userId extrait:", userId);

      if (!userId) {
        console.error(
          "Structure réponse inattendue:",
          JSON.stringify(userRes, null, 2)
        );
        throw new Error(
          "Erreur lors de la création de l'utilisateur - userId non trouvé"
        );
      }

      const studentData: StudentProfileData = {
        userId: userId,
        matricule: data.matricule,
        enrollmentDate: data.enrollmentDate,
        scholarshipStatus: data.scholarshipStatus || "non_boursier",
        fatherName: data.fatherName,
        motherName: data.motherName,
        tutorName: data.tutorName,
        tutorPhone: data.tutorPhone,
        address: data.address,
        emergencyContact: data.emergencyContact,
        notes: data.notes,
        institutionId: data.institutionId,
        photo: photo ? await toBase64(photo) : undefined,
      };

      const studentRes = await apiService.createStudentProfile(studentData);
      if (!studentRes.data && !studentRes) {
        throw new Error("Erreur lors de la création du profil étudiant");
      }

      setShowCreate(false);
      fetchData();
    } catch (error) {
      console.error("Erreur création étudiant:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditStudent = async (
    data: StudentFormData,
    photo: File | null
  ) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const student = selected as Student;

      // Mettre à jour l'utilisateur (firstName, lastName, email, phone)
      if (student.user?.id) {
        await apiService.updateUser(student.user.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email:
            data.email && data.email.trim() ? data.email.trim() : undefined,
          phone: data.phone,
        });
      }

      // Mettre à jour le profil étudiant
      const updateData = {
        matricule: data.matricule,
        enrollmentDate: data.enrollmentDate,
        scholarshipStatus: data.scholarshipStatus || "non_boursier",
        fatherName: data.fatherName,
        motherName: data.motherName,
        tutorName: data.tutorName,
        tutorPhone: data.tutorPhone,
        address: data.address,
        emergencyContact: data.emergencyContact,
        notes: data.notes,
        institutionId: data.institutionId,
        photo: photo ? await toBase64(photo) : undefined,
      };
      await apiService.updateStudentProfile(
        selected.id,
        updateData as Parameters<typeof apiService.updateStudentProfile>[1]
      );
      fetchData();
    } catch (error) {
      console.error("Erreur modification étudiant:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Teacher handlers
  const handleCreateTeacher = async (data: TeacherFormData) => {
    setActionLoading(true);
    try {
      const userRes = await apiService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email && data.email.trim() ? data.email.trim() : undefined,
        phone: data.phone,
        password: "temp123456",
        role: "scolarite",
      });

      // Vérifier si la création a échoué
      if (!userRes.success) {
        throw new Error(
          userRes.error || "Erreur lors de la création de l'utilisateur"
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = userRes as any;
      const userData =
        response?.data?.user || response?.data || response?.user || response;
      const userId = userData?.id;

      if (!userId) {
        throw new Error(
          "Erreur lors de la création de l'utilisateur - userId non trouvé"
        );
      }

      const institutionId =
        data.institutionId || activeInstitution || undefined;
      console.log("🏫 Création enseignant - institutionId:", institutionId);
      console.log("🏫 activeInstitution:", activeInstitution);

      const teacherData: TeacherProfileData = {
        userId: userId,
        hireDate: data.hireDate,
        diplomas: data.diplomas,
        emergencyContact: data.emergencyContact,
        maritalStatus: data.maritalStatus,
        institutionId: institutionId || undefined,
      };

      console.log("📤 Données envoyées pour création enseignant:", teacherData);
      const teacherRes = await apiService.createTeacherProfile(teacherData);
      console.log("📥 Réponse création enseignant:", teacherRes);

      // Récupérer l'institutionId de l'enseignant créé pour s'assurer qu'on filtre correctement
      const createdTeacher = teacherRes?.data || teacherRes;
      const createdTeacherInstitutionId =
        (createdTeacher as Teacher)?.institutionId ||
        institutionId ||
        undefined;
      console.log(
        "🏫 InstitutionId de l'enseignant créé:",
        createdTeacherInstitutionId
      );

      setShowCreate(false);
      // Recharger les données en utilisant l'institutionId de l'enseignant créé
      // pour s'assurer qu'il apparaît dans la liste
      setTimeout(async () => {
        setLoading(true);
        try {
          const response = await apiService.getAllTeachers(
            createdTeacherInstitutionId
          );
          const data = response?.success
            ? response.data
            : response?.data || response;
          console.log("📚 Teachers après création:", data);
          setTeachers(
            Array.isArray(data) ? (data as unknown as Teacher[]) : []
          );
        } catch (error) {
          console.error(
            "❌ Erreur récupération teachers après création:",
            error
          );
          // En cas d'erreur, recharger toutes les données
          fetchData();
        } finally {
          setLoading(false);
        }
      }, 500);
    } catch (error: unknown) {
      console.error("Erreur création enseignant:", error);
      let errorMessage = "Erreur inconnue";

      // Gérer les erreurs de l'API
      if (error && typeof error === "object") {
        const apiError = error as {
          message?: string | string[];
          statusCode?: number;
          error?: string;
        };
        if (apiError.statusCode === 409) {
          errorMessage = "Cet email est déjà utilisé par un autre utilisateur";
        } else if (apiError.statusCode === 400) {
          if (Array.isArray(apiError.message)) {
            errorMessage = apiError.message.join(", ");
          } else if (typeof apiError.message === "string") {
            errorMessage = apiError.message;
          } else {
            errorMessage = "Données invalides";
          }
        } else if (Array.isArray(apiError.message)) {
          errorMessage = apiError.message.join(", ");
        } else if (typeof apiError.message === "string") {
          errorMessage = apiError.message;
        } else if (typeof apiError.error === "string") {
          errorMessage = apiError.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Erreur: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTeacher = async (data: TeacherFormData) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const teacher = selected as Teacher;

      // Mettre à jour l'utilisateur (firstName, lastName, email, phone)
      if (teacher.user?.id) {
        await apiService.updateUser(teacher.user.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email:
            data.email && data.email.trim() ? data.email.trim() : undefined,
          phone: data.phone,
        });
      }

      // Mettre à jour le profil enseignant
      const updateData = {
        hireDate: data.hireDate,
        diplomas: data.diplomas,
        emergencyContact: data.emergencyContact,
        maritalStatus: data.maritalStatus,
        institutionId: data.institutionId,
      };
      await apiService.updateTeacherProfile(
        selected.id,
        updateData as Parameters<typeof apiService.updateTeacherProfile>[1]
      );
      fetchData();
    } catch (error) {
      console.error("Erreur modification enseignant:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Staff handlers
  const handleCreateStaff = async (data: StaffFormData) => {
    setActionLoading(true);
    try {
      const userRes = await apiService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email && data.email.trim() ? data.email.trim() : undefined,
        phone: data.phone,
        password: "temp123456",
        role: "scolarite",
      });

      // Vérifier si la création a échoué
      if (!userRes.success) {
        throw new Error(
          userRes.error || "Erreur lors de la création de l'utilisateur"
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = userRes as any;
      const userData =
        response?.data?.user || response?.data || response?.user || response;
      const userId = userData?.id;

      if (!userId) {
        throw new Error(
          "Erreur lors de la création de l'utilisateur - userId non trouvé"
        );
      }

      const staffData: StaffProfileData = {
        userId: userId,
        hireDate: data.hireDate,
        position: data.position,
        emergencyContact: data.emergencyContact,
        maritalStatus: data.maritalStatus,
      };

      await apiService.createStaffProfile(staffData);
      setShowCreate(false);
      fetchData();
    } catch (error: unknown) {
      console.error("Erreur création personnel:", error);
      let errorMessage = "Erreur inconnue";

      // Gérer les erreurs de l'API
      if (error && typeof error === "object") {
        const apiError = error as {
          message?: string | string[];
          statusCode?: number;
          error?: string;
        };
        if (apiError.statusCode === 409) {
          errorMessage = "Cet email est déjà utilisé par un autre utilisateur";
        } else if (apiError.statusCode === 400) {
          if (Array.isArray(apiError.message)) {
            errorMessage = apiError.message.join(", ");
          } else if (typeof apiError.message === "string") {
            errorMessage = apiError.message;
          } else {
            errorMessage = "Données invalides";
          }
        } else if (Array.isArray(apiError.message)) {
          errorMessage = apiError.message.join(", ");
        } else if (typeof apiError.message === "string") {
          errorMessage = apiError.message;
        } else if (typeof apiError.error === "string") {
          errorMessage = apiError.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Erreur: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditStaff = async (data: StaffFormData) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const staff = selected as Staff;

      // Mettre à jour l'utilisateur (firstName, lastName, email, phone)
      if (staff.user?.id) {
        await apiService.updateUser(staff.user.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email:
            data.email && data.email.trim() ? data.email.trim() : undefined,
          phone: data.phone,
        });
      }

      // Mettre à jour le profil staff
      const updateData = {
        hireDate: data.hireDate,
        position: data.position,
        emergencyContact: data.emergencyContact,
        maritalStatus: data.maritalStatus,
      };
      await apiService.updateStaffProfile(
        selected.id,
        updateData as Parameters<typeof apiService.updateStaffProfile>[1]
      );
      fetchData();
    } catch (error) {
      console.error("Erreur modification personnel:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      if (activeTab === "students") await apiService.deleteStudent(selected.id);
      else if (activeTab === "teachers")
        await apiService.deleteTeacher(selected.id);
      else await apiService.deleteStaff(selected.id);
      setShowDelete(false);
      setSelected(null);
      fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  // Utils
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  // Filtrer les données selon l'institution active
  const filteredStudents = activeInstitution
    ? students.filter((s) => s.institutionId === activeInstitution)
    : [];
  const filteredTeachers = activeInstitution
    ? teachers.filter((t) => t.institutionId === activeInstitution)
    : [];
  const filteredStaff = staff; // Le staff n'a pas d'institution

  const tabs = [
    {
      id: "students" as TabType,
      label: "Étudiants",
      icon: GraduationCap,
      count: filteredStudents.length,
      color: "bg-blue-500",
    },
    {
      id: "teachers" as TabType,
      label: "Enseignants",
      icon: Users,
      count: filteredTeachers.length,
      color: "bg-emerald-500",
    },
    {
      id: "staff" as TabType,
      label: "Personnel",
      icon: Briefcase,
      count: filteredStaff.length,
      color: "bg-violet-500",
    },
  ];

  // Student columns
  const studentCols = [
    {
      key: "photo",
      header: "",
      render: (s: Student) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
          {s.photo ? (
            <img src={s.photo} className="w-full h-full object-cover" />
          ) : (
            <span className="text-blue-700 font-bold text-xs">
              {s.user?.firstName?.[0]}
              {s.user?.lastName?.[0]}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Étudiant",
      render: (s: Student) => (
        <div>
          <p className="font-semibold text-slate-900">
            {s.user?.firstName} {s.user?.lastName}
          </p>
          <p className="text-xs text-slate-500">{s.user?.gender || "-"}</p>
        </div>
      ),
    },
    {
      key: "matricule",
      header: "Matricule",
      render: (s: Student) => (
        <span className="px-2 py-1 bg-slate-200 text-slate-800 text-sm rounded font-mono">
          {s.matricule}
        </span>
      ),
    },
    {
      key: "institution",
      header: "Affectation",
      render: (s: Student) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded font-medium">
          {s.institution?.name || "N/A"}
        </span>
      ),
    },
    {
      key: "scholarshipStatus",
      header: "Statut",
      render: (s: Student) => {
        const status = formatScholarship(s.scholarshipStatus);
        return (
          <span className={`px-2 py-1 rounded text-sm font-semibold ${status.color}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: "contact",
      header: "Contact",
      render: (s: Student) => (
        <div className="space-y-1 text-sm">
          {s.user?.email && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Mail className="w-3 h-3" />
              {s.user.email}
            </div>
          )}
          {s.user?.phone && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Phone className="w-3 h-3" />
              {s.user.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "date",
      header: "Inscription",
      render: (s: Student) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Calendar className="w-3 h-3" />
          {formatDate(s.enrollmentDate)}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (s: Student) => (
        <TableActions
          onView={() => {
            setSelected(s);
            setShowView(true);
          }}
          onEdit={() => {
            setSelected(s);
            setShowEdit(true);
          }}
          onDelete={() => {
            setSelected(s);
            setShowDelete(true);
          }}
        />
      ),
    },
  ];

  // Teacher columns
  const teacherCols = [
    {
      key: "name",
      header: "Enseignant",
      render: (t: Teacher) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">
            {t.user?.firstName?.[0]}
            {t.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {t.user?.firstName} {t.user?.lastName}
            </p>
            <p className="text-xs text-slate-500">{t.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "spec",
      header: "Diplômes",
      render: (t: Teacher) => (
        <span className="text-sm text-slate-700">{t.diplomas || "-"}</span>
      ),
    },
    {
      key: "institution",
      header: "Affectation",
      render: (t: Teacher) => (
        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-sm rounded font-medium">
          {t.institution?.name || "N/A"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Embauche",
      render: (t: Teacher) => (
        <span className="text-sm text-slate-600">{formatDate(t.hireDate)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (t: Teacher) => (
        <TableActions
          onView={() => {
            setSelected(t);
            setShowView(true);
          }}
          onEdit={() => {
            setSelected(t);
            setShowEdit(true);
          }}
          onDelete={() => {
            setSelected(t);
            setShowDelete(true);
          }}
        />
      ),
    },
  ];

  // Staff columns
  const staffCols = [
    {
      key: "name",
      header: "Personnel",
      render: (s: Staff) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs">
            {s.user?.firstName?.[0]}
            {s.user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {s.user?.firstName} {s.user?.lastName}
            </p>
            <p className="text-xs text-slate-500">{s.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Poste",
      render: (s: Staff) => (
        <span className="text-sm text-slate-700">{s.position}</span>
      ),
    },
    {
      key: "date",
      header: "Embauche",
      render: (s: Staff) => (
        <span className="text-sm text-slate-600">{formatDate(s.hireDate)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (s: Staff) => (
        <TableActions
          onView={() => {
            setSelected(s);
            setShowView(true);
          }}
          onEdit={() => {
            setSelected(s);
            setShowEdit(true);
          }}
          onDelete={() => {
            setSelected(s);
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
          title="Gestion Académique"
          subtitle="Étudiants, enseignants et personnel"
          icon={GraduationCap}
          iconColor="from-blue-600 to-indigo-700"
          actions={
            <HeaderActionButton
              onClick={() => setShowCreate(true)}
              icon={Plus}
              label={
                activeTab === "students"
                  ? "Nouvel étudiant"
                  : activeTab === "teachers"
                  ? "Nouvel enseignant"
                  : "Nouveau personnel"
              }
            />
          }
        />

        {/* Institution Tabs */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex gap-3 mb-4">
            {institutions.map((institution: Institution) => {
              const isActive = activeInstitution === institution.id;

              return (
                <button
                  key={institution.id}
                  onClick={() => setActiveInstitution(institution.id)}
                  className={`flex-1 px-6 py-4 rounded-lg transition-all border-2 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 shadow-lg"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-center">
                    <p
                      className={`text-lg font-bold ${
                        isActive ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {institution.name}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isActive ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {institution.description || institution.code}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Type Tabs */}
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-white shadow-lg border-2 border-slate-300"
                    : "bg-white/60 hover:bg-white border border-slate-200"
                }`}
              >
                <div
                  className={`w-10 h-10 ${tab.color} rounded-lg flex items-center justify-center text-white shadow`}
                >
                  <tab.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-bold ${
                      activeTab === tab.id ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {tab.count}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tables */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "students" && (
              <DataTable
                data={filteredStudents}
                columns={studentCols}
                searchPlaceholder="Rechercher..."
                pageSize={10}
                emptyMessage="Aucun étudiant"
              />
            )}
            {activeTab === "teachers" && (
              <DataTable
                data={filteredTeachers}
                columns={teacherCols}
                searchPlaceholder="Rechercher..."
                pageSize={10}
                emptyMessage="Aucun enseignant"
              />
            )}
            {activeTab === "staff" && (
              <DataTable
                data={filteredStaff}
                columns={staffCols}
                searchPlaceholder="Rechercher..."
                pageSize={10}
                emptyMessage="Aucun personnel"
              />
            )}
          </>
        )}

        {/* Modals */}
        {activeTab === "students" && (
          <>
            <StudentFormModal
              isOpen={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateStudent}
              mode="create"
              loading={actionLoading}
            />
            <StudentFormModal
              isOpen={showEdit}
              onClose={() => {
                setShowEdit(false);
                setSelected(null);
              }}
              onSubmit={handleEditStudent}
              mode="edit"
              loading={actionLoading}
              initialData={
                selected
                  ? {
                      firstName: (selected as Student).user?.firstName || "",
                      lastName: (selected as Student).user?.lastName || "",
                      email: (selected as Student).user?.email || "",
                      phone: (selected as Student).user?.phone || "",
                      gender: ((selected as Student).user?.gender || "") as
                        | ""
                        | "M"
                        | "F",
                      birthDate:
                        (selected as Student).user?.birthDate
                          ?.toString()
                          .split("T")[0] || "",
                      matricule: (selected as Student).matricule || "",
                      enrollmentDate:
                        String(
                          (selected as Student).enrollmentDate || ""
                        ).split("T")[0] || "",
                      fatherName: (selected as Student).fatherName || "",
                      motherName: (selected as Student).motherName || "",
                      tutorName: (selected as Student).tutorName || "",
                      tutorPhone: (selected as Student).tutorPhone || "",
                      address: (selected as Student).address || "",
                      emergencyContact:
                        (selected as Student).emergencyContact || "",
                      notes: (selected as Student).notes || "",
                      scholarshipStatus: normalizeScholarshipStatus(
                        (selected as Student).scholarshipStatus
                      ),
                      institutionId: (selected as Student).institutionId || "",
                    }
                  : undefined
              }
              initialPhoto={(selected as Student)?.photo}
            />
            <StudentViewModal
              isOpen={showView}
              onClose={() => {
                setShowView(false);
                setSelected(null);
              }}
              student={selected as Student}
              onEdit={() => {
                setShowView(false);
                setShowEdit(true);
              }}
              onGenerateCard={() => {
                setShowView(false);
                setShowCard(true);
              }}
            />
            <StudentCardGenerator
              isOpen={showCard}
              onClose={() => {
                setShowCard(false);
                setSelected(null);
              }}
              student={selected as StudentWithUser}
            />
          </>
        )}

        {/* Teacher Modals */}
        {activeTab === "teachers" && (
          <>
            <TeacherFormModal
              isOpen={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateTeacher}
              mode="create"
              loading={actionLoading}
            />
            <TeacherFormModal
              isOpen={showEdit}
              onClose={() => {
                setShowEdit(false);
                setSelected(null);
              }}
              onSubmit={handleEditTeacher}
              mode="edit"
              loading={actionLoading}
              initialData={
                selected
                  ? {
                      firstName: (selected as Teacher).user?.firstName || "",
                      lastName: (selected as Teacher).user?.lastName || "",
                      email: (selected as Teacher).user?.email || "",
                      phone: (selected as Teacher).user?.phone || "",
                      hireDate:
                        String((selected as Teacher).hireDate || "").split(
                          "T"
                        )[0] || "",
                      diplomas: (selected as Teacher).diplomas || "",
                      emergencyContact:
                        (selected as Teacher).emergencyContact || "",
                      maritalStatus: (selected as Teacher).maritalStatus || "",
                      institutionId: (selected as Teacher).institutionId || "",
                    }
                  : undefined
              }
            />
            <TeacherViewModal
              isOpen={showView}
              onClose={() => {
                setShowView(false);
                setSelected(null);
              }}
              teacher={selected as Teacher}
              onEdit={() => {
                setShowView(false);
                setShowEdit(true);
              }}
            />
          </>
        )}

        {/* Staff Modals */}
        {activeTab === "staff" && (
          <>
            <StaffFormModal
              isOpen={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateStaff}
              mode="create"
              loading={actionLoading}
            />
            <StaffFormModal
              isOpen={showEdit}
              onClose={() => {
                setShowEdit(false);
                setSelected(null);
              }}
              onSubmit={handleEditStaff}
              mode="edit"
              loading={actionLoading}
              initialData={
                selected
                  ? {
                      firstName: (selected as Staff).user?.firstName || "",
                      lastName: (selected as Staff).user?.lastName || "",
                      email: (selected as Staff).user?.email || "",
                      phone: (selected as Staff).user?.phone || "",
                      hireDate:
                        String((selected as Staff).hireDate || "").split(
                          "T"
                        )[0] || "",
                      position: (selected as Staff).position || "",
                      emergencyContact:
                        (selected as Staff).emergencyContact || "",
                      maritalStatus: (selected as Staff).maritalStatus || "",
                    }
                  : undefined
              }
            />
            <StaffViewModal
              isOpen={showView}
              onClose={() => {
                setShowView(false);
                setSelected(null);
              }}
              staff={selected as Staff}
              onEdit={() => {
                setShowView(false);
                setShowEdit(true);
              }}
            />
          </>
        )}

        <ConfirmDialog
          isOpen={showDelete}
          onClose={() => {
            setShowDelete(false);
            setSelected(null);
          }}
          onConfirm={handleDelete}
          title="Supprimer ?"
          message={`Voulez-vous vraiment supprimer ${
            (selected as Student | null)?.user?.firstName || ""
          } ?`}
          type="danger"
          confirmText="Supprimer"
          loading={actionLoading}
        />
      </div>
    </AuthenticatedPage>
  );
};

export default StudentsPage;
