import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  ImageIcon,
  Loader2,
  LogOut,
  Mail,
  Mic,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AudioMessages from "./components/AudioMessages";
import HeartDivider from "./components/HeartDivider";
import LoveLetters from "./components/LoveLetters";
import Pictures from "./components/Pictures";
import Videos from "./components/Videos";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// Decorative floating hearts
function FloatingHearts() {
  const hearts = [
    { size: 40, x: "8%", y: "12%", delay: "0s", opacity: 0.12 },
    { size: 20, x: "88%", y: "8%", delay: "1.5s", opacity: 0.16 },
    { size: 28, x: "75%", y: "55%", delay: "3s", opacity: 0.1 },
    { size: 16, x: "15%", y: "65%", delay: "2s", opacity: 0.14 },
    { size: 36, x: "50%", y: "80%", delay: "4s", opacity: 0.09 },
    { size: 14, x: "92%", y: "75%", delay: "0.8s", opacity: 0.18 },
    { size: 22, x: "3%", y: "40%", delay: "5s", opacity: 0.11 },
  ];
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      {hearts.map((h, i) => (
        <div
          key={`heart-pos-${h.x}-${h.y}`}
          className="absolute animate-float"
          style={{
            left: h.x,
            top: h.y,
            animationDelay: h.delay,
            animationDuration: `${6 + i * 1.3}s`,
            opacity: h.opacity,
          }}
        >
          <Heart
            style={{ width: h.size, height: h.size }}
            className="text-primary fill-primary"
          />
        </div>
      ))}
    </div>
  );
}

function LandingPage({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
      <FloatingHearts />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-center max-w-lg z-10"
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-white/70 backdrop-blur-sm border border-border flex items-center justify-center shadow-rose">
            <Heart className="w-10 h-10 text-primary fill-primary/60" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-playfair text-5xl sm:text-6xl font-bold text-foreground mb-4 leading-tight"
        >
          Forever Yours
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-muted-foreground text-lg sm:text-xl mb-2 font-playfair italic"
        >
          A gift from my heart to yours
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="text-muted-foreground text-sm mb-10"
        >
          Love letters, audio messages, videos &amp; pictures — all wrapped in
          love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.1,
            duration: 0.6,
            type: "spring",
            stiffness: 200,
          }}
        >
          <button
            type="button"
            data-ocid="landing.primary_button"
            onClick={onOpen}
            className="btn-rose text-base px-10 py-3 text-lg inline-flex items-center gap-3 group"
          >
            <Heart className="w-5 h-5 fill-white/60 group-hover:fill-white transition-colors" />
            Open Your Gift
            <Heart className="w-5 h-5 fill-white/60 group-hover:fill-white transition-colors" />
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          {[
            { icon: Mail, label: "Love Letters" },
            { icon: Mic, label: "Audio Messages" },
            { icon: Video, label: "Videos" },
            { icon: ImageIcon, label: "Pictures" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-border rounded-full px-4 py-2 text-sm text-foreground/70"
            >
              <Icon className="w-3.5 h-3.5 text-primary" />
              {label}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function MainApp({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingHearts />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary/60" />
            <span className="font-playfair text-xl font-semibold">
              Forever Yours
            </span>
          </div>
          <button
            type="button"
            data-ocid="nav.secondary_button"
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 z-10">
        <Tabs defaultValue="letters" className="w-full">
          <TabsList
            data-ocid="nav.tab"
            className="w-full bg-white/60 backdrop-blur-sm border border-border rounded-2xl p-1.5 h-auto flex gap-1 mb-8"
          >
            {[
              { value: "letters", icon: Mail, label: "Love Letters" },
              { value: "audio", icon: Mic, label: "Audio" },
              { value: "videos", icon: Video, label: "Videos" },
              { value: "photos", icon: ImageIcon, label: "Pictures" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`nav.${value}.tab`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-rose"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="letters" className="mt-0">
            <LoveLetters />
          </TabsContent>

          <TabsContent value="audio" className="mt-0">
            <HeartDivider />
            <AudioMessages />
          </TabsContent>

          <TabsContent value="videos" className="mt-0">
            <HeartDivider />
            <Videos />
          </TabsContent>

          <TabsContent value="photos" className="mt-0">
            <HeartDivider />
            <Pictures />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground/60 border-t border-border z-10">
        <span>
          © {new Date().getFullYear()}. Built with{" "}
          <Heart className="w-3 h-3 inline text-primary fill-primary/70 mx-0.5" />{" "}
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  const { login, clear, identity, isInitializing } = useInternetIdentity();
  const qc = useQueryClient();

  const [appPhase, setAppPhase] = useState<"landing" | "app">("landing");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isAuthenticated = !!identity;

  const handleOpen = async () => {
    if (isAuthenticated) {
      setAppPhase("app");
      return;
    }
    setIsLoggingIn(true);
    try {
      await login();
      setAppPhase("app");
    } catch (err: any) {
      if (err?.message === "User is already authenticated") {
        setAppPhase("app");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await clear();
    qc.clear();
    setAppPhase("landing");
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-4 text-muted-foreground"
          data-ocid="app.loading_state"
        >
          <Heart className="w-10 h-10 text-primary fill-primary/40 animate-pulse" />
          <p className="font-playfair italic text-lg">Loading your gift…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {appPhase === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLoggingIn ? (
              <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="font-playfair italic text-lg">
                    Opening your gift…
                  </p>
                </div>
              </div>
            ) : (
              <LandingPage onOpen={handleOpen} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MainApp onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
