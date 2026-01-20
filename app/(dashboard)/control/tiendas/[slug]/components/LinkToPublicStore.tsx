import Link from "next/link"
import { SquareArrowOutUpRight} from "lucide-react";

export const LinkToPublicStore = ({ store }: { store: string }) => {
  return (
    <Link href={`/tienda/${store}`} target="_blank">
        <SquareArrowOutUpRight className="w-5 h-5"/>
    </Link>
  )}