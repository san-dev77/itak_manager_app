import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ClassesSubjectsPage from "./pages/ClassesSubjectsPage";
import FinancesPage from "./pages/FinancesPage";
import "./App.css";
import {
  SettingsPage,
  StudentClassAssignmentPage,
  SubjectClassAssignmentPage,
  TeacherClassAssignmentPage,
  TeacherSubjectAssignmentPage,
} from "./pages/settings";

function App() {
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user as string);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage user={userData} />} />
        <Route path="/classes-subjects" element={<ClassesSubjectsPage />} />
        <Route path="/finances" element={<FinancesPage />} />

        {/* Routes de configuration */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/settings/student-class-assignment"
          element={<StudentClassAssignmentPage />}
        />
        <Route
          path="/settings/subject-class-assignment"
          element={<SubjectClassAssignmentPage />}
        />
        <Route
          path="/settings/teacher-subject-assignment"
          element={<TeacherSubjectAssignmentPage />}
        />
        <Route
          path="/settings/teacher-class-assignment"
          element={<TeacherClassAssignmentPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
