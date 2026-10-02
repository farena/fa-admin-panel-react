import { useRef, useState } from "react";
import InfiniteScroll, {
  type InfiniteScrollChange,
  type InfiniteScrollHandle,
  type PaginatedData,
} from "~/components/Pagination/InfiniteScroll";
import { Example, Section } from "./_PlaygroundLayout";

const PER_PAGE = 10;
const LAST_PAGE = 4;

const fakePage = (page: number) =>
  Array.from(
    { length: PER_PAGE },
    (_, i) => `Item ${(page - 1) * PER_PAGE + i + 1}`,
  );

const firstPage = (): PaginatedData<string> => ({
  total: PER_PAGE * LAST_PAGE,
  current_page: 1,
  last_page: LAST_PAGE,
  per_page: PER_PAGE,
  data: fakePage(1),
});

export default function InfiniteScrollPlayground() {
  const scrollRef = useRef<InfiniteScrollHandle>(null);
  const [paginated, setPaginated] = useState(firstPage);
  const [loading, setLoading] = useState(false);
  const [lastChange, setLastChange] = useState<InfiniteScrollChange | null>(
    null,
  );

  // Simulates a backend request for the next page
  const fetchPage = (change: InfiniteScrollChange) => {
    setLastChange(change);
    setLoading(true);
    setTimeout(() => {
      setPaginated((prev) => ({
        ...prev,
        current_page: change.page,
        data: [...prev.data, ...fakePage(change.page)],
      }));
      setLoading(false);
    }, 800);
  };

  const reset = () => {
    setPaginated(firstPage());
    scrollRef.current?.reset();
  };

  return (
    <Section
      title="InfiniteScroll"
      state={{
        lastChange,
        loading,
        current_page: paginated.current_page,
        items: paginated.data.length,
      }}
    >
      <Example title="Scrollable (fills a 300px parent)">
        <div className="mb-2">
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={() => scrollRef.current?.triggerLoadMore()}
          >
            Trigger load more
          </button>
          <button className="btn btn-sm btn-secondary" onClick={reset}>
            Reset
          </button>
        </div>
        <div className="border rounded" style={{ height: 300 }}>
          <InfiniteScroll
            ref={scrollRef}
            paginatedData={paginated}
            loading={loading}
            onChange={fetchPage}
            scrollable
          >
            {paginated.data.map((item) => (
              <div key={item} className="p-3 border-bottom">
                {item}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </Example>
    </Section>
  );
}
