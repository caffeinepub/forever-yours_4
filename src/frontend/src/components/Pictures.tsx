import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Media } from "../backend";
import {
  MediaType,
  useCreateMedia,
  useDeleteMedia,
  useGetAllMedia,
} from "../hooks/useQueries";

export default function Pictures() {
  const { data: allMedia = [], isLoading } = useGetAllMedia();
  const photos = allMedia.filter((m) => m.mediaType === MediaType.photo);

  const createMut = useCreateMedia();
  const deleteMut = useDeleteMedia();

  const [showForm, setShowForm] = useState(false);
  const [lightbox, setLightbox] = useState<Media | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setFormTitle("");
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setShowForm(true);
  };

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!formTitle.trim() || !file) {
      toast.error("Please provide a title and select a photo.");
      return;
    }
    try {
      const bytes = new Uint8Array(
        await file.arrayBuffer(),
      ) as Uint8Array<ArrayBuffer>;
      await createMut.mutateAsync({
        title: formTitle.trim(),
        description: "",
        mediaType: MediaType.photo,
        fileBytes: bytes,
        onProgress: setUploadProgress,
      });
      toast.success("Photo added 📷");
      if (preview) URL.revokeObjectURL(preview);
      setShowForm(false);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget);
      toast.success("Photo removed.");
      if (lightbox?.id === deleteTarget) setLightbox(null);
    } catch {
      toast.error("Could not delete.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-playfair text-2xl font-semibold">Pictures</h2>
        </div>
        <Button
          data-ocid="pictures.open_modal_button"
          onClick={openCreate}
          className="btn-rose gap-2"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </Button>
      </div>

      {isLoading ? (
        <div
          className="grid gap-3 grid-cols-2 sm:grid-cols-3"
          data-ocid="pictures.loading_state"
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl bg-border" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div
          data-ocid="pictures.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-primary/40" />
          <p className="font-playfair text-xl italic">No photos yet…</p>
          <p className="text-sm mt-2">Capture your most beautiful moments 📷</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {photos.map((item, idx) => (
            <motion.div
              key={item.id}
              data-ocid={`pictures.item.${idx + 1}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="group relative aspect-square card-romantic overflow-hidden cursor-pointer p-0"
              onClick={() => setLightbox(item)}
            >
              <img
                src={item.blob.getDirectURL()}
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium truncate">
                  {item.title}
                </p>
              </div>
              <button
                type="button"
                data-ocid={`pictures.delete_button.${idx + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(item.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            data-ocid="pictures.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.blob.getDirectURL()}
                alt={lightbox.title}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="mt-3 text-white text-center">
                <p className="font-playfair text-lg">{lightbox.title}</p>
              </div>
              <button
                type="button"
                data-ocid="pictures.close_button"
                onClick={() => setLightbox(null)}
                className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 text-foreground hover:bg-primary/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          data-ocid="pictures.dialog"
          className="max-w-md bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl">
              Add Photo 📷
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                data-ocid="pictures.input"
                placeholder="A beautiful memory…"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Photo</Label>
              <button
                type="button"
                data-ocid="pictures.dropzone"
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors w-full text-left"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="p-8 text-center">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to choose a photo
                    </p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
                />
              </button>
            </div>
            {createMut.isPending && uploadProgress > 0 && (
              <div data-ocid="pictures.loading_state" className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Uploading… {uploadProgress}%
                </p>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="pictures.cancel_button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="pictures.submit_button"
              onClick={handleSubmit}
              disabled={createMut.isPending}
              className="btn-rose"
            >
              {createMut.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {createMut.isPending ? "Uploading…" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent
          data-ocid="pictures.modal"
          className="bg-card border-border"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair">
              Remove this photo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="pictures.cancel_button">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="pictures.delete_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
