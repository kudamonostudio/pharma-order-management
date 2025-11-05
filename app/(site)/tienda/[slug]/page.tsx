// Listado de productos de la tienda, primer contacto del cliente/usuario con la tienda
import Image from "next/image";
import ProductList from "./components/ProductList";
import { StoreProductItem } from "@/app/types/store";
import ProductListFooter from "./components/ProductListFooter";
const Page = () => {
  const products: StoreProductItem[] = [
    {
      id: "1",
      name: "Limpiador Lavanda Fresh - 5 L",
      image:
        "https://f.fcdn.app/imgs/7ab49b/www.drogueriapaysandu.com.uy/dpayuy/ac65/webp/catalogo/LV-_04020108_1/1500-1500/limpiador-lavanda-fresh-5-l.jpg",
      description:
        "Limpia, desinfecta y aromatiza cualquier tipo de ambiente. Con efecto germicida, el limpiador fue formulado para eliminar la suciedad y malos olores dejando el ambiente fresco y aromatizado.",
    },
    {
      id: "2",
      name: "Bicarbonato de Sodio - 1 Kg",
      image:
        "https://f.fcdn.app/imgs/014d07/www.drogueriapaysandu.com.uy/dpayuy/ebf1/webp/catalogo/AK0101-_01011008_1/1500-1500/bicarbonato-de-sodio-1-kg.jpg",
      description:
        "El bicarbonato de sodio es un compuesto multifuncional indicado desde la salud hasta la limpieza del hogar. Efectivo leudante en repostería y limpieza de superficies con sarro.",
    },
    {
      id: "3",
      name: "Limpiador Pino Fresh - 1 L",
      image:
        "https://f.fcdn.app/imgs/13e705/www.drogueriapaysandu.com.uy/dpayuy/1a14/webp/catalogo/AZ0101-_01014220_1/1500-1500/limpiador-pino-fresh-1-l.jpg",
      description:
        "Detergente de formulación propia ideal para el lavado diario de platos, accesorios y utensilios de cocina. Su agradable aroma cítrico y su poder desengrasante dejan la vajilla más limpia y brillante incluso con agua fría.",
    },
    {
      id: "4",
      name: "Sal para Piscina en Bolsa - 15 kg",
      image:
        "https://f.fcdn.app/imgs/342f5e/www.drogueriapaysandu.com.uy/dpayuy/a57c/webp/catalogo/SL0101-_01015117_1/1500-1500/sal-para-piscina-en-bolsa-15-kg.jpg",
      description: "Sal para Piscina en Bolsa 25 kg",
    },
    {
      id: "5",
      name: "Agua Oxigenada 200 Vol. - 1 L",
      image:
        "https://f.fcdn.app/imgs/56e570/www.drogueriapaysandu.com.uy/dpayuy/b057/webp/catalogo/I0101-_01010166_1/1500-1500/agua-oxigenada-200-vol-1-l.jpg",
      description:
        "El agua oxigenada es una solución de amplio espectro utilizada para diversos cuidados personales. Dependiendo su concentración, también se utiliza para desinfección de superficies por su acción bactericida.",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="pt-12 pb-8 flex gap-4 items-center justify-center border-b">
          <Image
            src="https://i.pinimg.com/736x/c9/9d/0e/c99d0ec4d6f81c2e2592f41216d8fcd7.jpg"
            alt="Logo de la tienda"
            width={150}
            height={150}
            className="rounded-full w-16 h-16 object-cover ring-2 ring-border"
          />
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Nombre de la tienda
          </h1>
        </div>
        <ProductList products={products} />
      </div>
      <ProductListFooter />
    </div>
  );
};
export default Page;
