"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { Bot } from "lucide-react";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // The redirect is now handled by the AuthProvider,
    // but we can still push the user away if they land here while logged in.
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Show a loading spinner while auth state is being determined.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Bot className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If the user is somehow still present, show loading to allow AuthProvider to redirect
  if (user) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Bot className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Ultra AI Assistant
          </h1>
          <p className="text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </div>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <AuthForm type="signin" />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm type="signup" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
