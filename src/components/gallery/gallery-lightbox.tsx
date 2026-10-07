"use client";

import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { GalleryPhoto } from "@/types/domain";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_LEVELS = [1, 1.25, 1.5, 2, 3, 4] as const;
const ZOOM_INDICATOR_DURATION = 800;
const SWIPE_THRESHOLD = 52;
const SWIPE_DIRECTION_RATIO = 1.15;

type Point = {
  x: number;
  y: number;
};

type ViewState = {
  scale: number;
  x: number;
  y: number;
};

type ViewUpdater = ViewState | ((current: ViewState) => ViewState);

type NaturalSize = {
  width: number;
  height: number;
};

type ImageMetrics = {
  stageWidth: number;
  stageHeight: number;
  baseWidth: number;
  baseHeight: number;
};

type PinchState = {
  startDistance: number;
  startScale: number;
  startPanX: number;
  startPanY: number;
  focalX: number;
  focalY: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startPanX: number;
  startPanY: number;
};

type SwipeState = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
};

type GalleryLightboxProps = {
  photos: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.45,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0.45,
  }),
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDistance(first: Point, second: Point) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function getMidpoint(first: Point, second: Point): Point {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function getNextZoom(current: number, direction: -1 | 1) {
  if (direction > 0) {
    return ZOOM_LEVELS.find((level) => level > current) ?? ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  }

  return [...ZOOM_LEVELS].reverse().find((level) => level < current) ?? ZOOM_LEVELS[0];
}

function clampPan(pan: Point, scale: number, metrics: ImageMetrics) {
  const maxX = Math.max(0, (metrics.baseWidth * scale - metrics.stageWidth) / 2);
  const maxY = Math.max(0, (metrics.baseHeight * scale - metrics.stageHeight) / 2);

  return {
    x: clamp(pan.x, -maxX, maxX),
    y: clamp(pan.y, -maxY, maxY),
  };
}

export function GalleryLightbox({ photos, index, onClose, onIndexChange }: GalleryLightboxProps) {
  const [view, setViewState] = useState<ViewState>({ scale: MIN_SCALE, x: 0, y: 0 });
  const [slideDirection, setSlideDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomIndicatorVisible, setZoomIndicatorVisible] = useState(false);
  const viewRef = useRef(view);
  const stageRef = useRef<HTMLDivElement>(null);
  const naturalSizeRef = useRef<NaturalSize | null>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const pinchRef = useRef<PinchState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const swipeRef = useRef<SwipeState | null>(null);
  const zoomIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelFrameRef = useRef<number | null>(null);
  const wheelPointRef = useRef<Point>({ x: 0, y: 0 });

  const photo = index === null ? null : photos[index] ?? null;
  const open = Boolean(photo);
  const downloadName = photo?.src.split("/").pop() ?? "gallery-photo.jpg";

  const setView = useCallback((updater: ViewUpdater) => {
    setViewState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      viewRef.current = next;
      return next;
    });
  }, []);

  const getImageMetrics = useCallback((): ImageMetrics | null => {
    const stage = stageRef.current;
    if (!stage) return null;

    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    if (!stageWidth || !stageHeight) return null;

    const naturalSize = naturalSizeRef.current;
    const aspectRatio = naturalSize ? naturalSize.width / naturalSize.height : stageWidth / stageHeight;

    let baseWidth = stageWidth;
    let baseHeight = baseWidth / aspectRatio;

    if (baseHeight > stageHeight) {
      baseHeight = stageHeight;
      baseWidth = baseHeight * aspectRatio;
    }

    return { stageWidth, stageHeight, baseWidth, baseHeight };
  }, []);

  const hideZoomIndicator = useCallback(() => {
    if (zoomIndicatorTimerRef.current !== null) {
      clearTimeout(zoomIndicatorTimerRef.current);
      zoomIndicatorTimerRef.current = null;
    }
    setZoomIndicatorVisible(false);
  }, []);

  const showZoomIndicator = useCallback(() => {
    setZoomIndicatorVisible(true);
    if (zoomIndicatorTimerRef.current !== null) clearTimeout(zoomIndicatorTimerRef.current);
    zoomIndicatorTimerRef.current = setTimeout(() => {
      zoomIndicatorTimerRef.current = null;
      setZoomIndicatorVisible(false);
    }, ZOOM_INDICATOR_DURATION);
  }, []);

  const resetView = useCallback(() => {
    setView({ scale: MIN_SCALE, x: 0, y: 0 });
    pointersRef.current.clear();
    pinchRef.current = null;
    dragRef.current = null;
    swipeRef.current = null;
    setIsDragging(false);
    hideZoomIndicator();
  }, [hideZoomIndicator, setView]);

  const applyScaleAt = useCallback(
    (nextScale: number, focalPoint: Point, baseView: ViewState) => {
      const metrics = getImageMetrics();
      if (!metrics) {
        setView({ ...baseView, scale: nextScale });
        return;
      }

      const center = { x: metrics.stageWidth / 2, y: metrics.stageHeight / 2 };
      const currentImageCenter = { x: center.x + baseView.x, y: center.y + baseView.y };
      const ratio = nextScale / baseView.scale;
      const nextImageCenter = {
        x: focalPoint.x - (focalPoint.x - currentImageCenter.x) * ratio,
        y: focalPoint.y - (focalPoint.y - currentImageCenter.y) * ratio,
      };
      const nextPan = clampPan(
        { x: nextImageCenter.x - center.x, y: nextImageCenter.y - center.y },
        nextScale,
        metrics,
      );

      setView({ scale: nextScale, x: nextPan.x, y: nextPan.y });
    },
    [getImageMetrics, setView],
  );

  const zoomByStep = useCallback(
    (direction: -1 | 1, clientPoint?: Point) => {
      const current = viewRef.current;
      const nextScale = getNextZoom(current.scale, direction);
      const stage = stageRef.current;
      const stageRect = stage?.getBoundingClientRect();
      const focalPoint = stageRect
        ? clientPoint
          ? { x: clientPoint.x - stageRect.left, y: clientPoint.y - stageRect.top }
          : { x: stageRect.width / 2, y: stageRect.height / 2 }
        : { x: 0, y: 0 };

      if (nextScale !== current.scale) applyScaleAt(nextScale, focalPoint, current);
      showZoomIndicator();
    },
    [applyScaleAt, showZoomIndicator],
  );

  const goTo = useCallback(
    (delta: number) => {
      if (index === null || photos.length === 0) return;
      resetView();
      naturalSizeRef.current = null;
      setSlideDirection(delta > 0 ? 1 : -1);
      onIndexChange((index + delta + photos.length) % photos.length);
    },
    [index, onIndexChange, photos.length, resetView],
  );

  const handleClose = useCallback(() => {
    resetView();
    naturalSizeRef.current = null;
    onClose();
  }, [onClose, resetView]);

  useEffect(() => {
    if (!open) return;

    const handleWheel = (event: WheelEvent) => {
      const stage = stageRef.current;
      if (!stage || !(event.target instanceof Node) || !stage.contains(event.target)) return;
      if (event.deltaY === 0) return;

      event.preventDefault();
      const direction = event.deltaY < 0 ? 1 : -1;
      wheelPointRef.current = { x: event.clientX, y: event.clientY };

      if (wheelFrameRef.current !== null) return;

      wheelFrameRef.current = window.requestAnimationFrame(() => {
        wheelFrameRef.current = null;
        zoomByStep(direction, wheelPointRef.current);
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      if (wheelFrameRef.current !== null) {
        window.cancelAnimationFrame(wheelFrameRef.current);
        wheelFrameRef.current = null;
      }
    };
  }, [open, zoomByStep]);

  useEffect(
    () => () => {
      if (zoomIndicatorTimerRef.current !== null) clearTimeout(zoomIndicatorTimerRef.current);
      if (wheelFrameRef.current !== null) window.cancelAnimationFrame(wheelFrameRef.current);
    },
    [],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      const stage = stageRef.current;
      if (!first || !second || !stage) return;

      const stageRect = stage.getBoundingClientRect();
      const midpoint = getMidpoint(first, second);
      const current = viewRef.current;

      pinchRef.current = {
        startDistance: getDistance(first, second),
        startScale: current.scale,
        startPanX: current.x,
        startPanY: current.y,
        focalX: midpoint.x - stageRect.left,
        focalY: midpoint.y - stageRect.top,
      };
      dragRef.current = null;
      swipeRef.current = null;
      setIsDragging(false);
      return;
    }

    const current = viewRef.current;

    if (current.scale > MIN_SCALE) {
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPanX: current.x,
        startPanY: current.y,
      };
      setIsDragging(true);
      return;
    }

    if (event.pointerType !== "mouse") {
      swipeRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
      };
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;

    event.stopPropagation();
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const [first, second] = Array.from(pointersRef.current.values());
      if (!first || !second || pinchRef.current.startDistance === 0) return;

      const nextScale = clamp(
        pinchRef.current.startScale * (getDistance(first, second) / pinchRef.current.startDistance),
        MIN_SCALE,
        MAX_SCALE,
      );
      applyScaleAt(nextScale, { x: pinchRef.current.focalX, y: pinchRef.current.focalY }, {
        scale: pinchRef.current.startScale,
        x: pinchRef.current.startPanX,
        y: pinchRef.current.startPanY,
      });
      showZoomIndicator();
      return;
    }

    const drag = dragRef.current;
    if (drag?.pointerId === event.pointerId) {
      const metrics = getImageMetrics();
      if (!metrics || viewRef.current.scale <= MIN_SCALE) return;

      const nextPan = clampPan(
        {
          x: drag.startPanX + event.clientX - drag.startX,
          y: drag.startPanY + event.clientY - drag.startY,
        },
        viewRef.current.scale,
        metrics,
      );
      setView((current) => ({ ...current, x: nextPan.x, y: nextPan.y }));
      return;
    }

    const swipe = swipeRef.current;
    if (swipe?.pointerId === event.pointerId) {
      swipeRef.current = { ...swipe, lastX: event.clientX, lastY: event.clientY };
    }
  };

  const finishPointer = (event: PointerEvent<HTMLDivElement>, commitSwipe: boolean) => {
    event.stopPropagation();

    const swipe = swipeRef.current;
    if (commitSwipe && swipe?.pointerId === event.pointerId) {
      const deltaX = swipe.lastX - swipe.startX;
      const deltaY = swipe.lastY - swipe.startY;
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * SWIPE_DIRECTION_RATIO) {
        goTo(deltaX < 0 ? 1 : -1);
      }
      swipeRef.current = null;
    }

    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }

    pointersRef.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (pointersRef.current.size < 2) pinchRef.current = null;

    if (pointersRef.current.size === 1 && viewRef.current.scale > MIN_SCALE) {
      const [pointerId, point] = Array.from(pointersRef.current.entries())[0] ?? [];
      if (typeof pointerId === "number" && point) {
        dragRef.current = {
          pointerId,
          startX: point.x,
          startY: point.y,
          startPanX: viewRef.current.x,
          startPanY: viewRef.current.y,
        };
        setIsDragging(true);
      }
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <AnimatePresence>
        {open && photo ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 z-[80] bg-foreground/60 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              onKeyDown={handleKeyDown}
              className="focus-visible:outline-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleClose}
                className="fixed inset-0 z-[90] flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden text-card focus-visible:outline-none"
              >
                <DialogPrimitive.Title className="sr-only">{photo.title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  {photo.date}。使用左右方向键切换照片，按 Escape 关闭。
                </DialogPrimitive.Description>

                <div className="z-10 flex shrink-0 items-start justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-5">
                  <div
                    className="min-w-0 rounded-lg border border-white/15 bg-foreground/45 px-3 py-2 shadow-subtle backdrop-blur"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="truncate text-sm font-medium text-white">{photo.title}</p>
                    <p className="mt-0.5 text-xs text-white/70">{photo.date}</p>
                  </div>
                  <DialogPrimitive.Close asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="关闭预览"
                      onClick={(event) => event.stopPropagation()}
                      className="size-11 shrink-0 bg-foreground/45 text-white hover:bg-foreground/65 hover:text-white"
                    >
                      <X className="size-5" />
                    </Button>
                  </DialogPrimitive.Close>
                </div>

                <div className="flex min-h-0 flex-1 items-center justify-center px-3 py-3 sm:px-8">
                  <div
                    ref={stageRef}
                    className={cn(
                      "relative h-full w-full max-w-[90rem] touch-none select-none overflow-hidden",
                      view.scale > MIN_SCALE ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
                    )}
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={(event) => finishPointer(event, true)}
                    onPointerCancel={(event) => finishPointer(event, false)}
                  >
                    <AnimatePresence initial={false} custom={slideDirection}>
                      <motion.div
                        key={photo.id}
                        custom={slideDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        <div
                          className="absolute inset-0 will-change-transform"
                          style={{
                            transform: `translate3d(${view.x}px, ${view.y}px, 0)`,
                            transition: isDragging ? "none" : "transform 200ms ease-out",
                          }}
                        >
                          <div
                            className="relative h-full w-full will-change-transform"
                            style={{
                              transform: `scale(${view.scale})`,
                              transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                          >
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              priority
                              draggable={false}
                              sizes="100vw"
                              onLoad={(event) => {
                                naturalSizeRef.current = {
                                  width: event.currentTarget.naturalWidth,
                                  height: event.currentTarget.naturalHeight,
                                };
                              }}
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                    <AnimatePresence>
                      {zoomIndicatorVisible ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="rounded-lg border border-white/15 bg-foreground/55 px-3 py-1.5 text-sm font-medium text-white shadow-subtle backdrop-blur"
                        >
                          {Math.round(view.scale * 100)}%
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="z-10 flex shrink-0 justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-5">
                  <div
                    className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-xl border border-white/15 bg-foreground/45 p-1.5 shadow-soft backdrop-blur"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="上一张"
                      onClick={() => goTo(-1)}
                      className="size-11 text-white hover:bg-white/15 hover:text-white"
                    >
                      <ChevronLeft className="size-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="缩小"
                      disabled={view.scale <= MIN_SCALE}
                      onClick={() => zoomByStep(-1)}
                      className="size-11 text-white hover:bg-white/15 hover:text-white"
                    >
                      <ZoomOut className="size-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="恢复默认比例"
                      disabled={view.scale <= MIN_SCALE}
                      onClick={resetView}
                      className="size-11 text-white hover:bg-white/15 hover:text-white"
                    >
                      <RotateCcw className="size-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="放大"
                      disabled={view.scale >= MAX_SCALE}
                      onClick={() => zoomByStep(1)}
                      className="size-11 text-white hover:bg-white/15 hover:text-white"
                    >
                      <ZoomIn className="size-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="下一张"
                      onClick={() => goTo(1)}
                      className="size-11 text-white hover:bg-white/15 hover:text-white"
                    >
                      <ChevronRight className="size-5" />
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="size-11 text-white hover:bg-white/15 hover:text-white">
                      <a href={photo.src} download={downloadName} aria-label="下载照片" onClick={(event) => event.stopPropagation()}>
                        <Download className="size-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
