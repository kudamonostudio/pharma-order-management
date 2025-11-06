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

const formSchema = z.object({
  fullName: z.string().min(3, "Mínimo 3 caracteres"),
  phone: z.string().min(8, "Mínimo 8 dígitos"),
  branchId: z.string().min(1, "Selecciona una sucursal"),
});

type FormData = z.infer<typeof formSchema>;

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

    localStorage.setItem("customerFullName", data.fullName);
    localStorage.setItem("customerPhone", data.phone);

    clearOrder();

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full md:min-w-4xl max-w-4xl h-screen rounded-none flex flex-col p-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex gap-6 items-center mb-2">
              <StoreLogo logoUrl="https://i.pinimg.com/736x/c9/9d/0e/c99d0ec4d6f81c2e2592f41216d8fcd7.jpg" />
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

        <div className="flex-1 overflow-y-auto px-6 justify-center items-center">
          {step === "products" ? (
            <>
            <SelectedProducts />
            <SelectedProductsTotal totalQuantity={getOrderQuantity()} />
            </>
          ) : (
            <ConfirmOrderModalForm
              register={register}
              errors={errors}
              branchId={branchId}
              onBranchChange={(value: string) => {
                setValue("branchId", value);
                trigger("branchId");
              }}
              onSubmit={handleSubmit(onSubmit)}
            />
          )}
        </div>

        <ConfirmOrderModalFooter
          step={step}
          isValid={isValid}
          onNext={handleNext}
          onBack={handleBack}
        />
      </DialogContent>
    </Dialog>
  );
}
