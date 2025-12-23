import StoreContainer from "../../components/StoreContainer";
import StoreLogo from "../../components/StoreLogo";
import { OrderDetailContent } from "./OrderDetailContent";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Esta página muestra la orden creada, el listado de productos, la sucursal y el estado de la orden
interface PageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

type OrderItemPayload = {
  productId: number;
  name: string;
  quantity: number;
  imageUrl?: string | null;
};

const Page = async ({ params }: PageProps) => {
  const { slug, id } = await params;

  const orderId = Number(id);
  if (Number.isNaN(orderId)) {
    notFound();
  }

  const dbOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      store: {
        slug,
        isActive: true,
        deletedAt: null,
      },
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      items: true,
      location: {
        select: {
          id: true,
          name: true,
        },
      },
      store: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!dbOrder) {
    notFound();
  }

  const storeName = dbOrder.store?.name ?? "Tienda";
  const storeLogo = dbOrder.store?.logo ?? "";

  const products = (dbOrder.items as OrderItemPayload[]).map((item) => ({
    id: item.productId.toString(),
    name: item.name,
    image: item.imageUrl || undefined,
    quantity: item.quantity,
  }));

  const orderForView = {
    id: dbOrder.id.toString(),
    status: dbOrder.status,
    createdAt: dbOrder.createdAt,
    branch: {
      id: dbOrder.location?.id.toString() ?? "",
      name: dbOrder.location?.name ?? "Sucursal sin asignar",
    },
  };

  return (
    <StoreContainer>
      <div className="pt-12 pb-8 flex gap-4 items-center justify-center border-b">
        <StoreLogo logoUrl={storeLogo} />
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          {storeName}
        </h1>
      </div>
      <OrderDetailContent
        order={orderForView}
        products={products}
        showBranchInfo={true}
      />
    </StoreContainer>
  );
};

export default Page;
