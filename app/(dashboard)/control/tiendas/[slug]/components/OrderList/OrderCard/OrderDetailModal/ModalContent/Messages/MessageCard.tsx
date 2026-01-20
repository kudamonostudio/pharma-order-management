import { formatDateTime } from "@/app/utils/dates";
import { MessageBasic } from "@/shared/types/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MessageCard = ({ message }: { message: MessageBasic }) => {
  const collaborator = message.collaborator;
  const initials = collaborator
    ? `${collaborator.firstName?.charAt(0) ?? ""}${
        collaborator.lastName?.charAt(0) ?? ""
      }`
    : "";
  const fullName = collaborator
    ? `${collaborator.firstName} ${collaborator.lastName}`
    : "Usuario desconocido";

  return (
    <div className="flex gap-3 p-3 border-emerald-500/30 w-fit bg-emerald-100 border rounded-sm">
      <Avatar className="w-10 h-10 shrink-0">
        {collaborator?.image && (
          <AvatarImage
            src={collaborator.image}
            alt={fullName}
            className="object-cover"
          />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="w-fit">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-accent-foreground">
            {fullName}
          </span>
          <small className="text-muted-foreground text-xs shrink-0">
            {formatDateTime(message.createdAt)}
          </small>
        </div>
        <p className="text-sm text-foreground mt-1">{message.message}</p>
      </div>
    </div>
  );
};
