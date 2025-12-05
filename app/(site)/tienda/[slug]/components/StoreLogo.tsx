import Image from "next/image";
import { Store } from "lucide-react";

const StoreLogo = ({ logoUrl }: { logoUrl?: string }) => {
  if (!logoUrl) {
    return (
      <div className="rounded-full w-16 h-16 bg-muted ring-2 ring-border flex items-center justify-center">
        <Store className="w-8 h-8 text-muted-foreground" strokeWidth={1} />
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt="Logo de la tienda"
      width={150}
      height={150}
      className="rounded-full w-16 h-16 object-cover ring-2 ring-border"
    />
  );
};
export default StoreLogo;
