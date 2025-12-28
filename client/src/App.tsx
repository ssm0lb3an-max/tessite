import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Divisions from "@/pages/Divisions";
import Careers from "@/pages/Careers";
import Personnel from "@/pages/Personnel";
import FAQ from "@/pages/FAQ";
import Gallery from "@/pages/Gallery";
import Login from "@/pages/Login";
import AdminKeys from "@/pages/AdminKeys";
import PhotoSections from "@/pages/PhotoSections";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/divisions" component={Divisions} />
      <Route path="/careers" component={Careers} />
      <Route path="/personnel" component={Personnel} />
      <Route path="/faq" component={FAQ} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/login" component={Login} />
      <Route path="/admin/keys" component={AdminKeys} />
      <Route path="/admin/photos" component={PhotoSections} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
