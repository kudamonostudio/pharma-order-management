import { Button } from "@/components/ui/button";

interface ConfirmOrderModalFooterProps {
  step: "products" | "form";
  isValid: boolean;
  onNext: () => void;
  onBack: () => void;
}

export default function ConfirmOrderModalFooter({
  step,
  isValid,
  onNext,
  onBack,
}: ConfirmOrderModalFooterProps) {
  return (
    <div className="border-t bg-background px-6 py-4 mt-auto">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {step === "products" ? (
            "¿Están bien los productos elegidos? Si es así, da click en Siguiente."
          ) : (
            <Button
              type="button"
              className="bg-zinc-900 hover:bg-zinc-950 text-white cursor-pointer"
              disabled={false}
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
            disabled={!isValid}
          >
            Confirmar Orden
          </Button>
        )}
      </div>
    </div>
  );
}
