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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2, Loader2, Mail, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { LoveLetter } from "../backend";
import {
  useCreateLoveLetter,
  useDeleteLoveLetter,
  useGetAllLoveLetters,
  useUpdateLoveLetter,
} from "../hooks/useQueries";

function formatDate(ns: bigint) {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function excerpt(text: string, max = 120) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function LoveLetters() {
  const { data: letters = [], isLoading } = useGetAllLoveLetters();
  const createMut = useCreateLoveLetter();
  const updateMut = useUpdateLoveLetter();
  const deleteMut = useDeleteLoveLetter();

  const [view, setView] = useState<"list" | "read">("list");
  const [selected, setSelected] = useState<LoveLetter | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LoveLetter | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");

  const openCreate = () => {
    setEditing(null);
    setFormTitle("");
    setFormBody("");
    setShowForm(true);
  };

  const openEdit = (letter: LoveLetter) => {
    setEditing(letter);
    setFormTitle(letter.title);
    setFormBody(letter.body);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formTitle.trim() || !formBody.trim()) {
      toast.error("Please fill in both the title and the letter body.");
      return;
    }
    try {
      if (editing) {
        await updateMut.mutateAsync({
          id: editing.id,
          title: formTitle.trim(),
          body: formBody.trim(),
          creationDate: editing.creationDate,
        });
        toast.success("Letter updated 💌");
      } else {
        await createMut.mutateAsync({
          title: formTitle.trim(),
          body: formBody.trim(),
        });
        toast.success("Letter saved 💌");
      }
      setShowForm(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget);
      toast.success("Letter removed.");
      if (selected?.id === deleteTarget) {
        setView("list");
        setSelected(null);
      }
    } catch {
      toast.error("Could not delete. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const isPending = createMut.isPending || updateMut.isPending;

  return (
    <div>
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-playfair text-2xl font-semibold">
                  Love Letters
                </h2>
              </div>
              <Button
                data-ocid="letters.open_modal_button"
                onClick={openCreate}
                className="btn-rose gap-2"
              >
                <Plus className="w-4 h-4" />
                Write a Letter
              </Button>
            </div>

            {/* List */}
            {isLoading ? (
              <div
                className="grid gap-4 sm:grid-cols-2"
                data-ocid="letters.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card-romantic p-6 space-y-3">
                    <Skeleton className="h-5 w-2/3 bg-border" />
                    <Skeleton className="h-4 w-full bg-border" />
                    <Skeleton className="h-4 w-4/5 bg-border" />
                    <Skeleton className="h-3 w-1/3 bg-border" />
                  </div>
                ))}
              </div>
            ) : letters.length === 0 ? (
              <div
                data-ocid="letters.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Mail className="w-12 h-12 mx-auto mb-4 text-primary/40" />
                <p className="font-playfair text-xl italic">No letters yet…</p>
                <p className="text-sm mt-2">Write your first love letter 💌</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {letters.map((letter, idx) => (
                  <motion.button
                    key={letter.id}
                    type="button"
                    data-ocid={`letters.item.${idx + 1}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="card-romantic p-6 cursor-pointer w-full text-left"
                    onClick={() => {
                      setSelected(letter);
                      setView("read");
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-playfair text-lg font-medium leading-snug flex-1">
                        {letter.title}
                      </h3>
                      <div
                        className="flex gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          data-ocid={`letters.edit_button.${idx + 1}`}
                          onClick={() => openEdit(letter)}
                          className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          data-ocid={`letters.delete_button.${idx + 1}`}
                          onClick={() => setDeleteTarget(letter.id)}
                          className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {excerpt(letter.body)}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-3">
                      {formatDate(letter.creationDate)}
                    </p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="read"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              data-ocid="letters.secondary_button"
              onClick={() => {
                setView("list");
                setSelected(null);
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to letters
            </button>
            {selected && (
              <div className="max-w-2xl mx-auto card-romantic p-10">
                <h2 className="font-playfair text-3xl font-semibold mb-2 text-center">
                  {selected.title}
                </h2>
                <p className="text-center text-xs text-muted-foreground mb-8">
                  {formatDate(selected.creationDate)}
                </p>
                <div className="w-16 h-px bg-border mx-auto mb-8" />
                <p className="font-playfair text-lg leading-[1.9] whitespace-pre-wrap text-foreground/90 italic">
                  {selected.body}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write/Edit modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          data-ocid="letters.dialog"
          className="max-w-lg bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl">
              {editing ? "Edit Letter" : "Write a Love Letter 💌"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="letter-title">Title</Label>
              <Input
                id="letter-title"
                data-ocid="letters.input"
                placeholder="My darling…"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="letter-body">Your letter</Label>
              <Textarea
                id="letter-body"
                data-ocid="letters.textarea"
                placeholder="Pour your heart out…"
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                rows={8}
                className="font-playfair italic text-base border-border focus:ring-primary leading-relaxed resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="letters.cancel_button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="letters.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
              className="btn-rose"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending
                ? "Saving…"
                : editing
                  ? "Save Changes"
                  : "Send with Love"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent
          data-ocid="letters.modal"
          className="bg-card border-border"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair">
              Delete this letter?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The letter will be lost forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="letters.cancel_button">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="letters.delete_button"
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
