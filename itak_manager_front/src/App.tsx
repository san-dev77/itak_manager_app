import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InstitutionProvider } from "./contexts/InstitutionContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorHandler from "./components/error/ErrorHandler";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import StudentsPage from "./pages/StudentsPage";
import ClassesSubjectsPage from "./pages/ClassesSubjectsPage";
import FinancesPage from "./pages/FinancesPage";
import FinanceOverviewPage from "./pages/finance/FinanceOverviewPage";
import FeeTypesPage from "./pages/finance/FeeTypesPage";
import StudentFeesPage from "./pages/finance/StudentFeesPage";
import StudentFeeAssignmentPage from "./pages/finance/StudentFeeAssignmentPage";
import PaymentsPage from "./pages/finance/PaymentsPage";
import PaymentAssignmentPage from "./pages/finance/PaymentAssignmentPage";
import InvoicesPage from "./pages/finance/InvoicesPage";
import CalendarPage from "./pages/CalendarPage";
import TimetablePage from "./pages/calendar/TimetablePage";
import EventsPage from "./pages/calendar/EventsPage";
import SchoolYearsPage from "./pages/SchoolYearsPage";
import QualityPage from "./pages/QualityPage";
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
    <ErrorHandler>
      <AuthProvider>
        <InstitutionProvider>
          <Router>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Routes protégées - Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredMenu="dashboard">
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Utilisateurs (comptes) */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredMenu="users">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Étudiants/Enseignants/Personnel */}
              <Route
                path="/students"
                element={
                  <ProtectedRoute requiredMenu="students">
                    <StudentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Classes & Matières */}
              <Route
                path="/classes-subjects"
                element={
                  <ProtectedRoute requiredMenu="classes">
                    <ClassesSubjectsPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Finances */}
              <Route
                path="/finances"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <FinancesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances/overview"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <FinanceOverviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances/fee-types"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <FeeTypesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances/student-fees"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <StudentFeesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances/student-fee-assignment"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <StudentFeeAssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances/payments"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <PaymentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances/payments/assign"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <PaymentAssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finances/invoices"
                element={
                  <ProtectedRoute requiredMenu="finances">
                    <InvoicesPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Assurance Qualité */}
              <Route
                path="/qualite"
                element={
                  <ProtectedRoute requiredMenu="qualite">
                    <QualityPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Calendrier */}
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute requiredMenu="calendar">
                    <CalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar/timetables"
                element={
                  <ProtectedRoute requiredMenu="calendar">
                    <TimetablePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar/events"
                element={
                  <ProtectedRoute requiredMenu="calendar">
                    <EventsPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Années scolaires */}
              <Route
                path="/school-years"
                element={
                  <ProtectedRoute requiredMenu="school-years">
                    <SchoolYearsPage />
                  </ProtectedRoute>
                }
              />

              {/* Routes protégées - Configuration/Affectations */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute requiredMenu="settings">
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/student-class-assignment"
                element={
                  <ProtectedRoute requiredMenu="settings">
                    <StudentClassAssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/subject-class-assignment"
                element={
                  <ProtectedRoute requiredMenu="settings">
                    <SubjectClassAssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/teacher-subject-assignment"
                element={
                  <ProtectedRoute requiredMenu="settings">
                    <TeacherSubjectAssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/teacher-class-assignment"
                element={
                  <ProtectedRoute requiredMenu="settings">
                    <TeacherClassAssignmentPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </InstitutionProvider>
      </AuthProvider>
    </ErrorHandler>
  );
}

export default App;
