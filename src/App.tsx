import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import DashboardPage from './features/Dashboard/DashboardPage';
import SubjectsPage from './features/Subjects/SubjectsPage';
import StudentsPage from './features/Students/StudentsPage';
import GradesPage from './features/Grades/GradesPage';
import AbsencesPage from './features/Absences/AbsencesPage';
import ReportsPage from './features/Reports/ReportsPage';
import SettingsPage from './features/Settings/SettingsPage';
import { useStore } from './lib/store';

function App() {
  const init = useStore(state => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/absences" element={<AbsencesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
