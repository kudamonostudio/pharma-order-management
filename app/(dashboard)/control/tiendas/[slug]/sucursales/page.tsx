import { redirect } from "next/navigation";

export default async function SucursalesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/stores/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/supremo");
  }

  const store = await res.json();

  
  //TODO: Reemplazar con datos reales de sucursales
  const mockBranches = [
    { id: 1, name: "Sucursal Centro", address: "Av. Principal 123" },
    { id: 2, name: "Sucursal Norte", address: "Calle Norte 456" },
  ];

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Sucursales de {store.name}</h1>
      <div className="space-y-4">
        {mockBranches.map((branch) => (
          <div key={branch.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{branch.name}</h3>
              <p className="text-sm text-muted-foreground">{branch.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
