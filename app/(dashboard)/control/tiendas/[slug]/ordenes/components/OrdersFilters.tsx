"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
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

interface OrdersFiltersProps {
  storeSlug: string;
  availableCollaborators: CollaboratorOption[];
  currentStatus?: string;
  currentCollaboratorId?: string;
}

export function OrdersFilters({
  storeSlug,
  availableCollaborators,
  currentStatus,
  currentCollaboratorId,
}: OrdersFiltersProps) {
  const ALL_OPTION_VALUE = "ALL";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters
  const [localStatus, setLocalStatus] = useState<string>(
    currentStatus || "PENDIENTE"
  );
  const [localCollaboratorId, setLocalCollaboratorId] = useState<string>(
    currentCollaboratorId || ALL_OPTION_VALUE
  );
  const [collaboratorSearchValue, setCollaboratorSearchValue] = useState("");
  const [collaboratorOpen, setCollaboratorOpen] = useState(false);

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

    // Handle status filter
    if (localStatus && localStatus !== ALL_OPTION_VALUE) {
      params.set("status", localStatus);
    } else {
      params.delete("status");
    }

    // Handle collaborator filter
    if (localCollaboratorId && localCollaboratorId !== ALL_OPTION_VALUE) {
      params.set("collaboratorId", localCollaboratorId);
    } else {
      params.delete("collaboratorId");
    }

    const query = params.toString();
    const url = query
      ? `/control/tiendas/${storeSlug}/ordenes?${query}`
      : `/control/tiendas/${storeSlug}/ordenes`;

    router.push(url);
  }, [localStatus, localCollaboratorId, searchParams, storeSlug, router]);

  const handleStatusChange = (value: string) => {
    setLocalStatus(value);
  };

  const handleCollaboratorSelect = (collaboratorId: string) => {
    setLocalCollaboratorId(collaboratorId);
    setCollaboratorOpen(false);
    setCollaboratorSearchValue("");
  };

  // Filter collaborators based on search
  const filteredCollaborators = availableCollaborators.filter((collab) =>
    `${collab.firstName} ${collab.lastName}`
      .toLowerCase()
      .includes(collaboratorSearchValue.toLowerCase())
  );

  // Get selected collaborator for display
  const selectedCollaborator = availableCollaborators.find(
    (collab) => String(collab.id) === localCollaboratorId
  );

  const statusOptions = Object.keys(
    ORDER_STATUS_LABELS
  ) as DashboardOrderStatus[];

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-end">
      <div className="flex-1 space-y-1">
        <Label htmlFor="status-filter">Filtrar por estado</Label>
        <Select onValueChange={handleStatusChange} value={localStatus}>
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

      <div className="shrink-0">
        <Button onClick={applyFilters} className="w-full lg:w-auto">
          Filtrar
        </Button>
      </div>
    </div>
  );
}
