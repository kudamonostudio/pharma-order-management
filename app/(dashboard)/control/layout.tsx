import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { DeployButton } from "@/components/auth/deploy-button";
import { AuthButton } from "@/components/auth/auth-button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "../components/AppSidebar";
import { AdminNavbar } from "../components/AdminNavbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication check
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub as string;

  // Get user profile with role
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile) {
    redirect("/auth/login");
  }

  // Now you can use profile.role in your layout or pass it to children
  
  return (
    <SidebarProvider>
      <AppSidebar userRole={profile.role} user={user} />
      <main className="min-h-screen flex flex-col w-full">
        <AdminNavbar /> 
        {/* You can pass the profile role to children through props or context */}
        {children}
      </main>
    </SidebarProvider>
  );
}
