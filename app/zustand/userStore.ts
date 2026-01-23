import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@prisma/client";

interface UserProfile {
  email: string;
  name?: string;
  avatar?: string;
  role?: Role;
}

interface UserStore {
  user: UserProfile | null;
  isAdminSupremo: boolean;
  setUser: (user: UserProfile | null) => void;
  setRole: (role: Role) => void;
  clearUser: () => void;
  getInitials: () => string;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAdminSupremo: false,
      setUser: (user) => set({ 
        user,
        isAdminSupremo: user?.role === Role.ADMIN_SUPREMO,
      }),
      setRole: (role) => {
        const user = get().user;
        set({
          user: user ? { ...user, role } : null,
          isAdminSupremo: role === Role.ADMIN_SUPREMO,
        });
      },
      clearUser: () => set({ user: null, isAdminSupremo: false }),
      getInitials: () => {
        const user = get().user;
        if (!user) return "U";

        // Si hay nombre, usar las iniciales del nombre
        if (user.name) {
          const names = user.name.trim().split(" ");
          if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
          }
          return names[0][0].toUpperCase();
        }

        // Si solo hay email, usar la primera letra
        return user.email?.charAt(0).toUpperCase() || "U";
      },
    }),
    {
      name: "user-storage",
    }
  )
);
