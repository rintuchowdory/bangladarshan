/* Design philosophy: River of Thought — the shell stays quiet and editorial so the listening journey, book art, and river-vermilion actions remain the visual anchors. */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import NotFound from "./pages/NotFound";
function Router() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter base={basePath}>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/book/:bookId"} component={BookDetail} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
