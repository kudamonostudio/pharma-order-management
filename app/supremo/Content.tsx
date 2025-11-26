"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MapPin, Phone, Settings } from "lucide-react";
import Link from "next/link";
import { StoreConfigModal } from "./components/StoreConfigModal";
import { Store } from "@prisma/client";
import IsActiveButton from "../(dashboard)/components/IsActiveButton";
import { CreateStoreModal } from "./CreateStoreModal";
import { LogoPlaceholder } from "../(dashboard)/components/LogoPlaceholder";
import { StoreFilter } from "./components/StoreFilter";

interface TiendasContentProps {
  stores: Store[];
}

export default function TiendasContent({ stores }: TiendasContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredStores = stores.filter((store) => {
    if (filter === "all") return true;
    if (filter === "active") return store.isActive;
    if (filter === "inactive") return !store.isActive;
    return true;
  });

  const displayStores = filteredStores.length > 0 ? filteredStores : [];

  const handleEditClick = (store: Store) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4 justify-between sm:flex-row mb-4">
        <h1 className="font-bold text-2xl">Tiendas</h1>
        <Button onClick={() => setIsModalOpen(true)}>Crear nueva tienda</Button>
      </div>

      <div className="flex justify-start mb-6">
        <StoreFilter value={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
        {displayStores.map((store) => (
          <Card
            key={store.id}
            className="relative rounded-2xl border border-neutral-200 shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center overflow-hidden justify-between"
          >
            {/* Background Gradient */}
            <div
              className={`absolute top-2 left-2 right-2 h-24 rounded-t-xl ${
                store.isActive
                  ? "bg-gradient-to-br from-emerald-800 to-emerald-400 opacity-30"
                  : "bg-gradient-to-br from-neutral-600 to-neutral-400 opacity-20"
              }`}
            />

            <div className="absolute top-3 left-3 z-10">
              <IsActiveButton isActive={store.isActive} variant="small" />
            </div>

            <div className="flex flex-col items-center gap-4 pt-8 pb-4 relative z-10">
              {/* Logo */}
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={100}
                  height={100}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <LogoPlaceholder variant="store" isActive={store.isActive} />
              )}

              {/* Info */}
              <div className="space-y-1 w-full">
                <h3 className="text-lg font-semibold truncate">{store.name}</h3>

                {store.address && (
                  <div className="flex items-center justify-center gap-1 text-sm text-neutral-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{store.address}</span>
                  </div>
                )}

                {store.phone && (
                  <div className="flex items-center justify-center gap-1 text-sm text-neutral-600">
                    <Phone className="h-4 w-4" />
                    <span>{store.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="w-full space-y-2">
              <Button
                variant="secondary"
                className="w-full flex items-center justify-center gap-2 rounded-xl"
                onClick={() => handleEditClick(store)}
              >
                <Settings className="w-4 h-4" />
                Configuración
              </Button>

              <Link href={`/control/tiendas/${store.slug}`} className="w-full">
                <Button className="w-full flex items-center justify-center rounded-xl">
                  Ir a la tienda
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <CreateStoreModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      <StoreConfigModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        store={selectedStore}
      />
    </div>
  );
}
