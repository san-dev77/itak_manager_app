import React, { useState, useEffect } from "react";
import AuthenticatedPage from "../components/layout/AuthenticatedPage";
import PageHeader from "../components/ui/PageHeader";
import Breadcrumb from "../components/ui/Breadcrumb";
import {
  CheckCircle,
  Clock,
  BookOpen,
  Download,
  BarChart3,
} from "lucide-react";
import Button from "../components/ui/Button";
import { apiService } from "../services/api";

const QualityPage: React.FC = () => {
  const [, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSubjects: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalTeachingAssignments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [
        classesRes,
        subjectsRes,
        teachersRes,
        studentsRes,
        assignmentsRes,
      ] = await Promise.all([
        apiService.getAllClasses(),
        apiService.getAllSubjects(),
        apiService.getAllTeachers(),
        apiService.getAllStudents(),
        apiService.getAllTeachingAssignments(),
      ]);

      setStats({
        totalClasses: classesRes.success ? classesRes.data?.length || 0 : 0,
        totalSubjects: subjectsRes.success ? subjectsRes.data?.length || 0 : 0,
        totalTeachers: teachersRes.success ? teachersRes.data?.length || 0 : 0,
        totalStudents: studentsRes.success ? studentsRes.data?.length || 0 : 0,
        totalTeachingAssignments: assignmentsRes.success
          ? assignmentsRes.data?.length || 0
          : 0,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // TODO: Implémenter l'export de données
    alert("Fonctionnalité d'export à implémenter");
  };

  return (
    <AuthenticatedPage>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Assurance Qualité" },
          ]}
        />
        <PageHeader
          title="Assurance Qualité & RP"
          subtitle="Suivi qualité, volumes horaires, modules"
          icon={CheckCircle}
          iconColor="from-amber-600 to-orange-600"
        />

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalClasses}
            </div>
            <div className="text-sm text-gray-600">Classes</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalSubjects}
            </div>
            <div className="text-sm text-gray-600">Matières</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalTeachers}
            </div>
            <div className="text-sm text-gray-600">Enseignants</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalStudents}
            </div>
            <div className="text-sm text-gray-600">Étudiants</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalTeachingAssignments}
            </div>
            <div className="text-sm text-gray-600">Affectations</div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter les données
            </Button>
            <Button
              onClick={() => (window.location.href = "/classes-subjects")}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Voir les classes
            </Button>
            <Button
              onClick={() => (window.location.href = "/calendar")}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Calendrier
            </Button>
          </div>
        </div>

        {/* Informations */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">ℹ</span>
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Module Assurance Qualité
              </h3>
              <p className="text-amber-800 text-sm">
                Cette page permet de suivre la qualité de l'enseignement, les
                volumes horaires, et les modules. Les fonctionnalités complètes
                seront ajoutées progressivement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  );
};

export default QualityPage;
