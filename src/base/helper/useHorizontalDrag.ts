import { useRef, useState, useEffect } from "react";

export function useHorizontalDrag() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
      const walk = (x - startX) * 1.5;
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
      const walk = (x - startX) * 1.5;
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft - walk;
      }
    };

    const stopDrag = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", stopDrag);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging, startX, scrollLeft]);

  return {
    scrollRef,
    isDragging,
    setIsDragging,
    onMouseDown,
    onTouchStart,
  };
}
