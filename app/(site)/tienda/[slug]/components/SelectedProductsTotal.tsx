import { Separator } from "@/components/ui/separator";

interface SelectedProductsTotalProps {
  totalQuantity: number;
  totalAmount?: number;
  withPrices: boolean;
}

export default function SelectedProductsTotal({
  totalQuantity,
  totalAmount = 0,
  withPrices,
}: SelectedProductsTotalProps) {
  return (
    <div className="w-full space-y-3">
      <Separator className="my-4" />

      <div className="md:flex justify-between">
        {/* Total de productos */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg ">
          <span className="text-xl font-base text-foreground">
            Total de productos en la orden
          </span>
          <span className="text-3xl font-bold text-primary w-20 text-center">
            {totalQuantity}
          </span>
        </div>

        {/* Precio total de la orden */}
        {withPrices && (
          <div className="flex gap-2 items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border-2 border-emerald-600">
            <span className="text-xl font-semibold text-foreground">
              Total a pagar
            </span>
            <span className="text-3xl font-bold text-emerald-600 w-auto text-center">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
