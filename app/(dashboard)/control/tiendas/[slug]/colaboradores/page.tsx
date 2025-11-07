import { getStoreBySlug } from "@/app/(dashboard)/utils/mockData";
import { redirect } from "next/navigation";

export default async function ColaboradoresPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    redirect("/control/supremo/tiendas");
  }

  const mockCollaborators = [
    { id: 1, name: "Juan Pérez", role: "Vendedor", email: "juan@example.com" },
    { id: 2, name: "María García", role: "Supervisor", email: "maria@example.com" },
    { id: 3, name: "Carlos López", role: "Vendedor", email: "carlos@example.com" },
  ];

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Colaboradores de {store.name}</h1>
      
      <div className="space-y-4">
        {mockCollaborators.map((collab) => (
          <div key={collab.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{collab.name}</h3>
              <p className="text-sm text-muted-foreground">{collab.role}</p>
            </div>
            <p className="text-sm">{collab.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
