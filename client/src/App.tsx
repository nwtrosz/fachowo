import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Portfolio from "./pages/Portfolio";
import ProjectDetails from "./pages/ProjectDetails";
import * as Legal from "./pages/Legal";
import * as Services from "./pages/services/AllServices";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/portfolio/:id"} component={ProjectDetails} />
      <Route path={"/polityka-prywatnosci"} component={Legal.PrivacyPolicy} />
      <Route path={"/warunki-uslugi"} component={Legal.TermsOfService} />
      
      {/* Building Services */}
      <Route path={"/usluga/kompleksowe-wykonczenie"} component={Services.KompleksoweWykonczenie} />
      <Route path={"/usluga/malowanie"} component={Services.Malowanie} />
      <Route path={"/usluga/gladzenie-scian"} component={Services.GladzeniScian} />
      <Route path={"/usluga/tynkowanie"} component={Services.Tynkowanie} />
      <Route path={"/usluga/kladanie-paneli"} component={Services.KladaniePaneli} />
      <Route path={"/usluga/instalacje-elektryczne"} component={Services.InstalacjeElektryczne} />
      <Route path={"/usluga/kladanie-plytek"} component={Services.KladaniePlytek} />
      <Route path={"/usluga/posadzki"} component={Services.Posadzki} />
      <Route path={"/usluga/wyburzenia-rozbiorki"} component={Services.WyburzeniRozbiorki} />
      <Route path={"/usluga/drapanie-scian"} component={Services.DrapamieScian} />
      <Route path={"/usluga/kucie-plytek"} component={Services.KuciePlytek} />
      <Route path={"/usluga/skuwanie-posadzek"} component={Services.SkuwaniePosadzek} />
      <Route path={"/usluga/szlifowanie-betonu"} component={Services.SzlifowanieBetonu} />
      <Route path={"/usluga/kucie-tynkow"} component={Services.KucieTynkow} />
      <Route path={"/usluga/wnoszenie-materialow"} component={Services.WnoszenieMateriaw} />
      <Route path={"/usluga/wynoszenie-gruzu"} component={Services.WynoszamieGruzu} />
      <Route path={"/usluga/sprzatanie-po-budowie"} component={Services.SprzataniePoBudowie} />
      
      {/* Transport Services */}
      <Route path={"/usluga/przeprowadzki-transport"} component={Services.Przeprowadzki} />
      <Route path={"/usluga/oprozniam-mieszkania"} component={Services.Oprozniam} />
      <Route path={"/usluga/utylizacja-odpadow"} component={Services.Utylizacja} />
      <Route path={"/usluga/sprzatanie-po-najmie"} component={Services.SprzataniePojmie} />
      <Route path={"/usluga/transport-materialow"} component={Services.TransportMaterialow} />
      
      {/* Contact Page */}
      <Route path={"/kontakt"} component={Contact} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
