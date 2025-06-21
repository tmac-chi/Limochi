import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import IdeaGeneration from "@/pages/idea-generation";
import Challenge from "@/pages/challenge";
import Gallery from "@/pages/gallery";
import NotFound from "@/pages/not-found";

const apiKey = import.meta.env.VITE_UNSPLASH_KEY;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/idea-generation" component={IdeaGeneration} />
        <Route path="/challenge" component={Challenge} />
        <Route path="/gallery" component={Gallery} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;