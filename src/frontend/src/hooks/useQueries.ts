import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, MediaType } from "../backend";
import type { LoveLetter, Media } from "../backend";
import { useActor } from "./useActor";

// ── Love Letters ────────────────────────────────────────────────────────────

export function useGetAllLoveLetters() {
  const { actor, isFetching } = useActor();
  return useQuery<LoveLetter[]>({
    queryKey: ["loveLetters"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLoveLettersByCreationDate();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLoveLetter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; body: string }) => {
      if (!actor) throw new Error("Not connected");
      const id = crypto.randomUUID();
      const letter: LoveLetter = {
        id,
        title: data.title,
        body: data.body,
        creationDate: BigInt(Date.now()) * BigInt(1_000_000),
      };
      await actor.createLoveLetter(letter);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loveLetters"] }),
  });
}

export function useUpdateLoveLetter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      body: string;
      creationDate: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      const letter: LoveLetter = {
        id: data.id,
        title: data.title,
        body: data.body,
        creationDate: data.creationDate,
      };
      await actor.updateLoveLetter(data.id, letter);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loveLetters"] }),
  });
}

export function useDeleteLoveLetter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteLoveLetter(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loveLetters"] }),
  });
}

// ── Media ────────────────────────────────────────────────────────────────────

export function useGetAllMedia() {
  const { actor, isFetching } = useActor();
  return useQuery<Media[]>({
    queryKey: ["media"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMediaByCreationDate();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMedia() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      mediaType: MediaType;
      fileBytes: Uint8Array<ArrayBuffer>;
      onProgress?: (pct: number) => void;
    }) => {
      if (!actor) throw new Error("Not connected");
      const id = crypto.randomUUID();
      let blob = ExternalBlob.fromBytes(data.fileBytes);
      if (data.onProgress) blob = blob.withUploadProgress(data.onProgress);
      const media: Media = {
        id,
        title: data.title,
        description: data.description,
        blob,
        creationDate: BigInt(Date.now()) * BigInt(1_000_000),
        mediaType: data.mediaType,
      };
      await actor.createMedia(media);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteMedia(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export { MediaType };
