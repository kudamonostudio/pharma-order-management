import ConfirmOrderModalContent from "./ConfirmOrderModalContent";
import { StoreLocation } from "@/app/types/store";

interface ConfirmOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  storeName: string;
  storeLogo: string;
  locations: StoreLocation[];
  storeSlug: string;
}

export default function ConfirmOrderModal({ open, onOpenChange, storeId, storeName, storeLogo, locations, storeSlug }: ConfirmOrderModalProps) {
  return <ConfirmOrderModalContent open={open} onOpenChange={onOpenChange} storeId={storeId} storeName={storeName} storeLogo={storeLogo} locations={locations} storeSlug={storeSlug} />;
}
