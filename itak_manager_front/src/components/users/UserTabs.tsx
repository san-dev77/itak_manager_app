import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Building,
  UserCheck,
  UserPlus,
} from "lucide-react";

interface UserTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userCounts: {
    all: number;
    students: number;
    teachers: number;
    staff: number;
  };
  onAssignProfile?: (profileType: "student" | "teacher" | "staff") => void;
}

const UserTabs = ({
  activeTab,
  onTabChange,
  userCounts,
  onAssignProfile,
}: UserTabsProps) => {
  const tabs = [
    {
      id: "all",
      label: "Tous les utilisateurs",
      icon: <Users className="w-4 h-4" />,
      count: userCounts.all,
      color: "blue",
    },
    {
      id: "student",
      label: "Élèves",
      icon: <GraduationCap className="w-4 h-4" />,
      count: userCounts.students,
      color: "green",
    },
    {
      id: "teacher",
      label: "Enseignants",
      icon: <UserCheck className="w-4 h-4" />,
      count: userCounts.teachers,
      color: "purple",
    },
    {
      id: "staff",
      label: "Personnels",
      icon: <Building className="w-4 h-4" />,
      count: userCounts.staff,
      color: "orange",
    },
  ];

  const getTabColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive
        ? "bg-blue-600 text-white"
        : "text-blue-600 hover:bg-blue-50",
      green: isActive
        ? "bg-green-600 text-white"
        : "text-green-600 hover:bg-green-50",
      purple: isActive
        ? "bg-purple-600 text-white"
        : "text-purple-600 hover:bg-purple-50",
      orange: isActive
        ? "bg-orange-600 text-white"
        : "text-orange-600 hover:bg-orange-50",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-blue-100 p-2"
    >
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <div key={tab.id} className="flex-1 flex flex-col">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${getTabColor(
                tab.color,
                activeTab === tab.id
              )}`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span
                className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${getBadgeColor(
                  tab.color
                )}`}
              >
                {tab.count}
              </span>
            </button>

            {/* Bouton d'assignation de profil pour les tabs spécifiques */}
            {tab.id !== "all" && onAssignProfile && (
              <button
                onClick={() =>
                  onAssignProfile(tab.id as "student" | "teacher" | "staff")
                }
                className="mt-2 p-2 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                title={`Assigner un profil ${tab.label.toLowerCase()}`}
              >
                <UserPlus className="w-3 h-3" />
                <span className="hidden sm:inline">Assigner</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserTabs;
