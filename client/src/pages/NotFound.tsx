import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4 shadow-xl border border-border bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse" />
              <AlertCircle className="relative h-20 w-20 text-destructive" />
            </div>
          </div>

          <h1 className="text-5xl font-display font-bold text-foreground mb-4 tracking-tighter">Błąd 404</h1>

          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ten budynek jeszcze nie powstał!
          </h2>

          <p className="text-muted-foreground mb-10 leading-relaxed text-lg font-light">
            Przepraszamy, ale strona której szukasz nie istnieje.
            <br />
            Może została przeniesiona lub adres jest niepoprawny.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 rounded-xl transition-all duration-300 shadow-lg font-bold text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Wróć do Strony Głównej
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
