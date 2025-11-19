import { prisma } from "@/lib/prisma";
import TiendasContent from "./Content";

export default async function TiendasPage() {
  const stores = await prisma.store.findMany({
    where: {
      deletedAt: null,
    },
    omit: {
      deletedAt: true,
    },
  });

  return <TiendasContent stores={stores} />;
}
