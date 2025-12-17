import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import { ModelStorageProvider } from "./contexts/ModelStorageContext";
import { ColorThemeInitializer } from "./components/ColorThemeInitializer";
import { ScrollToTop } from "./components/ScrollToTop";
import { AppLayoutWithKPI } from "./components/layout/AppLayoutWithKPI";
import { CalcProvider } from "./contexts/CalcContext";
import { SplashScreen } from "./components/SplashScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ConnectionStatus } from "./components/ConnectionStatus";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import StrategyPlanningPage from "./pages/StrategyPlanningPage";
import DashboardPage from "./pages/DashboardPage";
import InitiativesPage from "./pages/InitiativesPage";
import InitiativeImpactsPage from "./pages/InitiativeImpactsPage";
import DecisionBU2Page from "./pages/DecisionBU2Page";
import DecisionCorporatePage from "./pages/DecisionCorporatePage";
import DecisionBU1Page from "./pages/DecisionBU1Page";
import EventsPage from "./pages/EventsPage";
import EventsConditional from "./pages/EventsConditional";
import EventOutcomesPage from "./pages/EventOutcomesPage";


import DebriefGenNPIsDrivers from "./pages/DebriefGenNPIsDrivers";
import DebriefSpecNPIsDrivers from "./pages/DebriefSpecNPIsDrivers";
import DebriefRetPharmVolDrivers from "./pages/DebriefRetPharmVolDrivers";
import DebriefSpecPharmVolDrivers from "./pages/DebriefSpecPharmVolDrivers";
import DebriefPBNwkHealthPage from "./pages/DebriefPBNwkHealthPage";
import DebriefMBNwkHealthPage from "./pages/DebriefMBNwkHealthPage";
// import DebriefPBRevPTransPage from "./pages/DebriefPBRevPTransPage"; // Preserved for reference
import DebriefPharmaNPSDriversPage from "./pages/DebriefPharmaNPSDriversPage";
import DebriefPBRevenuePage from "./pages/DebriefPBRevenuePage";
import DebriefMBRevenuePage from "./pages/DebriefMBRevenuePage";
import FinancialStatementPage from "./pages/FinancialStatementPage";
import RoundCompletedPage from "./pages/RoundCompletedPage";
import CalcTestPage from "./pages/CalcTestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CalcProvider>
        <ModelStorageProvider>
          <ColorThemeInitializer />
          <Toaster />
          <Sonner />
          <HashRouter>
            <ScrollToTop />
            <ConnectionStatus />
            <Routes>
              <Route path="/loading" element={<SplashScreen />} />
              <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/" element={<Landing />} />
                <Route path="/team-entry" element={<Index />} />
                <Route path="/strategy-planning" element={<StrategyPlanningPage />} />
                <Route path="/dashboard" element={
                  <AppLayoutWithKPI>
                    <DashboardPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/initiatives" element={
                  <AppLayoutWithKPI>
                    <InitiativesPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/initiative-impacts" element={
                  <AppLayoutWithKPI>
                    <InitiativeImpactsPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/bu2" element={
                  <AppLayoutWithKPI>
                    <DecisionBU2Page />
                  </AppLayoutWithKPI>
                } />
                <Route path="/corporate" element={
                  <AppLayoutWithKPI>
                    <DecisionCorporatePage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/bu1" element={
                  <AppLayoutWithKPI>
                    <DecisionBU1Page />
                  </AppLayoutWithKPI>
                } />
                <Route path="/events/:round/:eventNumber" element={
                  <AppLayoutWithKPI>
                    <EventsConditional />
                  </AppLayoutWithKPI>
                } />
                <Route path="/event-outcomes/:round/:eventNumber" element={
                  <AppLayoutWithKPI>
                    <EventOutcomesPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-pbnh" element={
                  <AppLayoutWithKPI>
                    <DebriefPBNwkHealthPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-mbnh" element={
                  <AppLayoutWithKPI>
                    <DebriefMBNwkHealthPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-gennpis" element={
                  <AppLayoutWithKPI>
                    <DebriefGenNPIsDrivers />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-specnpis" element={
                  <AppLayoutWithKPI>
                    <DebriefSpecNPIsDrivers />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-retpharmvol" element={
                  <AppLayoutWithKPI>
                    <DebriefRetPharmVolDrivers />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-specpharmvol" element={
                  <AppLayoutWithKPI>
                    <DebriefSpecPharmVolDrivers />
                  </AppLayoutWithKPI>
                } />
                {/* Revenue Per Transaction page - Commented out as this info is now integrated into Pharma NPS page */}
                {/* <Route path="/debrief-pbrevptrans" element={
                  <AppLayoutWithKPI>
                    <DebriefPBRevPTransPage />
                  </AppLayoutWithKPI>
                } /> */}
                <Route path="/debrief-pharmanps" element={
                  <AppLayoutWithKPI>
                    <DebriefPharmaNPSDriversPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-pbrevenue" element={
                  <AppLayoutWithKPI>
                    <DebriefPBRevenuePage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/debrief-mbrevenue" element={
                  <AppLayoutWithKPI>
                    <DebriefMBRevenuePage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/financial-statement" element={
                  <AppLayoutWithKPI>
                    <FinancialStatementPage />
                  </AppLayoutWithKPI>
                } />
                <Route path="/round-completed" element={<RoundCompletedPage />} />
                <Route path="/calc-test" element={<CalcTestPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </ModelStorageProvider>
      </CalcProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
