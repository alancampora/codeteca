import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyMagicLink } from "@/api/magicLink";
import { useAuth } from "@/context/auth";
import Layout from "@/components/Layout";

export default function MagicLinkVerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setError("No se proporcionó un token válido");
      return;
    }

    const verify = async () => {
      try {
        await verifyMagicLink(token);
        await refetchUser(); // Refresh the user context
        setStatus("success");

        // Redirect to movies page after 2 seconds
        setTimeout(() => {
          navigate("/movies");
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setError(err.message || "Error verificando el enlace mágico");
      }
    };

    verify();
  }, [searchParams, navigate, refetchUser]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {status === "loading" && "Verificando..."}
                {status === "success" && "✅ ¡Inicio de sesión exitoso!"}
                {status === "error" && "❌ Error"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {status === "loading" && (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-gray-600">Verificando tu enlace mágico...</p>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <div className="text-6xl mb-4">🎄</div>
                  <p className="text-lg text-gray-700">
                    Has iniciado sesión correctamente.
                  </p>
                  <p className="text-sm text-gray-500">
                    Serás redirigido en un momento...
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-4">
                  <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
                    <p className="font-semibold mb-2">Error al verificar el enlace</p>
                    <p className="text-sm">{error}</p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate("/magic-link/request")}
                      className="w-full"
                    >
                      Solicitar nuevo enlace
                    </Button>
                    <Button
                      onClick={() => navigate("/login")}
                      variant="outline"
                      className="w-full"
                    >
                      Volver al inicio de sesión
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
