import { Button } from "@/components/ui/button";

interface ConfirmOrderModalFooterProps {
  step: "products" | "form";
  isValid: boolean;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function ConfirmOrderModalFooter({
  step,
  isValid,
  onNext,
  onBack,
  isSubmitting = false,
}: ConfirmOrderModalFooterProps) {
  return (
    <div className="border-t bg-background px-6 py-4 mt-auto">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm md:text-base">
          {step === "products" ? (
            "Si los productos elegidos son correctos, da click en Siguiente."
          ) : (
            <Button
              type="button"
              className="bg-zinc-900 hover:bg-zinc-950 text-white cursor-pointer"
              disabled={isSubmitting}
              onClick={onBack}
            >
              Atrás
            </Button>
          )}
        </p>
        {step === "products" ? (
          <Button
            onClick={onNext}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Siguiente
          </Button>
        ) : (
          <Button
            type="submit"
            form="order-form"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Confirmar Orden"}
          </Button>
        )}
      </div>
    </div>
  );
}
