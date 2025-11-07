import { getStoreBySlug } from "@/app/(dashboard)/utils/mockData";
import { redirect } from "next/navigation";

export default async function ProductosPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    redirect("/control/supremo/tiendas");
  }

  const mockProducts = [
    { id: 1, name: "Producto 1", price: 10.99, stock: 50 },
    { id: 2, name: "Producto 2", price: 25.50, stock: 30 },
    { id: 3, name: "Producto 3", price: 15.00, stock: 100 },
  ];

  return (
    <div className="px-8 py-4 w-full">
      <h1 className="font-bold text-2xl mb-6">Productos de {store.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockProducts.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-lg font-bold">${product.price}</p>
            <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
