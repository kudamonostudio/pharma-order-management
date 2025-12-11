// Listado de productos de la tienda, primer contacto del cliente/usuario con la tienda
import ProductList from "./components/ProductList";
import { StoreProductItem } from "@/app/types/store";
import ProductListFooter from "./components/ProductListFooter";
import StoreLogo from "./components/StoreLogo";
import StoreContainer from "./components/StoreContainer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Obtener datos de la tienda y sus sucursales
  const store = await prisma.store.findUnique({
    where: {
      slug,
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      locations: {
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          address: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!store) {
    notFound();
  }

  // Obtener productos activos de la tienda
  const dbProducts = await prisma.product.findMany({
    where: {
      storeId: store.id,
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transformar productos al formato esperado
  const products: StoreProductItem[] = dbProducts.map((product) => ({
    id: product.id.toString(),
    name: product.name,
    image: product.imageUrl || "",
    description: product.description || "",
  }));

  return (
    <StoreContainer>
      <div className="pt-12 pb-8 flex gap-4 items-center justify-center border-b">
        <StoreLogo logoUrl={store.logo || ""} />
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          {store.name}
        </h1>
      </div>
      <ProductList products={products} />
      <ProductListFooter 
        storeId={store.id} 
        storeName={store.name} 
        storeLogo={store.logo || ""} 
        locations={store.locations}
        storeSlug={slug}
      />
    </StoreContainer>
  );
};
export default Page;
