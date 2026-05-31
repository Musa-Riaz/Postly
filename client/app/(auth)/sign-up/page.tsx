"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setError(error.message);
    } else {
      toast.success("Check your email to confirm your account");
      router.push("/sign-in?message=Check your email to confirm your account");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-base">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl uppercase tracking-tighter">Join Postly</CardTitle>
          <CardDescription className="text-sm font-bold text-gray-600">Start managing your social presence with AI.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-heading mb-1 uppercase">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-heading mb-1 uppercase">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-400 border-2 border-black font-bold text-white text-xs shadow-shadow">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-6 text-lg font-heading" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="font-bold">Already have an account? </span>
          <Link href="/sign-in" className="text-accent underline font-black">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
