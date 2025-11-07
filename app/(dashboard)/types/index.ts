export interface Store {
  id: string;
  name: string;
  slug: string;
  logo: string;
  address: string;
  phone: string;
}

export interface User {
  name: string;
  email: string;
  role: "ADMIN_SUPREMO" | "ADMIN_DE_TIENDA" | "COLABORADOR";
}
