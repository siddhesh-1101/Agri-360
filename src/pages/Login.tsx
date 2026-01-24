import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

type LoginResp = {
  success: boolean;
  data: {
    token: string;
    user: any;
    profile: any;
  };
};

export default function Login() {
  const [params] = useSearchParams();
  const roleHint = params.get("role") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await apiFetch<LoginResp>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuth({ token: resp.data.token, user: resp.data.user });
      navigate(`/${resp.data.user.role}`);
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login {roleHint ? `(${roleHint})` : ""}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="underline" to={`/signup${roleHint ? `?role=${roleHint}` : ""}`}>
              Sign up
            </Link>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Demo accounts (seeded): farmer1@agri360.com / password123, retailer1@agri360.com / password123,
            agent1@agri360.com / password123
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

