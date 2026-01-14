import Link from "next/link"
import { SquareArrowOutUpRight} from "lucide-react";

export const LinkToOrder = ({ store, orderId }: { store: string; orderId: number }) => {
  return (
    <Link href={`/tienda/${store}/orden/${orderId}`} target="_blank">
        <SquareArrowOutUpRight className="w-5 h-5"/>
    </Link>
  )}