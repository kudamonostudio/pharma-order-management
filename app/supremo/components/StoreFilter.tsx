"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface StoreFilterProps {
  value: "all" | "active" | "inactive";
  onChange: (value: "all" | "active" | "inactive") => void;
}

export function StoreFilter({ value, onChange }: StoreFilterProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onChange(val as "all" | "active" | "inactive");
      }}
      className="gap-0"
    >
      <ToggleGroupItem
        value="all"
        variant="outline"
        className="rounded-r-none focus:z-10 data-[state=on]:z-10 data-[state=on]:bg-black data-[state=on]:text-white cursor-pointer"
      >
        Todas
      </ToggleGroupItem>
      <ToggleGroupItem
        value="active"
        variant="outline"
        className="rounded-none border-l-0 focus:z-10 data-[state=on]:z-10 data-[state=on]:bg-emerald-600 data-[state=on]:text-white data-[state=on]:border-emerald-600 cursor-pointer"
      >
        Activas
      </ToggleGroupItem>
      <ToggleGroupItem
        value="inactive"
        variant="outline"
        className="rounded-l-none border-l-0 focus:z-10 data-[state=on]:z-10 cursor-pointer"
      >
        Inactivas
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
