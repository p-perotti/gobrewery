"use client";

import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Shield, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/stores/auth";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setUser, authUser, isGuest } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setUser,
      authUser: state.user,
      isGuest: Boolean(state.user?.guest),
    }))
  );

  const profileQuery = useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const response = await api.get("profile");
      return response.data;
    },
  });

  const updateAvatar = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.append("file", file);
      const response = await api.post("profile/avatar", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      setUser({ ...(profileQuery.data ?? {}), avatar: data });
      toast.success("Imagem atualizada.");
    },
    onError: () => toast.error("Não foi possível atualizar a imagem."),
  });

  const deleteAvatar = useMutation({
    mutationFn: async () => {
      await api.delete("profile/avatar");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      setUser({ ...(profileQuery.data ?? {}), avatar: null });
      toast.success("Imagem removida.");
    },
    onError: () => toast.error("Não foi possível remover a imagem."),
  });

  const profile = profileQuery.data ?? {};
  const avatarUrl = profile.avatar?.url ?? authUser?.avatar?.url ?? undefined;
  const name = profile.name ?? authUser?.name ?? "";
  const email = profile.email ?? authUser?.email ?? "";
  const isAdmin = profile.administrator ?? authUser?.administrator ?? false;

  return (
    <Card className="max-w-2xl">
      <CardContent className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Perfil
            </p>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          {isAdmin ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
              <Shield className="h-3 w-3" /> Admin
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {(name || "GB").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-2">
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={updateAvatar.isPending || isGuest}
            >
              <Camera className="mr-2 h-4 w-4" />
              {avatarUrl ? "Alterar" : "Adicionar"}
            </Button>
            {avatarUrl ? (
              <Button
                variant="destructive"
                onClick={() => deleteAvatar.mutate()}
                disabled={deleteAvatar.isPending || isGuest}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </Button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  if (isGuest) {
                    toast.warning("Visitantes não podem alterar o perfil.");
                    return;
                  }
                  updateAvatar.mutate(file);
                }
              }}
            />
          </div>
        </div>

        <div>
          {isGuest ? (
            <Button disabled>Editar perfil</Button>
          ) : (
            <Button asChild>
              <Link href="/profile/edit">Editar perfil</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
