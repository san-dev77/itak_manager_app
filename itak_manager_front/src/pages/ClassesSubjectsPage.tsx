import { useState, useEffect, useCallback } from "react";
import { Plus, BookOpen, GraduationCap } from "lucide-react";
import AuthenticatedPage from "../components/layout/AuthenticatedPage";
import PageHeader from "../components/ui/PageHeader";
import DataTable from "../components/ui/DataTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { HeaderActionButton } from "../components/ui/ActionButton";
import TableActions from "../components/ui/TableActions";
import Modal from "../components/ui/Modal";
import { FormInput } from "../components/form";
import {
  apiService,
  type Class,
  type Subject,
  type ClassData,
  type SubjectData,
  type ClassCategory,
} from "../services/api";

type TabType = "classes" | "subjects";

const ClassesSubjectsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("classes");
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classCategories, setClassCategories] = useState<ClassCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Class | Subject | null>(null);

  // Form states
  const [classForm, setClassForm] = useState<ClassData>({
    name: "",
    code: "",
    classCategoryId: "",
    description: "",
    level: "",
    capacity: undefined,
    orderLevel: 1,
  });

  const [subjectForm, setSubjectForm] = useState<SubjectData>({
    name: "",
    code: "",
  });

  // Class form step
  const [classFormStep, setClassFormStep] = useState<
    "category" | "details" | "final"
  >("category");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [classesResponse, subjectsResponse, categoriesResponse] =
        await Promise.all([
          apiService.getAllClasses(),
          apiService.getAllSubjects(),
          apiService.getAllClassCategories(),
        ]);

      if (classesResponse.success && classesResponse.data) {
        setClasses(classesResponse.data);
      }

      if (subjectsResponse.success && subjectsResponse.data) {
        setSubjects(subjectsResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setClassCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Class handlers
  const handleCreateClass = async () => {
    if (!classForm.classCategoryId) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }

    setActionLoading(true);
    try {
      const response = await apiService.createClass(classForm);
      if (response.success && response.data) {
        setClasses([...classes, response.data]);
        setShowCreate(false);
        resetClassForm();
      } else {
        alert(response.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la classe:", error);
      alert("Erreur lors de la création de la classe");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClass = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const classItem = selected as Class;
      const dataToUpdate = {
        ...classForm,
        classCategoryId: classForm.classCategoryId || classItem.classCategoryId,
      };
      const response = await apiService.updateClass(classItem.id, dataToUpdate);
      if (response.success && response.data) {
        setClasses(
          classes.map((c) => (c.id === classItem.id ? response.data! : c))
        );
        setShowEdit(false);
        setSelected(null);
        resetClassForm();
      } else {
        alert(response.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la classe:", error);
      alert("Erreur lors de la mise à jour de la classe");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const classItem = selected as Class;
      const idToUse = isNaN(Number(classItem.id))
        ? classItem.id
        : Number(classItem.id);
      const response = await apiService.deleteClass(idToUse as number);
      if (response.success) {
        setClasses(classes.filter((c) => c.id !== classItem.id));
        setShowDelete(false);
        setSelected(null);
      } else {
        alert(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la classe:", error);
      alert("Erreur lors de la suppression de la classe");
    } finally {
      setActionLoading(false);
    }
  };

  // Subject handlers
  const handleCreateSubject = async () => {
    setActionLoading(true);
    try {
      const response = await apiService.createSubject(subjectForm);
      if (response.success && response.data) {
        setSubjects([...subjects, response.data]);
        setShowCreate(false);
        resetSubjectForm();
      } else {
        alert(response.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la matière:", error);
      alert("Erreur lors de la création de la matière");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubject = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const subject = selected as Subject;
      const response = await apiService.updateSubject(subject.id, subjectForm);
      if (response.success && response.data) {
        setSubjects(
          subjects.map((s) => (s.id === subject.id ? response.data! : s))
        );
        setShowEdit(false);
        setSelected(null);
        resetSubjectForm();
      } else {
        alert(response.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la matière:", error);
      alert("Erreur lors de la mise à jour de la matière");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const subject = selected as Subject;
      const response = await apiService.deleteSubject(subject.id);
      if (response.success) {
        setSubjects(subjects.filter((s) => s.id !== subject.id));
        setShowDelete(false);
        setSelected(null);
      } else {
        alert(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la matière:", error);
      alert("Erreur lors de la suppression de la matière");
    } finally {
      setActionLoading(false);
    }
  };

  const resetClassForm = () => {
    setClassForm({
      name: "",
      code: "",
      classCategoryId: "",
      description: "",
      level: "",
      capacity: undefined,
      orderLevel: 1,
    });
    setClassFormStep("category");
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      name: "",
      code: "",
    });
  };

  const openEditClassModal = (classItem: Class) => {
    setSelected(classItem);
    setClassForm({
      name: classItem.name,
      code: classItem.code || "",
      classCategoryId: classItem.classCategoryId,
      description: classItem.description || "",
      level: classItem.level,
      capacity: classItem.capacity,
      orderLevel: classItem.orderLevel || 1,
    });
    setClassFormStep("details");
    setShowEdit(true);
  };

  const openEditSubjectModal = (subject: Subject) => {
    setSelected(subject);
    setSubjectForm({
      name: subject.name,
      code: subject.code,
    });
    setShowEdit(true);
  };

  // Navigation between steps
  const nextStep = () => {
    if (
      classFormStep === "category" &&
      classForm.classCategoryId !== null &&
      classForm.classCategoryId !== ""
    ) {
      setClassFormStep("details");
    } else if (
      classFormStep === "details" &&
      classForm.name &&
      classForm.code &&
      classForm.level
    ) {
      setClassFormStep("final");
    }
  };

  const prevStep = () => {
    if (classFormStep === "final") {
      setClassFormStep("details");
    } else if (classFormStep === "details") {
      setClassFormStep("category");
    }
  };

  const canProceed = () => {
    if (classFormStep === "category") {
      return (
        classForm.classCategoryId !== null && classForm.classCategoryId !== ""
      );
    } else if (classFormStep === "details") {
      return !!classForm.name && !!classForm.code && !!classForm.level;
    }
    return true;
  };

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      // Lycée
      seconde: "Seconde (11ème)",
      premiere: "Première (12ème)",
      terminale: "Terminale (13ème)",
      // Enseignement Supérieur
      bts: "BTS",
      dut: "DUT",
      licence1: "Licence 1",
      licence2: "Licence 2",
      licence3: "Licence 3",
      master1: "Master 1",
      master2: "Master 2",
    };
    return levels[level] || level;
  };

  const getClassName = (classItem: Class) => {
    return (
      classItem.classCategory?.name ||
      classItem.category?.name ||
      classCategories.find((cat) => cat.id === classItem.classCategoryId)
        ?.name ||
      "Non définie"
    );
  };

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR");
  };

  // Tabs configuration
  const tabs = [
    {
      id: "classes" as TabType,
      label: "Classes",
      icon: GraduationCap,
      count: classes.length,
      color: "bg-blue-500",
    },
    {
      id: "subjects" as TabType,
      label: "Matières",
      icon: BookOpen,
      count: subjects.length,
      color: "bg-indigo-500",
    },
  ];

  // Class columns
  const classCols = [
    {
      key: "name",
      header: "Classe",
      render: (c: Class) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{c.name}</p>
            <p className="text-xs text-slate-500">{c.code || "N/A"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      render: (c: Class) => (
        <span className="px-2 py-1 bg-slate-100 text-slate-800 text-sm rounded font-medium">
          {getClassName(c)}
        </span>
      ),
    },
    {
      key: "level",
      header: "Niveau",
      render: (c: Class) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded font-medium">
          {getLevelLabel(c.level)}
        </span>
      ),
    },
    {
      key: "capacity",
      header: "Capacité",
      render: (c: Class) => (
        <span className="text-sm text-slate-700">
          {c.capacity ? `${c.capacity} élèves` : "N/A"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Créée le",
      render: (c: Class) => (
        <span className="text-sm text-slate-600">
          {formatDate(c.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (c: Class) => (
        <TableActions
          onEdit={() => openEditClassModal(c)}
          onDelete={() => {
            setSelected(c);
            setShowDelete(true);
          }}
        />
      ),
    },
  ];

  // Subject columns
  const subjectCols = [
    {
      key: "name",
      header: "Matière",
      render: (s: Subject) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{s.name}</p>
            <p className="text-xs text-slate-500 font-mono">{s.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Créée le",
      render: (s: Subject) => (
        <span className="text-sm text-slate-600">
          {formatDate(s.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (s: Subject) => (
        <TableActions
          onEdit={() => openEditSubjectModal(s)}
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
          title="Classes et Matières"
          subtitle="Gérez les classes et les matières de votre établissement"
          icon={GraduationCap}
          iconColor="from-blue-600 to-indigo-700"
          actions={
            <HeaderActionButton
              onClick={() => {
                if (activeTab === "classes") {
                  resetClassForm();
                  setClassFormStep("category");
                } else {
                  resetSubjectForm();
                }
                setShowCreate(true);
              }}
              icon={Plus}
              label={
                activeTab === "classes" ? "Nouvelle classe" : "Nouvelle matière"
              }
            />
          }
        />

        {/* Tabs */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
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
            {activeTab === "classes" && (
              <DataTable
                data={classes}
                columns={classCols}
                searchPlaceholder="Rechercher une classe..."
                searchKeys={["name", "code", "level"]}
                pageSize={10}
                emptyMessage="Aucune classe"
              />
            )}
            {activeTab === "subjects" && (
              <DataTable
                data={subjects}
                columns={subjectCols}
                searchPlaceholder="Rechercher une matière..."
                searchKeys={["name", "code"]}
                pageSize={10}
                emptyMessage="Aucune matière"
              />
            )}
          </>
        )}

        {/* Class Create/Edit Modal */}
        {activeTab === "classes" && (
          <Modal
            isOpen={showCreate || showEdit}
            onClose={() => {
              setShowCreate(false);
              setShowEdit(false);
              setSelected(null);
              resetClassForm();
            }}
            title={showEdit ? "Modifier la classe" : "Nouvelle classe"}
            size="xl"
          >
            <div className="space-y-6">
              {/* Step indicator */}
              {!showEdit && (
                <div className="flex items-center justify-center space-x-4 pb-4 border-b">
                  <div
                    className={`flex items-center ${
                      classFormStep === "category"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        classFormStep === "category"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      1
                    </div>
                    <span className="ml-2 font-medium">Catégorie</span>
                  </div>
                  <div
                    className={`w-16 h-0.5 ${
                      classFormStep === "details" || classFormStep === "final"
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center ${
                      classFormStep === "details"
                        ? "text-blue-600"
                        : classFormStep === "final"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        classFormStep === "details"
                          ? "bg-blue-600 text-white"
                          : classFormStep === "final"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2 font-medium">Détails</span>
                  </div>
                  <div
                    className={`w-16 h-0.5 ${
                      classFormStep === "final" ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center ${
                      classFormStep === "final"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        classFormStep === "final"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      3
                    </div>
                    <span className="ml-2 font-medium">Validation</span>
                  </div>
                </div>
              )}

              {/* Step 1: Category Selection */}
              {!showEdit && classFormStep === "category" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Choisissez le type d'établissement
                    </h3>
                    <p className="text-sm text-slate-600">
                      Cette information déterminera les niveaux disponibles
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {classCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setClassForm({
                            ...classForm,
                            classCategoryId: category.id,
                          });
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          classForm.classCategoryId === category.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-center">
                          <h4 className="font-semibold text-slate-900">
                            {category.name}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            {category.description || "Catégorie de classe"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {!showEdit && classFormStep === "details" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Nom de la classe"
                      placeholder="Ex: 6ème A, 2nde S1..."
                      value={classForm.name}
                      onChange={(e) =>
                        setClassForm({ ...classForm, name: e.target.value })
                      }
                    />
                    <FormInput
                      label="Code de la classe"
                      placeholder="Ex: 6A, 2S1, L1..."
                      value={classForm.code}
                      onChange={(e) =>
                        setClassForm({ ...classForm, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Niveau
                      </label>
                      <select
                        value={classForm.level}
                        onChange={(e) =>
                          setClassForm({ ...classForm, level: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner un niveau</option>
                        <optgroup label="Lycée">
                          <option value="seconde">Seconde (11ème)</option>
                          <option value="premiere">Première (12ème)</option>
                          <option value="terminale">Terminale (13ème)</option>
                        </optgroup>
                        <optgroup label="Enseignement Supérieur">
                          <option value="bts">BTS</option>
                          <option value="dut">DUT</option>
                          <option value="licence1">Licence 1</option>
                          <option value="licence2">Licence 2</option>
                          <option value="licence3">Licence 3</option>
                          <option value="master1">Master 1</option>
                          <option value="master2">Master 2</option>
                        </optgroup>
                      </select>
                    </div>
                    <FormInput
                      label="Capacité maximale (optionnel)"
                      type="number"
                      placeholder="Nombre d'élèves"
                      value={
                        classForm.capacity ? classForm.capacity.toString() : ""
                      }
                      onChange={(e) =>
                        setClassForm({
                          ...classForm,
                          capacity: e.target.value
                            ? parseInt(e.target.value) || undefined
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <FormInput
                    label="Description (optionnel)"
                    placeholder="Ex: Classe de 6ème avec option anglais..."
                    value={classForm.description}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        description: e.target.value,
                      })
                    }
                  />
                  <FormInput
                    label="Niveau d'ordre"
                    type="number"
                    placeholder="Ex: 1, 2, 3..."
                    value={classForm.orderLevel.toString()}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        orderLevel: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Retour
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Final / Edit Form */}
              {((!showEdit && classFormStep === "final") || showEdit) && (
                <div className="space-y-4">
                  {!showEdit && (
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-slate-500">
                            Nom
                          </span>
                          <p className="text-lg font-semibold text-slate-900">
                            {classForm.name}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-500">
                            Code
                          </span>
                          <p className="text-lg font-semibold text-slate-900">
                            {classForm.code}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-500">
                            Niveau
                          </span>
                          <p className="text-lg font-semibold text-slate-900">
                            {getLevelLabel(classForm.level)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-500">
                            Capacité
                          </span>
                          <p className="text-lg font-semibold text-slate-900">
                            {classForm.capacity
                              ? `${classForm.capacity} élèves`
                              : "Non définie"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {showEdit && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput
                          label="Nom de la classe"
                          value={classForm.name}
                          onChange={(e) =>
                            setClassForm({ ...classForm, name: e.target.value })
                          }
                        />
                        <FormInput
                          label="Code de la classe"
                          value={classForm.code}
                          onChange={(e) =>
                            setClassForm({ ...classForm, code: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Niveau
                          </label>
                          <select
                            value={classForm.level}
                            onChange={(e) =>
                              setClassForm({
                                ...classForm,
                                level: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Sélectionner un niveau</option>
                            <optgroup label="Lycée">
                              <option value="seconde">Seconde (11ème)</option>
                              <option value="premiere">Première (12ème)</option>
                              <option value="terminale">
                                Terminale (13ème)
                              </option>
                            </optgroup>
                            <optgroup label="Enseignement Supérieur">
                              <option value="bts">BTS</option>
                              <option value="dut">DUT</option>
                              <option value="licence1">Licence 1</option>
                              <option value="licence2">Licence 2</option>
                              <option value="licence3">Licence 3</option>
                              <option value="master1">Master 1</option>
                              <option value="master2">Master 2</option>
                            </optgroup>
                          </select>
                        </div>
                        <FormInput
                          label="Capacité maximale (optionnel)"
                          type="number"
                          placeholder="Nombre d'élèves"
                          value={
                            classForm.capacity
                              ? classForm.capacity.toString()
                              : ""
                          }
                          onChange={(e) =>
                            setClassForm({
                              ...classForm,
                              capacity: e.target.value
                                ? parseInt(e.target.value) || undefined
                                : undefined,
                            })
                          }
                        />
                      </div>
                      <FormInput
                        label="Description (optionnel)"
                        value={classForm.description}
                        onChange={(e) =>
                          setClassForm({
                            ...classForm,
                            description: e.target.value,
                          })
                        }
                      />
                      <FormInput
                        label="Niveau d'ordre"
                        type="number"
                        value={classForm.orderLevel.toString()}
                        onChange={(e) =>
                          setClassForm({
                            ...classForm,
                            orderLevel: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </>
                  )}
                  <div className="flex justify-between pt-4">
                    {!showEdit && (
                      <button
                        onClick={prevStep}
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                      >
                        Retour
                      </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                      <button
                        onClick={() => {
                          setShowCreate(false);
                          setShowEdit(false);
                          setSelected(null);
                          resetClassForm();
                        }}
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={showEdit ? handleEditClass : handleCreateClass}
                        disabled={actionLoading || !canProceed()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading
                          ? "..."
                          : showEdit
                          ? "Enregistrer"
                          : "Créer la classe"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Subject Create/Edit Modal */}
        {activeTab === "subjects" && (
          <Modal
            isOpen={showCreate || showEdit}
            onClose={() => {
              setShowCreate(false);
              setShowEdit(false);
              setSelected(null);
              resetSubjectForm();
            }}
            title={showEdit ? "Modifier la matière" : "Nouvelle matière"}
            size="lg"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Nom de la matière"
                  placeholder="Ex: Mathématiques, Français..."
                  value={subjectForm.name}
                  onChange={(e) =>
                    setSubjectForm({ ...subjectForm, name: e.target.value })
                  }
                />
                <FormInput
                  label="Code de la matière"
                  placeholder="Ex: MATH, FRAN"
                  value={subjectForm.code}
                  onChange={(e) =>
                    setSubjectForm({
                      ...subjectForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setShowEdit(false);
                    setSelected(null);
                    resetSubjectForm();
                  }}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  onClick={showEdit ? handleEditSubject : handleCreateSubject}
                  disabled={
                    actionLoading || !subjectForm.name || !subjectForm.code
                  }
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading
                    ? "..."
                    : showEdit
                    ? "Enregistrer"
                    : "Créer la matière"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDelete}
          onClose={() => {
            setShowDelete(false);
            setSelected(null);
          }}
          onConfirm={
            activeTab === "classes" ? handleDeleteClass : handleDeleteSubject
          }
          title="Supprimer ?"
          message={`Voulez-vous vraiment supprimer ${
            activeTab === "classes"
              ? `la classe "${(selected as Class)?.name || ""}"`
              : `la matière "${(selected as Subject)?.name || ""}"`
          } ?`}
          type="danger"
          confirmText="Supprimer"
          loading={actionLoading}
        />
      </div>
    </AuthenticatedPage>
  );
};

export default ClassesSubjectsPage;
