import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/fnb-api";
import { User, Mail, Phone, Lock, AlertCircle, UserPlus } from "lucide-react";

export default function SignupPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isReady && auth.isLoggedIn()) {
            navigate("/");
        }
    }, [auth, navigate]);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorText, setErrorText] = useState("");

    const registerMutation = useMutation({
        mutationFn: () =>
            registerUser({
                phoneNum,
                email,
                password,
                firstName,
                lastName,
            }),
        onSuccess: (data) => {
            auth.setTokenAndMyInfo(data.token, data.user);
            alert("Your account has been created!");
            navigate("/");
        },
        onError: () => {
            setErrorText("Unable to create account. Please try again.");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !firstName ||
            !lastName ||
            !phoneNum ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setErrorText("Please fill out all fields to continue.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorText("Password and confirm password must match.");
            return;
        }
        setErrorText("");
        registerMutation.mutate();
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
            <Card className="max-w-[500px] w-full shadow-lg border-2">
                <CardHeader className="space-y-6 pb-8 pt-10">
                    <div className="flex flex-col items-center gap-4">
                    <Link to={"/"}>
              <img src="/icon.png" alt="logo" className="w-16 h-16" />
            </Link>
                        <div className="text-center space-y-2">
                          
                            <h1 className="text-2xl font-bold tracking-tight">
                                Create Account
                            </h1>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="firstName"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        setErrorText("");
                                    }}
                                    placeholder="Jane"
                                    className="pl-10 h-11"
                                    disabled={registerMutation.isPending}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="lastName"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        setErrorText("");
                                    }}
                                    placeholder="Doe"
                                    className="pl-10 h-11"
                                    disabled={registerMutation.isPending}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="phone"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={phoneNum}
                                    onChange={(e) => {
                                        setPhoneNum(e.target.value);
                                        setErrorText("");
                                    }}
                                    placeholder="+84 123 456 789"
                                    className="pl-10 h-11"
                                    disabled={registerMutation.isPending}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrorText("");
                                    }}
                                    placeholder="jane@example.com"
                                    className="pl-10 h-11"
                                    disabled={registerMutation.isPending}
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
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorText("");
                                    }}
                                    placeholder="Create a secure password"
                                    className="pl-10 h-11"
                                    disabled={registerMutation.isPending}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrorText("");
                                    }}
                                    placeholder="Re-enter your password"
                                    className="pl-10 h-11"
                                    disabled={registerMutation.isPending}
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
                            className="mt-8 w-full h-11 text-base font-semibold rounded-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Sign up
                                </span>
                            )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-primary hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
