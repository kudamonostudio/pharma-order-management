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

async function getProductPrices(productIds: number[]): Promise<Map<number, number>> {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true },
  });
  return new Map(products.map((p) => [p.id, p.price?.toNumber() ?? 0]));
}

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
          withPrices: true,
        },
      },
      messages: {
        where: {
          type: "TO_CLIENT",
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          collaborator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!dbOrder) {
    notFound();
  }

  const storeName = dbOrder.store?.name ?? "Tienda";
  const storeLogo = dbOrder.store?.logo ?? "";
  const withPrices = dbOrder.store?.withPrices ?? false;

  const orderItems = dbOrder.items as OrderItemPayload[];
  
  // Obtener precios actuales si la tienda tiene withPrices
  let priceMap = new Map<number, number>();
  if (withPrices) {
    const productIds = orderItems.map((item) => item.productId);
    priceMap = await getProductPrices(productIds);
  }

  const products = orderItems.map((item) => ({
    id: item.productId.toString(),
    name: item.name,
    image: item.imageUrl || undefined,
    quantity: item.quantity,
    price: withPrices ? priceMap.get(item.productId) : undefined,
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

  const messages = dbOrder.messages.map((msg) => ({
    id: msg.id,
    message: msg.message,
    createdAt: msg.createdAt,
  }));

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
        messages={messages}
        storeName={storeName}
        withPrices={withPrices}
        showBranchInfo={true}
      />
    </StoreContainer>
  );
};

export default Page;
