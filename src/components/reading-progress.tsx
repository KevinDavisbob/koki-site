"use client";

import { useEffect, useState } from "react";

/** 博客正文阅读进度：顶部 4px 靛蓝细线，随滚动填充 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1" aria-hidden="true">
      <div
        className="h-full bg-indigo-600 transition-[width] duration-100 ease-out dark:bg-indigo-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
