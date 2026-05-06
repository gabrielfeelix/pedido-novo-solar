import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

export function GlobalErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage = "Ocorreu um erro inesperado.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight">
          Oops!
        </h1>
        
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">
            Desculpe, encontramos um problema ao carregar esta página.
          </p>
          <div className="bg-muted/50 p-4 rounded-md border border-border mt-4 text-left font-mono text-sm overflow-auto">
            <p className="text-destructive/80 font-semibold mb-1">Detalhes do Erro:</p>
            <p className="text-muted-foreground break-all">{errorMessage}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button 
            variant="default" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Tentar Novamente
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
