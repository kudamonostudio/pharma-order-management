import { mockCollaborators } from "@/app/mocks/collaborators";
import { redirect } from "next/navigation";

export default async function ColaboradoresPage({
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
  //TODO: Reemplazar mockCollaborators con datos reales de colaboradores

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Colaboradores de {store.name}</h1>

      <div className="space-y-4">
        {mockCollaborators.map((collab) => (
          <div
            key={collab.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{collab.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
