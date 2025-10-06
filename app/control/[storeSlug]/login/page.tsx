import { LoginCollaboratorForm } from "@/components/auth/login-collaborator-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: {
    storeSlug: string;
  };
};

export default async function CollaboratorPage({ params }: PageProps) {
  const { storeSlug } = await params;

  console.log({ storeSlug });

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: {
      id: true,
      name: true,
      phone: true,
      slug: true,
      // logo: true, // TODO agregar
    },
  });

  console.log({ store });

  if (!store) {
    return <div>NOT FOUND 404</div>; // TODO
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginCollaboratorForm store={store} />
      </div>
    </div>
  );
}
