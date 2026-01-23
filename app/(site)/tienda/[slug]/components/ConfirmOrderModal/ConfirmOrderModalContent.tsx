"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SelectedProducts from "../SelectedProducts";
import { useState, useEffect } from "react";
import { useOrderStore } from "@/app/zustand/orderStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StoreLogo from "../StoreLogo";
import ConfirmOrderModalFooter from "./ConfirmOrderModalFooter";
import ConfirmOrderModalForm from "./ConfirmOrderModalForm";
import SelectedProductsTotal from "../SelectedProductsTotal";
import { StoreLocation } from "@/app/types/store";
import { createOrder } from "@/app/actions/Orders";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  fullName: z.string().min(3, "Mínimo 3 caracteres"),
  phone: z.string().min(8, "Mínimo 8 dígitos"),
  branchId: z.string().min(1, "Selecciona una sucursal"),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  storeName: string;
  storeLogo: string;
  locations: StoreLocation[];
  storeSlug: string;
  withPrices: boolean;
}

export default function ConfirmOrderModalContent({
  open,
  onOpenChange,
  storeId,
  storeName,
  storeLogo,
  locations,
  storeSlug,
  withPrices,
}: Props) {
  const [step, setStep] = useState<"products" | "form">("products");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { order, getOrderQuantity, getOrderTotal, clearOrder } =
    useOrderStore();
  const router = useRouter();

  // Obtener datos guardados del localStorage
  const savedFullName =
    typeof window !== "undefined"
      ? localStorage.getItem("customerFullName") || ""
      : "";
  const savedPhone =
    typeof window !== "undefined"
      ? localStorage.getItem("customerPhone") || ""
      : "";

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

  const handleBack = () => {
    setStep("products");
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Calcular el total
      const totalAmount = getOrderTotal();

      // Preparar los items (sin precio, solo productId, quantity y name)
      const items = order.map((item) => ({
        productId: parseInt(item.id),
        quantity: item.quantity,
        name: item.name,
      }));

      // Crear FormData para enviar al server action
      const formData = new FormData();
      formData.append("storeSlug", storeSlug);
      formData.append("fullname", data.fullName);
      formData.append("phoneContact", data.phone);
      formData.append("locationId", data.branchId);
      formData.append("items", JSON.stringify(items));
      formData.append("totalAmount", totalAmount.toString());

      // Llamar a la server action
      const createdOrderId = await createOrder(formData);

      // Guardar datos del cliente en localStorage
      localStorage.setItem("customerFullName", data.fullName);
      localStorage.setItem("customerPhone", data.phone);

      // Limpiar la orden
      clearOrder();

      // Cerrar el modal
      handleOpenChange(false);

      // Redirigir a la orden
      router.push(`./${storeSlug}/orden/${createdOrderId}`);
      /* router.refresh(); */
    } catch (error) {
      console.error("Error al crear la orden:", error);
      // Aquí podrías mostrar un toast o mensaje de error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full md:min-w-4xl max-w-4xl h-screen rounded-none flex flex-col p-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex gap-6 items-center mb-2">
              <StoreLogo logoUrl={storeLogo} />
              <DialogTitle className="text-2xl mb-2 font-normal">
                Confirma la orden
              </DialogTitle>
            </div>
            <DialogDescription className="text-lg font-normal">
              {step === "products"
                ? "Repasa los productos seleccionados antes de continuar"
                : "Completa tus datos y elige sucursal para confirmar tu orden"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {step === "products" ? (
          <div className="flex-1 flex flex-col px-6 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <SelectedProducts order={order} withPrices={withPrices} />
            </div>
            <div className="shrink-0 pt-4">
              <SelectedProductsTotal
                totalQuantity={getOrderQuantity()}
                totalAmount={getOrderTotal()}
                withPrices={withPrices}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 justify-center items-center">
            <ConfirmOrderModalForm
              register={register}
              errors={errors}
              branchId={branchId}
              locations={locations}
              onBranchChange={(value: string) => {
                setValue("branchId", value);
                trigger("branchId");
              }}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        )}

        <ConfirmOrderModalFooter
          step={step}
          isValid={isValid}
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
