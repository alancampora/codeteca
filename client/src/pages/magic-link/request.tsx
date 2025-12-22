import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requestMagicLink } from "@/api/magicLink";
import Layout from "@/components/Layout";

export default function MagicLinkRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isDev, setIsDev] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await requestMagicLink(email);
      setSuccess(true);
      setIsDev(result.dev || false);
    } catch (err: any) {
      setError(err.message || "Error sending magic link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🎄 Enlace Mágico</CardTitle>
              <CardDescription>
                Ingresa tu email y te enviaremos un enlace para iniciar sesión
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200">
                    <p className="font-semibold mb-2">✅ ¡Enlace enviado!</p>
                    <p className="text-sm">
                      Revisa tu email y haz clic en el enlace para iniciar sesión.
                      El enlace expira en 15 minutos.
                    </p>
                  </div>

                  {isDev && (
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
                      <p className="font-semibold mb-2">⚠️ Modo Desarrollo</p>
                      <p className="text-sm">
                        El email no se envió. Revisa la consola del servidor para ver el enlace mágico.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Enviar otro enlace
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Enlace Mágico"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Volver al inicio de sesión tradicional
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
