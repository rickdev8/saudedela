"use client";

import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_TIME = 600; // ms

type LoaderProps = {
  show: boolean;
};

export function Loader({ show }: LoaderProps) {
  const [visible, setVisible] = useState(show);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    if (show) {
      shownAt.current = Date.now();
      setVisible(true);
      return;
    }

    const elapsed = shownAt.current ? Date.now() - shownAt.current : MIN_VISIBLE_TIME;
    const remaining = MIN_VISIBLE_TIME - elapsed;

    if (remaining > 0) {
      const timeout = setTimeout(() => setVisible(false), remaining);
      return () => clearTimeout(timeout);
    }

    setVisible(false);
  }, [show]);

  if (!visible) return null;

  return <div className="loader"></div>;
}