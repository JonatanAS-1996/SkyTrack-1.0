import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, User } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<User["role"] | "">("");
  const [error, setError] = useState("");
  const { register, registerWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  // Registro normal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select your role");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(email, password, name, role);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  // Registro con Google
  const handleGoogleSignup = async () => {
    setError("");

    if (!role) {
      setError("Please select your role before continuing with Google");
      return;
    }

    try {
      await registerWithGoogle(role); // Pasamos el rol elegido
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-slate-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <motion.div
          className="mx-auto h-20 w-20 rounded-3xl bg-white/40 dark:bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-8 overflow-hidden border border-white/40"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 12 }}
        >
          <img src="/favicon.ico" alt="App Logo" className="h-12 w-12 object-contain" />
        </motion.div>

        <Card className="border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl bg-white/60 dark:bg-zinc-900/70 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Join SkyTrack to stay organized ✨
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Appleseed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 rounded-2xl bg-white/60 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/40"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 rounded-2xl bg-white/60 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/40"
                    required
                  />
                </div>
              </div>

              {/* Rol */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-zinc-400 z-10 pointer-events-none" />
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as User["role"])}
                  >
                    <SelectTrigger className="pl-11 rounded-2xl bg-white/60 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/40">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl shadow-xl">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="tutor">Tutor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 rounded-2xl bg-white/60 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/40"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 rounded-2xl bg-white/60 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/40"
                    required
                  />
                </div>
              </div>

              {/* Botón registro */}
              <Button
                type="submit"
                className="w-full rounded-full py-6 text-base font-medium shadow-md transition-all hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 dark:bg-zinc-900/80 px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Signup */}
            <Button
              variant="outline"
              className="w-full rounded-full flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="h-4 w-4"
              />
              Continue with Google
            </Button>

            {/* Footer */}
            <div className="text-center text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-sky-600 dark:text-sky-400 hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
