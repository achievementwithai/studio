"use client";

import { useAuth } from "@/lib/auth";
import { Bot, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { loading, loginAs } = useAuth();

  if (loading) {
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
            Choose a user role to explore the application.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button size="lg" variant="outline" onClick={() => loginAs("user")}>
                <User className="mr-2"/>
                Login as User
            </Button>
            <Button size="lg" variant="outline" onClick={() => loginAs("admin")}>
                <Shield className="mr-2"/>
                Login as Admin
            </Button>
        </div>
      </div>
    </div>
  );
}
