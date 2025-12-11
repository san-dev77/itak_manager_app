import React from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedPage from "../../components/layout/AuthenticatedPage";
import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";
import {
  Settings,
  ArrowRight,
  Users,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const assignments = [
    {
      id: "subject-class",
      title: "Matières → Classes",
      description:
        "Affecter des matières aux classes avec coefficients et heures",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      path: "/settings/subject-class-assignment",
    },
    {
      id: "student-class",
      title: "Élèves → Classes",
      description:
        "Inscrire des élèves dans des classes avec dates d'inscription",
      icon: Users,
      color: "from-green-500 to-green-600",
      path: "/settings/student-class-assignment",
    },
    {
      id: "teacher-subject",
      title: "Enseignants → Matières-Classes",
      description: "Affecter des enseignants aux matières dans les classes",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      path: "/settings/teacher-subject-assignment",
    },
  ];

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Paramètres", path: "/settings" },
            { label: "Affectations" },
          ]}
        />
        <PageHeader
          title="Affectations"
          subtitle="Gérer les affectations entre élèves, classes, matières et enseignants"
          icon={Settings}
          iconColor="from-blue-600 to-indigo-600"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              onClick={() => navigate(assignment.path)}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${assignment.color} rounded-lg flex items-center justify-center shadow-md`}
                >
                  <assignment.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600">{assignment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedPage>
  );
};

export default SettingsPage;
