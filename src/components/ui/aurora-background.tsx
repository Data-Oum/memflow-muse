import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  children,
  className,
  style,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Primary aurora layer */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 18,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            inset: "-80px",
            backgroundImage: [
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(124,58,237,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(168,85,247,0.08) 0%, transparent 60%)",
              "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(124,58,237,0.06) 0%, transparent 60%)",
            ].join(", "),
            backgroundSize: "200% 200%",
            filter: "blur(40px)",
          }}
        />

        {/* Secondary aurora layer — slower */}
        <motion.div
          animate={{
            backgroundPosition: ["100% 0%", "0% 100%", "100% 0%"],
          }}
          transition={{
            duration: 28,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            inset: "-40px",
            backgroundImage: [
              "radial-gradient(ellipse 50% 40% at 70% 60%, rgba(139,92,246,0.07) 0%, transparent 60%)",
              "radial-gradient(ellipse 40% 50% at 30% 30%, rgba(124,58,237,0.05) 0%, transparent 60%)",
            ].join(", "),
            backgroundSize: "200% 200%",
            filter: "blur(60px)",
          }}
        />

        {/* Radial vignette to keep edges dark */}
        {showRadialGradient && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 100% 100% at 50% 0%, transparent 40%, rgba(15,20,25,0.6) 100%)",
            }}
          />
        )}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
