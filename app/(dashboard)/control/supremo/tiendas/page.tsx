import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ArrowRight, MapPin, Phone, Store, Settings } from "lucide-react";
import Link from "next/link";
import IsActiveButton from "../../../components/IsActiveButton";

export default async function page() {
  const mockStores = [
    {
      id: 1,
      name: "Farmacia Central",
      address: "Av. Principal 123",
      phone: "999-111-222",
      image:
        "https://lanuevaserenidad.com/uploads/2023/08/papel-de-la-farmacia-es-clave-en-la-prevencion-de-enfermedades.jpg",
      category: "Farmacia",
      isActive: true,
    },
    {
      id: 2,
      name: "Minimarket Montevideo",
      address: "Calle Comercio 456",
      phone: "999-333-444",
      image:
        "https://invyctaretail.com/wp-content/uploads/2023/04/modulo-check-out-L.webp",
      category: "Supermercado",
      isActive: false,
    },
    {
      id: 3,
      name: "Farmacia San José",
      address: "Plaza Mayor 789",
      phone: "999-555-666",
      image:
        "https://cdn.pixabay.com/photo/2023/09/20/07/36/doctor-8264057_1280.jpg",
      category: "Farmacia",
      isActive: false,
    },
    {
      id: 4,
      name: "Verduleria La Huerta",
      address: "Av. Libertad 321",
      phone: "999-777-888",
      image:
        "https://cdn.pixabay.com/photo/2017/11/07/18/30/tomatoes-2927757_960_720.jpg",
      category: "Verduleria",
      isActive: true,
    },
  ];

  const stores = await prisma.store.findMany({
    where: {
      deletedAt: null,
    },
    omit: {
      deletedAt: true,
    },
  });
  return (
    <div className=" px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4">
        <h1 className="font-base text-xl mb-4">Tiendas</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {mockStores.map((store) => (
          <Card
            key={store.id}
            className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative h-96"
          >
            {/* Background Image */}
            <img
              src={store.image || "/placeholder.svg"}
              alt={store.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay gradual para mejor legibilidad */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/65 to-transparent"></div>

            {/* <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{store.category}</span>
            </div> */}
            <div className="absolute top-3 left-3">
              <IsActiveButton isActive={store.isActive} variant="small" />
            </div>
            {/* Contenido directamente sobre la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {/* <IsActiveButton isActive={store.isActive} variant="small"/> */}
              <h3 className="font-semibold text-base truncate">{store.name}</h3>

              <div className="mt-1 space-y-1 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{store.phone}</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                size="sm"
              >
                Editar
                <Settings className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link key={store.id} href={`/control/tiendas/${store.id}`}>
                <Button
                  className="mt-2 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  size="sm"
                >
                  Ir a la tienda
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {/* <IsActiveButton isActive={store.isActive} /> */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
