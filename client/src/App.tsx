import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Index from "@/pages/Index";
import Create from "@/pages/Create";
import Receiver from "@/pages/Receiver";
import { Nav } from "@/components/ui-elements";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      
      <Route path="/create">
        <Nav />
        <Create />
      </Route>

      <Route path="/r/:id" component={Receiver} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
