import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "../../../components/AppSidebar";
import { AdminNavbar } from "../../../components/AdminNavbar";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
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

  // Get slug from params
  const { slug } = await params;

  // Fetch store data from database
  const store = await prisma.store.findUnique({
    where: { slug },
    omit: { deletedAt: true },
  });

  if (!store) {
    redirect("/supremo");
  }
  
  return (
    <SidebarProvider>
      <AppSidebar 
        userRole={profile.role} 
        user={user} 
        store={store} 
      />
      <main className="w-full">
        <AdminNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
