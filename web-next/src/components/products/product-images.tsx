"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProductImages({
  productId,
  isGuest = false,
}: {
  productId: string;
  isGuest?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const imagesQuery = useQuery({
    queryKey: queryKeys.productImages(productId),
    queryFn: async () => {
      const response = await api.get(`products/${productId}/images`);
      return response.data ?? [];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.append("file", file);
      await api.post(`products/${productId}/images`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productImages(productId) });
      toast.success("Imagem salva com sucesso.");
    },
    onError: () => toast.error("Não foi possível salvar a imagem."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      await api.delete(`products/${productId}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productImages(productId) });
      toast.success("Imagem excluída com sucesso.");
      setPendingDelete(null);
    },
    onError: () => toast.error("Não foi possível excluir a imagem."),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Imagens</h2>
        <Button size="sm" onClick={() => fileRef.current?.click()} disabled={isGuest}>
          <ImagePlus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (isGuest) {
              toast.warning("Visitantes não podem enviar imagens.");
              return;
            }
            if (file) uploadMutation.mutate(file);
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(imagesQuery.data ?? []).map((image: any) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative">
              <img src={image.url} alt={image.id} className="h-48 w-full object-cover" />
              <button
                className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow"
                onClick={() => {
                  if (isGuest) {
                    toast.warning("Visitantes não podem excluir imagens.");
                    return;
                  }
                  setPendingDelete(image.id);
                }}
                disabled={isGuest}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={pendingDelete !== null} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirma a exclusão da imagem?</DialogTitle>
            <DialogDescription>
              Essa operação é permanente e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Voltar
            </Button>
            <Button
              onClick={() => {
                if (pendingDelete) deleteMutation.mutate(pendingDelete);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
