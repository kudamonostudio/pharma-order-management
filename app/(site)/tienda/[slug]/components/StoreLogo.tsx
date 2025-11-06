import Image from "next/image";

const StoreLogo = ({ logoUrl }: { logoUrl?: string }) => {
  return (
    <Image
      src={logoUrl || ""}
      alt="Logo de la tienda"
      width={150}
      height={150}
      className="rounded-full w-16 h-16 object-cover ring-2 ring-border"
    />
  );
};
export default StoreLogo;
