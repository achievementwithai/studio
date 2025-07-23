"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Webhook, MessageSquare, User as UserIcon, LogOut, Settings } from "lucide-react";
import Link from 'next/link';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
];

export function DashboardSidebarContent() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold text-white">Ultra AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex-col gap-2 p-2">
         <SidebarSeparator />
         <div className="flex items-center gap-2 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatarUrl} alt={user?.displayName || 'User'}/>
              <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
                <span className="font-semibold text-white truncate">{user?.displayName || 'User'}</span>
                <span className="text-xs text-gray-400 truncate">{user?.email}</span>
            </div>
         </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
