"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useTransition } from "react";
import {
  ORDER_STATUS_LABELS,
  type OrderStatus as DashboardOrderStatus,
} from "../../constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Check, ChevronsUpDown, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CollaboratorOption {
  id: number;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
  code: string | null;
}

interface LocationOption {
  id: number;
  name: string;
}

interface OrdersFiltersProps {
  storeSlug: string;
  availableCollaborators: CollaboratorOption[];
  availableLocations: LocationOption[];
  currentStatus?: string;
  currentCollaboratorId?: string;
  currentLocationId?: string;
  canAccessBranchFilter: boolean;
  onStatusChange?: (newStatuses: string[]) => void;
}

export function OrdersFilters({
  storeSlug,
  availableCollaborators,
  availableLocations,
  currentStatus,
  currentCollaboratorId,
  currentLocationId,
  canAccessBranchFilter,
  onStatusChange,
}: OrdersFiltersProps) {
  const ALL_OPTION_VALUE = "ALL";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterPending, startFilterTransition] = useTransition();
  const [isRefreshPending, startRefreshTransition] = useTransition();

  // Local state for filters - support multiple statuses
  const [localStatus, setLocalStatus] = useState<string[]>(
    currentStatus ? currentStatus.split(",") : ["PENDIENTE"]
  );
  const [localCollaboratorId, setLocalCollaboratorId] = useState<string>(
    currentCollaboratorId || ALL_OPTION_VALUE
  );
  const [localLocationId, setLocalLocationId] = useState<string>(
    currentLocationId || ALL_OPTION_VALUE
  );
  const [collaboratorSearchValue, setCollaboratorSearchValue] = useState("");
  const [collaboratorOpen, setCollaboratorOpen] = useState(false);
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);

  // Set initial defaults if no current values
  useEffect(() => {
    if (!currentStatus && !currentCollaboratorId) {
      // Apply default filters on initial load
      const params = new URLSearchParams(searchParams.toString());
      params.set("status", "PENDIENTE");
      const query = params.toString();
      const url = `/control/tiendas/${storeSlug}/ordenes?${query}`;
      router.replace(url);
    }
  }, [currentStatus, currentCollaboratorId, searchParams, storeSlug, router]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle status filter - join array with commas
    if (localStatus && localStatus.length > 0 && !localStatus.includes(ALL_OPTION_VALUE)) {
      params.set("status", localStatus.join(","));
    } else {
      params.delete("status");
    }

    // Handle collaborator filter
    if (localCollaboratorId && localCollaboratorId !== ALL_OPTION_VALUE) {
      params.set("collaboratorId", localCollaboratorId);
    } else {
      params.delete("collaboratorId");
    }

    // Handle location filter (only if user has permission)
    if (canAccessBranchFilter && localLocationId && localLocationId !== ALL_OPTION_VALUE) {
      params.set("locationId", localLocationId);
    } else {
      params.delete("locationId");
    }

    const query = params.toString();
    const url = query
      ? `/control/tiendas/${storeSlug}/ordenes?${query}`
      : `/control/tiendas/${storeSlug}/ordenes`;

    startFilterTransition(() => {
      router.push(url);
    });
  }, [localStatus, localCollaboratorId, localLocationId, canAccessBranchFilter, searchParams, storeSlug, router]);

  const handleStatusChange = (value: string) => {
    setLocalStatus([value]);
  };

  const handleCollaboratorSelect = (collaboratorId: string) => {
    setLocalCollaboratorId(collaboratorId);
    setCollaboratorOpen(false);
    setCollaboratorSearchValue("");
  };

  const handleLocationSelect = (locationId: string) => {
    setLocalLocationId(locationId);
    setLocationOpen(false);
    setLocationSearchValue("");
  };

  // Filter collaborators based on search
  const filteredCollaborators = availableCollaborators.filter((collab) =>
    `${collab.firstName} ${collab.lastName}`
      .toLowerCase()
      .includes(collaboratorSearchValue.toLowerCase())
  );

  // Filter locations based on search
  const filteredLocations = availableLocations.filter((location) =>
    location.name.toLowerCase().includes(locationSearchValue.toLowerCase())
  );

  // Get selected collaborator for display
  const selectedCollaborator = availableCollaborators.find(
    (collab) => String(collab.id) === localCollaboratorId
  );

  // Get selected location for display
  const selectedLocation = availableLocations.find(
    (location) => String(location.id) === localLocationId
  );

  const statusOptions = Object.keys(
    ORDER_STATUS_LABELS
  ) as DashboardOrderStatus[];

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-end">
      <div className="flex-1 space-y-1">
        <Label htmlFor="status-filter">Filtrar por estado</Label>
        <Select onValueChange={handleStatusChange} value={localStatus[0] || "PENDIENTE"}>
          <SelectTrigger id="status-filter" className="w-full">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION_VALUE}>Todos</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {ORDER_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-1">
        <Label>Filtrar por colaborador</Label>
        <Popover open={collaboratorOpen} onOpenChange={setCollaboratorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={collaboratorOpen}
              className="w-full justify-between"
            >
              {selectedCollaborator ? (
                <div className="flex gap-2 items-center">
                  <Avatar className="shadow-sm border-2 border-background w-6 h-6 ring-1 ring-border bg-gray-100">
                    <>
                      <AvatarImage
                        src={selectedCollaborator.image ?? undefined}
                        alt="Avatar"
                        className="rounded-full object-cover"
                      />
                      <AvatarFallback />
                    </>
                  </Avatar>
                  {selectedCollaborator.firstName} {selectedCollaborator.lastName}
                </div>
              ) : localCollaboratorId === ALL_OPTION_VALUE ? (
                "Todos"
              ) : (
                "Seleccionar colaborador..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Buscar colaborador..."
                value={collaboratorSearchValue}
                onValueChange={setCollaboratorSearchValue}
              />
              <CommandList>
                <CommandEmpty>No se encontraron colaboradores.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleCollaboratorSelect(ALL_OPTION_VALUE)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        localCollaboratorId === ALL_OPTION_VALUE
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    Todos
                  </CommandItem>
                  {filteredCollaborators.map((collab) => (
                    <CommandItem
                      key={collab.id}
                      onSelect={() =>
                        handleCollaboratorSelect(String(collab.id))
                      }
                      className={cn("cursor-pointer",
                        localCollaboratorId === String(collab.id) ? "bg-green-100": ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 items-center",
                          localCollaboratorId === String(collab.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <Avatar className="shadow-sm border-2 border-background w-8 h-8 ring-1 ring-border bg-gray-100 mt-2">
                        <>
                          <AvatarImage
                            src={collab.image ?? undefined}
                            alt="Avatar"
                            className="rounded-full object-cover"
                          />
                          <AvatarFallback />
                        </>
                      </Avatar>
                      {collab.firstName} {collab.lastName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {canAccessBranchFilter && (
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
      )}

      <div className="shrink-0 flex gap-2">
        <Button 
          onClick={applyFilters} 
          className="w-full lg:w-auto"
          disabled={isFilterPending || isRefreshPending}
        >
          {isFilterPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Filtrando...
            </>
          ) : (
            "Filtrar"
          )}
        </Button>
        <Button 
          onClick={() => {
            // Reset local state
            setLocalStatus(["PENDIENTE"]);
            setLocalCollaboratorId(ALL_OPTION_VALUE);
            setLocalLocationId(ALL_OPTION_VALUE);
            setCollaboratorSearchValue("");
            setLocationSearchValue("");
            
            // Navigate with transition
            startRefreshTransition(() => {
              router.push(`/control/tiendas/${storeSlug}/ordenes?status=PENDIENTE`);
            });
          }} 
          variant="outline" 
          className="w-full lg:w-auto"
          disabled={isFilterPending || isRefreshPending}
        >
          {isRefreshPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
