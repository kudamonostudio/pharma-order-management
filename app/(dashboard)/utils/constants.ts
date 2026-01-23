import {
  House,
  Store,
  CircleUserRound,
  NotepadText,
  LayoutGrid,
} from "lucide-react";

export const ADMIN_SUPREMO_DASHBOARD_ITEMS = [
  {
    title: "Tiendas",
    url: "/supremo",
    icon: Store,
  },
];

// Función para generar items de tienda con URLs dinámicas
export const getStoreMenuItems = (storeSlug: string) => [
  {
    title: "Inicio",
    url: `/control/tiendas/${storeSlug}`,
    icon: House,
  },
  {
    title: "Sucursales",
    url: `/control/tiendas/${storeSlug}/sucursales`,
    icon: Store,
  },
  {
    title: "Colaboradores",
    url: `/control/tiendas/${storeSlug}/colaboradores`,
    icon: CircleUserRound,
  },
  {
    title: "Productos",
    url: `/control/tiendas/${storeSlug}/productos`,
    icon: LayoutGrid,
  },
  {
    title: "Órdenes",
    url: `/control/tiendas/${storeSlug}/ordenes?status=PENDIENTE`,
    icon: NotepadText,
  },
];

// Items para SUCURSAL_ADMIN (solo órdenes)
export const getBranchAdminMenuItems = (storeSlug: string) => [
  {
    title: "Inicio",
    url: `/control/tiendas/${storeSlug}`,
    icon: House,
  },
  {
    title: "Órdenes",
    url: `/control/tiendas/${storeSlug}/ordenes?status=PENDIENTE`,
    icon: NotepadText,
  },
];
