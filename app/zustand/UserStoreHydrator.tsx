"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "./userStore";
import { Role } from "@prisma/client";

interface UserStoreHydratorProps {
  email: string;
  name?: string;
  avatar?: string;
  role: Role;
}

export function UserStoreHydrator({ email, name, avatar, role }: UserStoreHydratorProps) {
  const setUser = useUserStore((state) => state.setUser);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      setUser({ email, name, avatar, role });
      hydrated.current = true;
    }
  }, [email, name, avatar, role, setUser]);

  return null;
}
