import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "../(dashboard)/components/AppSidebar";
import { AdminNavbar } from "../(dashboard)/components/AdminNavbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication check
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  /*   const {
    data: { user },
  } = await supabase.auth.getUser(); */

  if (error || !data?.claims) {
    redirect("/login");
  }

  const userId = data.claims.sub as string;

  // Get user profile with role
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={profile.role} user={profile} />
      <main className="min-h-screen flex flex-col w-full">
        <AdminNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
