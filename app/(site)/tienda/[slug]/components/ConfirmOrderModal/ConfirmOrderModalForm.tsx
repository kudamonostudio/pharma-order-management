import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { StoreLocation } from "@/app/types/store";
import { paymentMethodOptions } from "@/app/(dashboard)/control/tiendas/[slug]/constants";
import { Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type DeliveryMethod = "location" | "shipping";

interface FormData {
  fullName: string;
  phone: string;
  branchId: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface ConfirmOrderModalFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  branchId: string;
  paymentMethod: string;
  shippingAddress: string;
  locations: StoreLocation[];
  deliveryMethod: DeliveryMethod;
  canChooseDelivery: boolean;
  withShipping: boolean;
  withLocation: boolean;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  onBranchChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ConfirmOrderModalForm({
  register,
  errors,
  branchId,
  paymentMethod,
  locations,
  deliveryMethod,
  canChooseDelivery,
  withShipping,
  withLocation,
  onDeliveryMethodChange,
  onBranchChange,
  onPaymentMethodChange,
  onSubmit,
}: ConfirmOrderModalFormProps) {
  return (
    <form
      id="order-form"
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="fullName" className="font-normal text-lg mb-3">
          Nombre Completo
        </Label>
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
        <Label htmlFor="phone" className="font-normal text-lg mb-3">
          Número de Contacto
        </Label>
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
        <Label htmlFor="paymentMethod" className="font-normal text-lg mb-3">
          Método de Pago
        </Label>
        <Select
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un método de pago" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethodOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.paymentMethod && (
          <p className="text-sm text-red-500 mt-1">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      {/* Selector de método de entrega (solo si ambas opciones están activas) */}
      {canChooseDelivery && (
        <div>
          <Label className="font-normal text-lg mb-3">
            ¿Cómo deseas recibir tu orden?
          </Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => onDeliveryMethodChange("location")}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                deliveryMethod === "location"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
              )}
            >
              <MapPin className="h-6 w-6" />
              <span className="text-sm font-medium">Retiro en sucursal</span>
            </button>
            <button
              type="button"
              onClick={() => onDeliveryMethodChange("shipping")}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                deliveryMethod === "shipping"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
              )}
            >
              <Truck className="h-6 w-6" />
              <span className="text-sm font-medium">Envío a domicilio</span>
            </button>
          </div>
        </div>
      )}

      {/* Sucursal para retirar */}
      {(withLocation && deliveryMethod === "location") && (
        <div>
          <Label htmlFor="branchId" className="font-normal text-lg mb-3">
            Sucursal para Retirar
          </Label>
          <Select
            value={branchId}
            onValueChange={onBranchChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una sucursal" />
            </SelectTrigger>
            <SelectContent>
              {locations.length === 0 ? (
                <SelectItem value="no-locations" disabled>
                  No hay sucursales disponibles
                </SelectItem>
              ) : (
                locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name} - {location.address}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.branchId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.branchId.message}
            </p>
          )}
        </div>
      )}

      {/* Dirección de envío */}
      {(withShipping && deliveryMethod === "shipping") && (
        <div>
          <Label htmlFor="shippingAddress" className="font-normal text-lg mb-3">
            Dirección de Envío
          </Label>
          <Input
            id="shippingAddress"
            placeholder="Ej: Av. 18 de Julio 1234, Apto 5"
            {...register("shippingAddress")}
          />
          {errors.shippingAddress && (
            <p className="text-sm text-red-500 mt-1">
              {errors.shippingAddress.message}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
