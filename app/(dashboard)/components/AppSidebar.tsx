"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ADMIN_SUPREMO_DASHBOARD_ITEMS,
  getStoreMenuItems,
  getBranchAdminMenuItems,
} from "../utils/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/auth/dropdown-menu";
import { usePathname } from "next/navigation";
import { Profile, Role, Store } from "@prisma/client";
import Link from "next/link";
import { LogoPlaceholder } from "./LogoPlaceholder";
import { useLogout } from "@/hooks/use-logout";
import { useUserStore } from "@/app/zustand/userStore";
import { useEffect, useState } from "react";

interface AppSidebarProps {
  userRole: string;
  user: Profile;
  store?: Store | null;
}

export function AppSidebar({ userRole, user, store }: AppSidebarProps) {
  const pathname = usePathname();
  const { logout } = useLogout();

  const getInitials = useUserStore((state) => state.getInitials);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Determinar qué items mostrar
  const showAdminItems = userRole === Role.ADMIN_SUPREMO;
  const showStoreItems =
    userRole === Role.TIENDA_ADMIN ||
    (userRole === Role.ADMIN_SUPREMO && store);
  const showBranchItems = userRole === Role.SUCURSAL_ADMIN && store;

  // Generar items de tienda con URLs dinámicas si hay store
  const storeMenuItems = store ? getStoreMenuItems(store.slug) : [];
  const branchMenuItems = store ? getBranchAdminMenuItems(store.slug) : [];

  const mapperRole = (role: string) => {
    switch (role) {
      case Role.ADMIN_SUPREMO:
        return "Admin Supremo";
      case Role.TIENDA_ADMIN:
        return "Administrador de Tienda";
      case Role.SUCURSAL_ADMIN:
        return "Administrador de Sucursal";
      default:
        return "";
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {userRole === Role.ADMIN_SUPREMO ? (
                  <img
                    src="/applogo.webp"
                    alt="App Logo"
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.imageUrl || "/avatars/shadcn.jpg"}
                      alt={user?.firstName || "Usuario"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {isHydrated
                        ? getInitials()
                        : user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-0.5 leading-none">
                  {user && (
                    <span className="font-semibold">
                      {user.firstName} {user.lastName}
                    </span>
                  )}
                  <span className="text-xs">{mapperRole(userRole)}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Grupo de Admin Supremo */}
        {showAdminItems && (
          <SidebarGroup>
            <SidebarGroupLabel>ADMIN</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_SUPREMO_DASHBOARD_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Grupo de Tienda - Solo si estamos en una tienda o si es admin de tienda */}
        {showStoreItems && store && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              {store.logo ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={store.logo} alt={store.name} />
                  <AvatarFallback className="text-xs">
                    {store.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <LogoPlaceholder
                  variant="store"
                  isActive={store.isActive}
                  className="h-6 w-6"
                />
              )}
              <span className="truncate">{store.name}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {storeMenuItems.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Grupo de Sucursal - Solo para SUCURSAL_ADMIN */}
        {showBranchItems && store && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              {store.logo ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={store.logo} alt={store.name} />
                  <AvatarFallback className="text-xs">
                    {store.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <LogoPlaceholder
                  variant="store"
                  isActive={store.isActive}
                  className="h-6 w-6"
                />
              )}
              <span className="truncate">{store.name}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {branchMenuItems.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full justify-start gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Configuración</span>
                  {/* <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.imageUrl || "/avatars/shadcn.jpg"} alt={user?.firstName || "Usuario"} />
                    <AvatarFallback className="rounded-lg">
                      {isHydrated ? getInitials() : user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.firstName} {user?.lastName}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div> */}

                  <ChevronsUpDown className="ml-auto size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.imageUrl || "/avatars/shadcn.jpg"}
                        alt={user?.firstName || "Usuario"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {isHydrated
                          ? getInitials()
                          : user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
