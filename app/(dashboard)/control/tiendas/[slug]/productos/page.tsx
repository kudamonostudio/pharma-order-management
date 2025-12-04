import { getStoreWithProducts } from "@/app/actions/Products";
import { LIMIT_PER_PAGE } from "@/lib/constants";
import { redirect } from "next/navigation";
import ProductsContent from "./Content";

export default async function ProductosPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  try {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page) || 1;

    const data = await getStoreWithProducts(slug, page, LIMIT_PER_PAGE);

    if (!data) {
      redirect("/supremo");
    }

    return (
      <ProductsContent 
        store={data.store} 
        initialProducts={data.products}
        initialPages={data.pages}
        initialPage={page}
      />
    );
  } catch (error) {
    console.error('Error fetching store:', error);
    redirect("/supremo");
  }
}
