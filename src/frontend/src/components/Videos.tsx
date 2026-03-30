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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Upload, Video } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  MediaType,
  useCreateMedia,
  useDeleteMedia,
  useGetAllMedia,
} from "../hooks/useQueries";

export default function Videos() {
  const { data: allMedia = [], isLoading } = useGetAllMedia();
  const videos = allMedia.filter((m) => m.mediaType === MediaType.video);

  const createMut = useCreateMedia();
  const deleteMut = useDeleteMedia();

  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setFormTitle("");
    setFormDesc("");
    setFile(null);
    setUploadProgress(0);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formTitle.trim() || !file) {
      toast.error("Please provide a title and select a video file.");
      return;
    }
    try {
      const bytes = new Uint8Array(
        await file.arrayBuffer(),
      ) as Uint8Array<ArrayBuffer>;
      await createMut.mutateAsync({
        title: formTitle.trim(),
        description: formDesc.trim(),
        mediaType: MediaType.video,
        fileBytes: bytes,
        onProgress: setUploadProgress,
      });
      toast.success("Video uploaded 🎬");
      setShowForm(false);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget);
      toast.success("Video removed.");
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
            <Video className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-playfair text-2xl font-semibold">Videos</h2>
        </div>
        <Button
          data-ocid="videos.open_modal_button"
          onClick={openCreate}
          className="btn-rose gap-2"
        >
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {isLoading ? (
        <div
          className="grid gap-4 sm:grid-cols-2"
          data-ocid="videos.loading_state"
        >
          {[1, 2].map((i) => (
            <div key={i} className="card-romantic p-4 space-y-3">
              <Skeleton className="h-40 w-full bg-border rounded-xl" />
              <Skeleton className="h-5 w-1/2 bg-border" />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div
          data-ocid="videos.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Video className="w-12 h-12 mx-auto mb-4 text-primary/40" />
          <p className="font-playfair text-xl italic">No videos yet…</p>
          <p className="text-sm mt-2">Share a beautiful moment together 🎬</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((item, idx) => (
            <motion.div
              key={item.id}
              data-ocid={`videos.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="card-romantic p-4"
            >
              <video
                controls
                src={item.blob.getDirectURL()}
                className="w-full rounded-xl mb-3 max-h-52 object-cover bg-muted"
              >
                <track kind="captions" />
              </video>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-playfair text-lg font-medium">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid={`videos.delete_button.${idx + 1}`}
                  onClick={() => setDeleteTarget(item.id)}
                  className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          data-ocid="videos.dialog"
          className="max-w-md bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl">
              Add Video 🎬
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                data-ocid="videos.input"
                placeholder="Our magical moment…"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Textarea
                data-ocid="videos.textarea"
                placeholder="Describe this memory…"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={2}
                className="border-border resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Video File</Label>
              <button
                type="button"
                data-ocid="videos.dropzone"
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors w-full"
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "Click to choose a video file"}
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </button>
            </div>
            {createMut.isPending && uploadProgress > 0 && (
              <div data-ocid="videos.loading_state" className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Uploading… {uploadProgress}%
                </p>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="videos.cancel_button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="videos.submit_button"
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
          data-ocid="videos.modal"
          className="bg-card border-border"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair">
              Remove this video?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="videos.cancel_button">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="videos.delete_button"
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
