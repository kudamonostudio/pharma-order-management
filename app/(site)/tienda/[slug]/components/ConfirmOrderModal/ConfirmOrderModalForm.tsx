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

interface FormData {
  fullName: string;
  phone: string;
  branchId: string;
}

interface ConfirmOrderModalFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  branchId: string;
  locations: StoreLocation[];
  onBranchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ConfirmOrderModalForm({
  register,
  errors,
  branchId,
  locations,
  onBranchChange,
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
    </form>
  );
}
