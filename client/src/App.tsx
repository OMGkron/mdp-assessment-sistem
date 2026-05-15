import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import AssessmentForm from "./pages/AssessmentForm";
import ParticipantResults from "./pages/ParticipantResults";
import ChatbotPage from "./pages/ChatbotPage";
import PesertaPage from "./pages/PesertaPage";
import LaporanPage from "./pages/LaporanPage";
import DashboardLayout from "./components/DashboardLayout";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/peserta" component={PesertaPage} />
        <Route path="/laporan" component={LaporanPage} />
        <Route path="/penilaian/:participantId/:type" component={AssessmentForm} />
        <Route path="/hasil/:participantId" component={ParticipantResults} />
        <Route path="/asisten" component={ChatbotPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
