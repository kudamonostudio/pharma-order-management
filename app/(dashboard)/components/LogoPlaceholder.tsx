import { cn } from "@/lib/utils";

interface LogoPlaceholderProps {
  variant: "collaborator" | "store";
  isActive?: boolean;
  className?: string;
}

export const LogoPlaceholder = ({
  variant,
  isActive,
  className,
}: LogoPlaceholderProps) => {
  let backgroundClass = "";

  if (variant === "collaborator") {
    backgroundClass = "bg-gradient-to-br from-blue-600 to-cyan-400";
  } else if (variant === "store") {
    if (isActive) {
      backgroundClass = "bg-gradient-to-br from-green-600 to-emerald-400";
    } else {
      backgroundClass = "bg-gradient-to-br from-neutral-600 to-neutral-400";
    }
  }

  return (
    <div className={cn("w-20 h-20 rounded-full", backgroundClass, className)} />
  );
};
