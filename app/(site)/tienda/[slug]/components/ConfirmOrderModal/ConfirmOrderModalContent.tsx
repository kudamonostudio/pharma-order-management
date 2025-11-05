"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectedProducts from "./SelectedProducts";
import { useState, useEffect } from "react";
import { useOrderStore } from "@/app/zustand/orderStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(3, "Mínimo 3 caracteres"),
  phone: z.string().min(8, "Mínimo 8 dígitos"),
  branchId: z.string().min(1, "Selecciona una sucursal"),
});

type FormData = z.infer<typeof formSchema>;

const BRANCHES = [
  { id: "1", name: "Sucursal 1" },
  { id: "2", name: "Sucursal 2" },
  { id: "3", name: "Sucursal 3" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConfirmOrderModalContent({
  open,
  onOpenChange,
}: Props) {
  const [step, setStep] = useState<"products" | "form">("products");
  const { order, getOrderQuantity, clearOrder } = useOrderStore();

  // Obtener datos guardados del localStorage
  const savedFullName = typeof window !== "undefined" ? localStorage.getItem("customerFullName") || "" : "";
  const savedPhone = typeof window !== "undefined" ? localStorage.getItem("customerPhone") || "" : "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: savedFullName,
      phone: savedPhone,
      branchId: "",
    },
  });

  const branchId = watch("branchId");

  // Cargar datos del localStorage cuando se abre el modal
  useEffect(() => {
    if (open && step === "form") {
      const savedName = localStorage.getItem("customerFullName") || "";
      const savedPhone = localStorage.getItem("customerPhone") || "";
      
      setValue("fullName", savedName);
      setValue("phone", savedPhone);
    }
  }, [open, step, setValue]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep("products");
      reset();
    }
    onOpenChange(open);
  };

  const handleNext = () => {
    setStep("form");
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      customerName: data.fullName,
      customerPhone: data.phone,
      branchId: data.branchId,
      items: order.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      totalQuantity: getOrderQuantity(),
    };

    console.log("📦 PAYLOAD DE LA ORDEN:", payload);

    // Guardar datos del cliente en localStorage para próximas órdenes
    localStorage.setItem("customerFullName", data.fullName);
    localStorage.setItem("customerPhone", data.phone);

    // Limpiar la orden del store
    clearOrder();

    // Cerrar el modal (esto resetea el step y el form)
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full md:min-w-6xl max-w-6xl h-screen rounded-none flex flex-col p-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirmando la Orden</DialogTitle>
            <DialogDescription className="text-lg">
              {step === "products"
                ? "Revisa los detalles de tu pedido antes de confirmar"
                : "Completa los datos para finalizar tu orden"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {step === "products" ? (
            <SelectedProducts />
          ) : (
            <form
              id="order-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Ej: Juan Pérez"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Número de Contacto</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej: 12345678"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="branchId">Sucursal para Retirar</Label>
                <Select
                  value={branchId}
                  onValueChange={(value: string) => {
                    setValue("branchId", value);
                    trigger("branchId"); // Trigger validation
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branchId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.branchId.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="border-t bg-background px-6 py-4 mt-auto">
          <div className="flex items-center justify-between">
            <small className="text-muted-foreground">
              {step === "products"
                ? "¿Están bien los productos elegidos? Si es así, da click en Siguiente."
                : "Verifica los datos y confirma tu orden."}
            </small>
            {step === "products" ? (
              <Button
                onClick={handleNext}
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
      </DialogContent>
    </Dialog>
  );
}
