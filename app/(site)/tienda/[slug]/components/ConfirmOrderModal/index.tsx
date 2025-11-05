import ConfirmOrderModalContent from "./ConfirmOrderModalContent";

interface ConfirmOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConfirmOrderModal({ open, onOpenChange }: ConfirmOrderModalProps) {
  return <ConfirmOrderModalContent open={open} onOpenChange={onOpenChange} />;
}
