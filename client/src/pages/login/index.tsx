import { useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router";
import { fetchAuth } from "@/api/auth";
import { IUser } from "@common/User";
import { useAuth } from "@/context/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { refetchUser } = useAuth();

  const handleSuccessGoogle =
    (navigate: any) => async (credentials: CredentialResponse) => {
      await fetchAuth({
        data: credentials,
        endpoint: "login/google",
        successCallback: async () => {
          const test = await refetchUser();
          navigate("/home");
        },
        errorCallback: (err: string) => setError(err),
      });
    };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both username and password.");
      return;
    }

    await fetchAuth({
      data: { email, password },
      endpoint: "login/common",
      successCallback: async () => {
        await refetchUser();
        navigate("/home");
      },
      errorCallback: (err: string) => setError(err),
    });
  };

  return (
    <main className="flex flex-col sm:flex-row space-x-10 bg-gray-100">
      <div className="p-4 grow">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                to={{ pathname: "/signup" }}
                className="text-blue-500 hover:underline"
              >
                Click here to create your user
              </Link>
            </p>
            <div className="w-full border-t pt-3">
              <p className="text-sm text-center">
                <Link
                  to="/magic-link/request"
                  className="text-red-600 hover:underline font-semibold"
                >
                  🎄 Iniciar sesión con enlace mágico
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-gray-200 grow p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Or Login with Google
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <GoogleLogin onSuccess={handleSuccessGoogle(navigate)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
