// Listado de productos de la tienda, primer contacto del cliente/usuario con la tienda
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import ProductList from "../components/ProductList";
const Page = () => {
  return (
    <div className="max-w-5xl m-auto">
      <div className="pt-10 pb-8 flex gap-4 items-center justify-center">
        <Image
          src="https://i.pinimg.com/736x/c9/9d/0e/c99d0ec4d6f81c2e2592f41216d8fcd7.jpg"
          alt="Logo de la tienda"
          width={150}
          height={150}
          className="rounded-full w-24 h-24 object-cover"
        />
        <h1 className="text-2xl md:text-3xl font-medium text-zinc-800">
          Nombre de la tienda
        </h1>
      </div>
      <ProductList />
    </div>
    //TODO: Hacer pie de página fijo con la cantidad de productos seleccionados y el botón de Crear Orden.
  );
};
export default Page;
