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
import { Loader2 } from "lucide-react";

type DeliveryMethod = "location" | "shipping";

const formSchema = z.object({
  fullName: z.string().min(3, "Mínimo 3 caracteres"),
  phone: z.string().min(8, "Mínimo 8 dígitos"),
  paymentMethod: z.string().min(1, "Selecciona un método de pago"),
  branchId: z.string(),
  shippingAddress: z.string(),
});

type FormData = z.infer<typeof formSchema>;

function getFormSchema(deliveryMethod: DeliveryMethod) {
  return formSchema.superRefine((data, ctx) => {
    if (deliveryMethod === "location" && (!data.branchId || data.branchId.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona una sucursal",
        path: ["branchId"],
      });
    }
    if (deliveryMethod === "shipping" && (!data.shippingAddress || data.shippingAddress.length < 5)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mínimo 5 caracteres",
        path: ["shippingAddress"],
      });
    }
  });
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  storeName: string;
  storeLogo: string;
  locations: StoreLocation[];
  storeSlug: string;
  withPrices: boolean;
  withShipping: boolean;
  withLocation: boolean;
}

export default function ConfirmOrderModalContent({
  open,
  onOpenChange,
  /* storeId,
  storeName, */
  storeLogo,
  locations,
  storeSlug,
  withPrices,
  withShipping,
  withLocation,
}: Props) {
  const [step, setStep] = useState<"products" | "form">("products");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { order, getOrderQuantity, getOrderTotal, clearOrder } =
    useOrderStore();
  const router = useRouter();

  // Determinar el método de entrega por defecto
  const defaultDeliveryMethod: DeliveryMethod = withLocation ? "location" : "shipping";
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(defaultDeliveryMethod);

  // Determinar si el usuario puede elegir entre ambas opciones
  const canChooseDelivery = withShipping && withLocation;

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
    resolver: zodResolver(getFormSchema(deliveryMethod)),
    mode: "onTouched",
    defaultValues: {
      fullName: savedFullName,
      phone: savedPhone,
      branchId: "",
      shippingAddress: "",
      paymentMethod: "",
    },
  });

  const branchId = watch("branchId");
  const paymentMethod = watch("paymentMethod");
  const shippingAddress = watch("shippingAddress");

  // Cargar datos del localStorage cuando se abre el modal
  useEffect(() => {
    if (open && step === "form") {
      const savedName = localStorage.getItem("customerFullName") || "";
      const savedPhone = localStorage.getItem("customerPhone") || "";

      setValue("fullName", savedName);
      setValue("phone", savedPhone);
    }
  }, [open, step, setValue]);

  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
    // Limpiar campos del método anterior
    if (method === "shipping") {
      setValue("branchId", "");
    } else {
      setValue("shippingAddress", "");
    }
    trigger();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep("products");
      setDeliveryMethod(defaultDeliveryMethod);
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
      if (deliveryMethod === "location" && data.branchId) {
        formData.append("locationId", data.branchId);
      }
      if (deliveryMethod === "shipping" && data.shippingAddress) {
        formData.append("shippingAddress", data.shippingAddress);
      }
      formData.append("paymentMethod", data.paymentMethod);
      formData.append("items", JSON.stringify(items));
      formData.append("totalAmount", totalAmount.toString());

      // Llamar a la server action
      const createdOrderId = await createOrder(formData);

      // Guardar datos del cliente en localStorage
      localStorage.setItem("customerFullName", data.fullName);
      localStorage.setItem("customerPhone", data.phone);
      localStorage.setItem("lastOrderInThisDevice", createdOrderId.toString());

      // Limpiar la orden
      clearOrder();

      // Redirigir a la orden
      router.push(`./${storeSlug}/orden/${createdOrderId}`);
      /* router.refresh(); */
    } catch (error) {
      console.error("Error al crear la orden:", error);
      // Aquí podrías mostrar un toast o mensaje de error
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full md:min-w-4xl max-w-4xl h-screen rounded-none flex flex-col p-0 border-none">
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
                : "Completa tus datos para confirmar tu orden"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {step === "products" ? (
          <div className="flex-1 flex flex-col px-2 md:px-6 overflow-hidden">
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
              branchId={branchId || ""}
              paymentMethod={paymentMethod}
              shippingAddress={shippingAddress || ""}
              locations={locations}
              deliveryMethod={deliveryMethod}
              canChooseDelivery={canChooseDelivery}
              withShipping={withShipping}
              withLocation={withLocation}
              onDeliveryMethodChange={handleDeliveryMethodChange}
              onBranchChange={(value: string) => {
                setValue("branchId", value);
                trigger("branchId");
              }}
              onPaymentMethodChange={(value: string) => {
                setValue("paymentMethod", value);
                trigger("paymentMethod");
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

        {isSubmitting && (
          <div className="absolute inset-0 bg-teal-600/80 flex flex-col items-center justify-center z-50">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="text-3xl font-semibold text-white">
              Creando orden...
            </p>
            <p className="text-lg text-white/90 mt-2">
              Aguarda unos momentos por favor...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
