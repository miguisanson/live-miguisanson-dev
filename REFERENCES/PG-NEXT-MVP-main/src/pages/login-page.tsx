import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn } from "lucide-react";
import { mockUsers, DEMO_PASSWORD } from "../data/mock-users";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { HelpTip } from "../components/help/help-tip";

export function LoginPage(): React.ReactElement {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackPath = (location.state as { from?: string } | undefined)?.from;

  const [email, setEmail] = React.useState<string>("operations.manager@consumeriq.local");
  const [password, setPassword] = React.useState<string>(DEMO_PASSWORD);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const matched = mockUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
    navigate(fallbackPath ?? matched?.defaultRoute ?? "/overview", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f5fbff] p-4">
      <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border-[#003DA533] bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">Consumer IQ</CardTitle>
            <CardDescription className="text-slate-600">
              Consumer Intelligence Operations and Insight Reliability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-[#003DA533] bg-[#eaf7ff] p-4">
              <p className="text-sm font-semibold text-slate-900">Local demo sign-in</p>
              <p className="mt-1 text-sm text-slate-700">
                This is a simulated front-end-only login. Session persists in localStorage.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Demo Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {error ? <p className="text-sm text-[#7a6700]">{error}</p> : null}
              <Button className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-xs text-slate-500">
              Demo credential for all users: <span className="font-mono">{DEMO_PASSWORD}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Quick Sign-In
              <HelpTip
                title="Quick sign-in cards"
                content="Use these cards to immediately enter the prototype as a specific role. This helps during live demo walkthroughs."
              />
            </CardTitle>
            <CardDescription>Choose a seeded role profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={async () => {
                  const result = await quickLogin(user.email);
                  if (result.ok) {
                    navigate(user.defaultRoute, { replace: true });
                  } else {
                    setError(result.error);
                  }
                }}
                className="w-full rounded-md border border-slate-200 bg-white p-3 text-left transition hover:border-[#003DA566] hover:bg-[#f5fbff]"
              >
                <p className="text-sm font-semibold text-slate-900">{user.role}</p>
                <p className="text-xs text-slate-600">{user.email}</p>
              </button>
            ))}

            <div className="mt-2 rounded-md border border-[#F59E0B99] bg-[#fff9d6] p-3 text-xs text-slate-700">
              <div className="mb-1 flex items-center gap-1 font-semibold">
                <LockKeyhole className="h-3.5 w-3.5" />
                Simulated authentication note
              </div>
              Login/logout is local only. No external auth provider or backend session.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
