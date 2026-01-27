"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
/* import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; */
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationOption {
  id: number;
  name: string;
}

interface CollaboratorsFiltersProps {
  storeSlug: string;
  availableLocations: LocationOption[];
  currentLocationId?: string;
  canAccessBranchFilter: boolean;
}

export function CollaboratorsFilters({
  storeSlug,
  availableLocations,
  currentLocationId,
  canAccessBranchFilter,
}: CollaboratorsFiltersProps) {
  const ALL_OPTION_VALUE = "ALL";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters
  const [localLocationId, setLocalLocationId] = useState<string>(
    currentLocationId || ALL_OPTION_VALUE
  );
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle location filter (only if user has permission)
    if (canAccessBranchFilter && localLocationId && localLocationId !== ALL_OPTION_VALUE) {
      params.set("locationId", localLocationId);
    } else {
      params.delete("locationId");
    }

    const query = params.toString();
    const url = query
      ? `/control/tiendas/${storeSlug}/colaboradores?${query}`
      : `/control/tiendas/${storeSlug}/colaboradores`;

    router.push(url);
  }, [localLocationId, canAccessBranchFilter, searchParams, storeSlug, router]);

  const handleLocationSelect = (locationId: string) => {
    setLocalLocationId(locationId);
    setLocationOpen(false);
    setLocationSearchValue("");
  };

  // Filter locations based on search
  const filteredLocations = availableLocations.filter((location) =>
    location.name.toLowerCase().includes(locationSearchValue.toLowerCase())
  );

  // Get selected location for display
  const selectedLocation = availableLocations.find(
    (location) => String(location.id) === localLocationId
  );

  if (!canAccessBranchFilter) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-end mb-6">
      <div className="flex-1 space-y-1">
        <Label>Filtrar por sucursal</Label>
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={locationOpen}
              className="w-full justify-between"
            >
              {selectedLocation ? (
                selectedLocation.name
              ) : localLocationId === ALL_OPTION_VALUE ? (
                "Todas las sucursales"
              ) : (
                "Seleccionar sucursal..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Buscar sucursal..."
                value={locationSearchValue}
                onValueChange={setLocationSearchValue}
              />
              <CommandList>
                <CommandEmpty>No se encontraron sucursales.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleLocationSelect(ALL_OPTION_VALUE)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        localLocationId === ALL_OPTION_VALUE
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Todas las sucursales
                  </CommandItem>
                  {filteredLocations.map((location) => (
                    <CommandItem
                      key={location.id}
                      onSelect={() =>
                        handleLocationSelect(String(location.id))
                      }
                      className={cn("cursor-pointer",
                        localLocationId === String(location.id) ? "bg-green-100": ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 items-center",
                          localLocationId === String(location.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {location.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="shrink-0">
        <Button onClick={applyFilters} className="w-full lg:w-auto">
          Filtrar
        </Button>
      </div>
    </div>
  );
}
