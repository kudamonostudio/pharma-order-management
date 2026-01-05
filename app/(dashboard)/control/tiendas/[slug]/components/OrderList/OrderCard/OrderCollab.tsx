import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrderCollabProps {
  collab: {
    id: string | number;
    firstName?: string;
    lastName?: string;
    image?: string | null;
    variant?: "default" | "small";
  };
}

export const OrderCollab = ({ collab }: OrderCollabProps) => {
  const imageUrl = collab.image;
  const initials = `${collab.firstName?.charAt(0) ?? ""}${
    collab.lastName?.charAt(0) ?? ""
  }`;

  const styles = collab.variant === "small" ? "w-10 h-10" : "w-12 h-12";
  return (
    <Avatar
      className={`shadow-sm border-2 border-background ring-1 ring-border ${styles}`}
      key={collab.id}
    >
      {imageUrl && (
        <AvatarImage
          src={imageUrl}
          alt="Avatar"
          className="rounded-full object-cover object-top"
        />
      )}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
