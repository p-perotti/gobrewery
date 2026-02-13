"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { ThemeToggle } from "@/components/app/theme-toggle";

export function AppHeader() {
  const router = useRouter();
  const { user, signOut } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      signOut: state.signOut,
    }))
  );

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  return (
    <header className="flex items-center justify-between border-b bg-card/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          GoBrewery
        </p>
        <h1 className="text-xl font-semibold">Gestão da cervejaria</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar?.url ?? undefined} />
                <AvatarFallback>
                  {(user?.name ?? "GB").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name ?? "Usuário"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              Ver perfil
            </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                Sair
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
