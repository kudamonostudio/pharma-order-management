// Listado de productos de la tienda, primer contacto del cliente/usuario con la tienda
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import ProductList from "../components/ProductList";
const Page = () => {
  return (
    <>
      <div className="p-8 flex gap-4 items-center">
        <Image
          src="https://i.pinimg.com/736x/c9/9d/0e/c99d0ec4d6f81c2e2592f41216d8fcd7.jpg"
          alt="Logo de la tienda"
          width={112}
          height={112}
          className="rounded-full w-28 h-28 object-cover"
        />
        <h1 className="text-2xl md:text-4xl font-bold">Nombre de la tienda</h1>
      </div>
      <ProductList />
    </>
  );
};
export default Page;
