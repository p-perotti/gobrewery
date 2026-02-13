import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
  id?: number;
  name?: string;
  email?: string;
  administrator?: boolean;
  guest?: boolean;
  avatar?: { url?: string } | null;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  signed: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
  setUser: (user: AuthUser) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signed: false,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      signIn: (token, user) => set({ token, user, signed: true }),
      signOut: () => set({ token: null, user: null, signed: false }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "gobrewery-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        signed: state.signed,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useIsAdmin = () =>
  useAuthStore((state) => Boolean(state.user?.administrator));

export const useIsGuest = () =>
  useAuthStore((state) => Boolean(state.user?.guest));
