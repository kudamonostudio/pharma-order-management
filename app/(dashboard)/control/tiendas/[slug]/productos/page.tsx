import { redirect } from "next/navigation";

export default async function ProductosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/stores/${slug}`, { cache: 'no-store' });

  if (!res.ok) {
    redirect("/supremo");
  }

  const store = await res.json();

  // TODO: Reemplazar con datos reales de productos
  const mockProducts = [
    { id: 1, name: "Paracetamol 500mg", price: 5.00, stock: 100 },
    { id: 2, name: "Ibuprofeno 400mg", price: 4.50, stock: 50 },
    { id: 3, name: "Amoxicilina 500mg", price: 8.00, stock: 30 },
  ];

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Productos de {store.name}</h1>
      <div className="space-y-4">
        {mockProducts.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
            </div>
            <p className="font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
