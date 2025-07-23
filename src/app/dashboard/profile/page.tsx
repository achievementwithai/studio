"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { AvatarUploader } from "@/components/avatar-uploader";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8" />
            Profile
        </h1>
        <p className="text-muted-foreground">
            View and update your profile information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <CardDescription>
            This is how your profile appears to others.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatarUrl} alt={user?.displayName || "User"} />
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <p className="text-2xl font-semibold">{user?.displayName}</p>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-primary font-medium capitalize pt-1">{user?.role}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Update Avatar</h3>
             <AvatarUploader />
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
