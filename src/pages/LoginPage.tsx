import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/api/fnb-api";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useOrder } from "@/contexts/order-context";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { setStoreCode } = useOrder();

  useEffect(() => {
    if (auth.isReady && auth.isLoggedIn()) {
      navigate("/");
    }
  }, [auth, navigate]);

  const [phoneNumOrEmail, setPhoneNumOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => login(phoneNumOrEmail, password),
    onSuccess: (data) => {
      auth.setTokenAndMyInfo(data.token, data.user);
      if(data.user.staffOfStoreCode) {
        setStoreCode(data.user.staffOfStoreCode);
      }
      navigate("/");
    },
    onError: () => {
      setErrorText(
        "The email/phone or password you entered is incorrect."
      );
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <Card className="max-w-[450px] w-full shadow-lg border-2">
        <CardHeader className="space-y-6 pb-8 pt-10">
          <div className="flex flex-col items-center gap-4">
            <Link to={"/"}>
              <img src="/icon.png" alt="logo" className="w-16 h-16" />
            </Link>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome Back
              </h1>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setErrorText("");
              loginMutation.mutate();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  onChange={(e) => {
                    setPhoneNumOrEmail(e.target.value);
                    setErrorText("");
                  }}
                  value={phoneNumOrEmail}
                  type="text"
                  placeholder="Enter email or phone number"
                  className="pl-10 h-11"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorText("");
                  }}
                  value={password}
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 h-11"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            {errorText && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorText}</span>
              </div>
            )}

            <Button
              type="submit"
              className="mt-10 w-full h-11 text-base font-semibold rounded-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
