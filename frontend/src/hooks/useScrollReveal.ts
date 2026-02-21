import { useRef } from 'react';
import { useInView } from 'framer-motion';

export const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return { ref, isInView };
};
