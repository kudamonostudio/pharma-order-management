import type { Store } from "../types";

// Mock data simulando respuesta de API
export const MOCK_STORES: Record<string, Store> = {
  "1": {
    id: "1",
    name: "Farmacia Central",
    slug: "1",
    logo: "https://lanuevaserenidad.com/uploads/2023/08/papel-de-la-farmacia-es-clave-en-la-prevencion-de-enfermedades.jpg",
    address: "Av. Principal 123",
    phone: "999-111-222",
  },
  "2": {
    id: "2",
    name: "Minimarket Montevideo",
    slug: "2",
    logo: "https://invyctaretail.com/wp-content/uploads/2023/04/modulo-check-out-L.webp",
    address: "Calle Comercio 456",
    phone: "999-333-444",
  },
  "3": {
    id: "3",
    name: "Farmacia San José",
    slug: "3",
    logo: "https://cdn.pixabay.com/photo/2023/09/20/07/36/doctor-8264057_1280.jpg",
    address: "Plaza Mayor 789",
    phone: "999-555-666",
  },
};

// Simular fetch de tienda por slug
export function getStoreBySlug(slug: string): Store | null {
  return MOCK_STORES[slug] || null;
}
