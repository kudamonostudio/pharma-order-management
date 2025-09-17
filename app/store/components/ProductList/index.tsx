"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Minus, Plus, Store } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  image: string;
  description: string;
}

const products: ProductItem[] = [
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

const ProductList = () => {
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Update the product quantity in the state
  };

  return (
    <div className="p-8">
      <div className="flex gap-2 mb-6 items-center">
        <Store className="w-5 h-5 mt-1" strokeWidth={1.25} />
        <h2 className="text-2xl">Listado de Productos</h2>
      </div>

      <div className="space-y-6 max-w-5xl">
        {products.map((item) => (
          <Card key={item.id} className="mb-2 px-2">
            <div className="flex items-center gap-6">
              {/* Product Image */}
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.name}
                </h3>
                <div className="text-md text-gray-700 mb-1">
                  <p className="line-clamp-3">{item.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    /* onClick={() => updateQuantity(item.id, item.quantity + 1)} */
                    className="px-3 py-2 h-auto"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    /* onClick={() => updateQuantity(item.id, item.quantity - 1)} */
                    className="px-3 py-2 h-auto"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ProductList;
