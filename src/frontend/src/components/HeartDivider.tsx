import { Heart } from "lucide-react";

export default function HeartDivider() {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-border" />
      <Heart className="w-4 h-4 text-primary fill-primary/40" />
      <Heart className="w-3 h-3 text-primary fill-primary/60" />
      <Heart className="w-4 h-4 text-primary fill-primary/40" />
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
