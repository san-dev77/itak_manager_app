import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ClassesSubjectsPage from "./pages/ClassesSubjectsPage";
import FinancesPage from "./pages/FinancesPage";
import FinanceOverviewPage from "./pages/finance/FinanceOverviewPage";
import FeeTypesPage from "./pages/finance/FeeTypesPage";
import PaymentsPage from "./pages/finance/PaymentsPage";
import InvoicesPage from "./pages/finance/InvoicesPage";
import CalendarPage from "./pages/CalendarPage";
import TimetablePage from "./pages/calendar/TimetablePage";
import EventsPage from "./pages/calendar/EventsPage";
import SchoolYearsPage from "./pages/SchoolYearsPage";
import "./App.css";
import {
  SettingsPage,
  StudentClassAssignmentPage,
  SubjectClassAssignmentPage,
  TeacherClassAssignmentPage,
  TeacherSubjectAssignmentPage,
} from "./pages/settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/classes-subjects" element={<ClassesSubjectsPage />} />
        <Route path="/finances" element={<FinancesPage />} />

        {/* Routes financières */}
        <Route path="/finances/overview" element={<FinanceOverviewPage />} />
        <Route path="/finances/fee-types" element={<FeeTypesPage />} />
        <Route path="/finances/payments" element={<PaymentsPage />} />
        <Route path="/finances/invoices" element={<InvoicesPage />} />

        {/* Routes du calendrier */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/timetables" element={<TimetablePage />} />
        <Route path="/calendar/events" element={<EventsPage />} />

        {/* Routes des années scolaires */}
        <Route path="/school-years" element={<SchoolYearsPage />} />

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
