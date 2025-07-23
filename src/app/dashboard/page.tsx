"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Webhook, MessageSquare, User, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.displayName || "User"}!</h1>
        <p className="text-muted-foreground">Here's a quick overview of your Ultra AI Assistant.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="text-primary" />
              Manage Webhooks
            </CardTitle>
            <CardDescription>
              Create and manage your AI assistants by connecting them to webhooks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/webhooks" passHref>
              <Button>Go to Webhooks <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-primary" />
              Start Chatting
            </CardTitle>
            <CardDescription>
              Interact with your configured AI assistants through a simple chat interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/dashboard/chat" passHref>
              <Button>Start a Chat <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-primary" />
              Your Profile
            </CardTitle>
            <CardDescription>
              Update your personal information and upload a new avatar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/profile" passHref>
              <Button>View Profile <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
