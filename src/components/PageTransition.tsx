import { motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { type ReactNode } from "react";

/** The mist covers the old route before AnimatePresence mounts the next one. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: reducedMotion ? 1 : 0.98 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: reducedMotion ? 1 : 0.98 }}
      transition={{ duration: reducedMotion ? 0 : 0.28 }}
    >
      {children}
      {!reducedMotion &&
        createPortal(
          <motion.div
            aria-hidden="true"
            className="route-mist"
            initial="covered"
            animate="clear"
            exit="covered"
            variants={{
              covered: {
                opacity: 1,
                transition: { duration: 0.42, ease: "easeIn" },
              },
              clear: {
                opacity: 0,
                transition: { duration: 1.05, ease: "easeOut" },
              },
            }}
          >
            <div className="route-mist-wordmark"><span>Đà Lạt</span><small>Qua một miền mây</small></div>
            <motion.div
              className="route-mist-layer route-mist-layer-back"
              variants={{
                covered: {
                  x: "0%",
                  y: "0%",
                  scale: 1,
                  transition: { duration: 0.42 },
                },
                clear: {
                  x: "-38%",
                  y: "-6%",
                  scale: 1.08,
                  transition: { duration: 1.05, ease: "easeOut" },
                },
              }}
            />
            <motion.div
              className="route-mist-layer route-mist-layer-front"
              variants={{
                covered: {
                  x: "0%",
                  y: "0%",
                  scale: 1,
                  transition: { duration: 0.42 },
                },
                clear: {
                  x: "38%",
                  y: "7%",
                  scale: 1.12,
                  transition: { duration: 1.05, ease: "easeOut" },
                },
              }}
            />
          </motion.div>,
          document.body,
        )}
    </motion.div>
  );
}
