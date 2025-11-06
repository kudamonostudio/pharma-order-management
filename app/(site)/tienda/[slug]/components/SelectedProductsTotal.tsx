import { Separator } from "@/components/ui/separator";

interface SelectedProductsTotalProps {
  totalQuantity: number;
}

export default function SelectedProductsTotal({
  totalQuantity,
}: SelectedProductsTotalProps) {
  return (
    <div className="w-full max-w-lg">
      <Separator className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg ">
        <span className="text-xl font-base text-foreground">
          Total de productos en la orden
        </span>
        <span className="text-3xl font-bold text-primary w-20 text-center">
          {totalQuantity}
        </span>
      </div>
    </div>
  );
}
