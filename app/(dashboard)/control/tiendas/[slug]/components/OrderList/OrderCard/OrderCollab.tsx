import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrderCollabProps {
  collab: {
    id: string | number;
    image?: string | null;
    imageUrl?: string | null;
  };
}

export const OrderCollab = ({ collab }: OrderCollabProps) => {
  return (
    <Avatar
      className="shadow-sm border-2 border-background w-12 h-12 sm:w-14 sm:h-14 ring-1 ring-border"
      key={collab.id}
    >
      {collab.imageUrl && (
        <AvatarImage
          src={collab.imageUrl || "/placeholder.svg"}
          alt="Avatar"
          className="rounded-full object-cover object-top"
        />
      )}
      <AvatarFallback />
    </Avatar>
  );
};
