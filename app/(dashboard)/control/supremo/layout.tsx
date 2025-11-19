import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "../../components/AppSidebar";
import { AdminNavbar } from "../../components/AdminNavbar";

export default async function SupremoLayout({
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

  // Solo Admin Supremo puede acceder
  if (profile.role !== "ADMIN_SUPREMO") {
    redirect("/control");
  }
  
  return (
    <SidebarProvider>
      <AppSidebar userRole={profile.role} user={user} store={null} />
      <main className="w-full">
        <AdminNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
