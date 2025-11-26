import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowAvatarsProps {
  items: {
    id: string | number;
    image?: string | null;
    imageUrl?: string | null;
  }[];
  max?: number;
  className?: string;
}

export function ShowAvatars({ items, max = 3, className }: ShowAvatarsProps) {
  const visibleItems = items.slice(0, max);
  const remainingCount = items.length - max;
  const hasMore = remainingCount > 0;

  return (
    <div className={cn("flex", className)}>
      {visibleItems.map((item) => (
        <Avatar
          className="shadow-sm border-2 border-background w-12 h-12 sm:w-14 sm:h-14 -mr-4 sm:-mr-5 ring-1 ring-border"
          key={item.id}
        >
          <AvatarImage
            src={item.image || item.imageUrl || "/placeholder.svg"}
            alt="Avatar"
            className="rounded-full object-cover"
          />
          <AvatarFallback />
        </Avatar>
      ))}
      {hasMore && (
        <Avatar className="shadow-sm border-2 border-background w-12 h-12 sm:w-14 sm:h-14 bg-muted flex items-center justify-center ring-1 ring-border">
          <Ellipsis
            className="w-6 h-auto text-muted-foreground"
            strokeWidth={2}
          />
        </Avatar>
      )}
    </div>
  );
}
