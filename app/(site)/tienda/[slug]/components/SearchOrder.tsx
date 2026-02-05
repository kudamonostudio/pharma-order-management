"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [lastOrder, setLastOrder] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrderInThisDevice");
    if (savedOrder) {
      setLastOrder(savedOrder);
      setOrderNumber(savedOrder);
    }
  }, []);

  const handleSearch = () => {
    if (!orderNumber) return;

    const newUrl = `${window.location.origin}${pathname}/orden/${orderNumber}`;
    window.open(newUrl, "_blank");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center lg:items-end py-8 gap-2">
      <div className="flex gap-2 w-full max-w-md">
        <Input
          type="number"
          placeholder="Buscar por número de orden"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
      {lastOrder && (
        <div className="w-full max-w-md text-right">
          <small className="text-xs">
            Última orden en este dispositivo: #<strong>{lastOrder}</strong>
          </small>
        </div>
      )}
    </div>
  );
}
