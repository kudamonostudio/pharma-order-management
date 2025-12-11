import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  email: string;
  name?: string;
  avatar?: string;
}

interface UserStore {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  clearUser: () => void;
  getInitials: () => string;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
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
