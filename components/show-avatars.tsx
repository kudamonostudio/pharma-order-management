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
  type?: "product" | "user";
}

export function ShowAvatars({ items, max = 3, className, type = "user" }: ShowAvatarsProps) {
  const visibleItems = items.slice(0, max);
  const remainingCount = items.length - max;
  const hasMore = remainingCount > 0;

  const getImageSrc = (item: ShowAvatarsProps["items"][0]) => {
    const src = item.image || item.imageUrl;
    if (!src && type === "product") {
      return "/product-placeholder.webp";
    }
    return src || "/placeholder.svg";
  };

  return (
    <div className={cn("flex", className)}>
      {visibleItems.map((item) => {
        const imageSrc = getImageSrc(item);
        const isPlaceholder = imageSrc === "/product-placeholder.webp";
        
        return (
          <Avatar
            className="shadow-sm border-2 border-background w-12 h-12 sm:w-14 sm:h-14 -mr-4 sm:-mr-5 ring-1 ring-border bg-gray-100"
            key={item.id}
          >
            {isPlaceholder ? (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Avatar"
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            ) : (
              <>
                <AvatarImage
                  src={imageSrc}
                  alt="Avatar"
                  className="rounded-full object-cover"
                />
                <AvatarFallback />
              </>
            )}
          </Avatar>
        );
      })}
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
