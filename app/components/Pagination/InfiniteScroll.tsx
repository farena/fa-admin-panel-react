import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
  type Ref,
} from "react";
import { useClassParser } from "~/hooks/useClassParser";
import "./_infinite_scroll.scss";

// Matches the paginatedResult shape returned by the backend
export type PaginatedData<T = unknown> = {
  total: number;
  current_page: number;
  last_page: number;
  per_page?: number;
  data: T[];
};

export type InfiniteScrollChange = { page: number; per_page?: number };

export type InfiniteScrollHandle = {
  triggerLoadMore: () => void;
  reset: () => void; // Scrolls back to the top, call it when the data is reset
};

type InfiniteScrollProps = {
  paginatedData: PaginatedData;
  loading?: boolean;
  threshold?: number; // Pixels from the bottom to trigger load more
  disabled?: boolean;
  // Scroll inside the component (it fills its parent's height) instead of
  // following the window scroll
  scrollable?: boolean;
  onChange?: (change: InfiniteScrollChange) => void;
  ref?: Ref<InfiniteScrollHandle>;
  children?: ReactNode;
};

export default function InfiniteScroll({
  paginatedData,
  loading = false,
  threshold = 100,
  disabled = false,
  scrollable = false,
  onChange,
  ref,
  children,
}: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasReachedEnd = paginatedData.current_page >= paginatedData.last_page;
  const canLoadMore = !loading && !hasReachedEnd && !disabled;

  const loadMore = () => {
    if (!canLoadMore) return;

    onChange?.({
      page: paginatedData.current_page + 1,
      per_page: paginatedData.per_page,
    });
  };

  // The observer and scroll listener outlive renders, so they read the latest
  // loadMore through a ref instead of a stale closure
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  useImperativeHandle(ref, () => ({
    triggerLoadMore: () => loadMoreRef.current(),
    reset: () => {
      if (scrollable) containerRef.current?.scrollTo(0, 0);
      else window.scrollTo(0, 0);
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreRef.current();
      },
      {
        root: scrollable ? container : null,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      },
    );
    observer.observe(sentinel);

    // Fallback scroll listener for better compatibility
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = scrollable
        ? container
        : document.documentElement;
      const viewportHeight = scrollable ? clientHeight : window.innerHeight;

      if (scrollTop + viewportHeight >= scrollHeight - threshold) {
        loadMoreRef.current();
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    const scrollTarget = scrollable ? container : window;
    scrollTarget.addEventListener("scroll", throttledScroll);

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", throttledScroll);
    };
  }, [scrollable, threshold]);

  return (
    <div
      ref={containerRef}
      className={useClassParser({
        "infinite-scroll-container": true,
        "infinite-scroll-container--scrollable": scrollable,
      })}
    >
      {children}

      {loading && (
        <div className="infinite-scroll-loading">
          <div className="lds-spinner">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i}></div>
            ))}
          </div>
        </div>
      )}

      {hasReachedEnd && !loading && (
        <div className="infinite-scroll-end">
          <span>No more items to show</span>
        </div>
      )}

      <div ref={sentinelRef} className="infinite-scroll-sentinel"></div>
    </div>
  );
}
