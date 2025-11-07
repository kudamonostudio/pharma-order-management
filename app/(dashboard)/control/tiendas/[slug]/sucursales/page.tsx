import { getStoreBySlug } from "@/app/(dashboard)/utils/mockData";
import { redirect } from "next/navigation";

export default async function SucursalesPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    redirect("/control/supremo/tiendas");
  }

  const mockBranches = [
    { id: 1, name: "Sucursal Centro", address: "Calle Principal 100" },
    { id: 2, name: "Sucursal Norte", address: "Av. Norte 200" },
  ];

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Sucursales de {store.name}</h1>
      
      <div className="space-y-4">
        {mockBranches.map((branch) => (
          <div key={branch.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{branch.name}</h3>
            <p className="text-muted-foreground">{branch.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
