import SelectedProducts from "../../components/SelectedProducts";
import StoreContainer from "../../components/StoreContainer";
import StoreLogo from "../../components/StoreLogo";

// Esta página muestra la orden creada, el listado de productos, la sucursal y el estado de la orden
const Page = () => {
  const mockOrder = {
    id: "order_12345",
    status: "pending",
    /* branchId: "3", */ // TODO: Obtener la sucursal desde supabase una vez implementadas las sucursales
    items: [
      {
        /* productId: "4", */ // TODO: Obtener el producto desde supabase una vez implementados los productos
        quantity: 3,
      },
      {
        /* productId: "5", */  // TODO: Obtener el producto desde supabase una vez implementados los productos
        quantity: 1,
      },
    ],
    totalQuantity: 4,
  };
  return (
    <StoreContainer>
      <div className="pt-12 pb-8 flex gap-4 items-center justify-center border-b">
        <StoreLogo logoUrl="https://i.pinimg.com/736x/c9/9d/0e/c99d0ec4d6f81c2e2592f41216d8fcd7.jpg" />
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Nombre de la tienda
        </h1>
      </div>
      <div className="flex flex-col py-4 gap-4">
        <div className="flex justify-between">

        <h1 className="text-2xl font-normal text-gray-600">Detalles de la orden: #{mockOrder.id}</h1>
        </div>
        <SelectedProducts />
      </div>
    </StoreContainer>
  );
};
export default Page;
