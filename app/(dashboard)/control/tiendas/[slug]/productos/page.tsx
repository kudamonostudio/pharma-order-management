import { getProductsByStore } from "@/app/actions/Products";
import { redirect } from "next/navigation";
import { CreateProductButton } from "./components/CreateProductButton";
import ProductsContent from "./Content";
// import ProductsContent from "../sucursales/Content";

export default async function ProductosPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: { page?: string };
}) {
  const { slug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/stores/${slug}`, { cache: 'no-store' });

  if (!res.ok) {
    redirect("/supremo");
  }

  const store = await res.json();

  // Modo Cliente:
  // return <ProductsContent store={store} />; 

  // Modo Server Side:
  const page = Number(searchParams?.page ?? 1);
  const limit = 3;
  const { products, total, pages } = await getProductsByStore(store.id, page, limit);
  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4 justify-between sm:flex-row mb-4">
        <h1 className="font-bold text-2xl mb-6">
          Productos de {store.name}
        </h1>
        <CreateProductButton />
      </div>

      <div className="space-y-4">
        {products.length === 0 && (
          <p className="text-muted-foreground">No hay productos registrados.</p>
        )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl shadow-sm p-4 bg-white hover:shadow-md transition"
          >
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  className="w-full h-full object-cover"
                  alt={product.name}
                />
              ) : (
                <span className="text-gray-400">Sin imagen</span>
              )}
            </div>

            <div className="mt-3">
              <h3 className="font-semibold line-clamp-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                Stock: {product.stock ?? 0}
              </p>
            </div>

            <p className="font-bold text-green-700 mt-2">
              S/{Number(product.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1;
            return (
              <a
                key={p}
                href={`?page=${p}`}
                className={`px-4 py-2 rounded-md border ${
                  p === page
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {p}
              </a>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
