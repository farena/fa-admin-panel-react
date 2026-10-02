import { useState } from "react";
import "./_simple_pager.scss";

type SimplePagerProps = {
  from?: number | null;
  to?: number | null;
  total?: number | null;
  lastPage?: number;
  actualPage?: number;
  onChange?: (page: number) => void;
};

// Up to 2 pages before and after the current one
const pagesAround = (current: number, lastPage: number) => {
  const pages: number[] = [];
  const start = Math.max(current - 2, 1);
  const end = Math.min(current + 2, lastPage);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
};

// Builds the BEM classes of an item: fa-simple-pager__item--{modifier}
const itemClass = (modifiers: Record<string, boolean>) =>
  [
    "fa-simple-pager__item",
    ...Object.entries(modifiers)
      .filter(([, active]) => active)
      .map(([modifier]) => `fa-simple-pager__item--${modifier}`),
  ].join(" ");

export default function SimplePager({
  from = null,
  to = null,
  total = null,
  lastPage = 1,
  actualPage = 1,
  onChange,
}: SimplePagerProps) {
  const [currentPage, setCurrentPage] = useState(actualPage);

  // Syncs the internal page when the parent changes actualPage
  const [prevActualPage, setPrevActualPage] = useState(actualPage);
  if (actualPage !== prevActualPage) {
    setPrevActualPage(actualPage);
    setCurrentPage(actualPage);
  }

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= lastPage;

  const changePage = (page: number) => {
    if (page < 1 || page > lastPage || page === currentPage) return;

    setCurrentPage(page);
    onChange?.(page);
  };

  return (
    <div className="fa-simple-pager">
      <div className="fa-simple-pager__results">
        {!!from && (
          <span>
            Showing from <b>{from}</b> to <b>{to}</b> of <b>{total}</b>{" "}
            entries.
          </span>
        )}
      </div>
      <ul className="fa-simple-pager__list">
        <li
          className={itemClass({ desktop: true, disabled: isFirst })}
          onClick={() => changePage(1)}
        >
          First
        </li>
        {pagesAround(currentPage, lastPage).map((page) => (
          <li
            key={page}
            className={itemClass({
              desktop: true,
              number: true,
              active: page === currentPage,
              disabled: page === currentPage,
            })}
            onClick={() => changePage(page)}
          >
            {page}
          </li>
        ))}
        <li
          className={itemClass({ desktop: true, disabled: isLast })}
          onClick={() => changePage(lastPage)}
        >
          Last
        </li>

        <li
          className={itemClass({ mobile: true, disabled: isFirst })}
          onClick={() => changePage(currentPage - 1)}
        >
          Prev
        </li>
        <li
          className={itemClass({ mobile: true, disabled: isLast })}
          onClick={() => changePage(currentPage + 1)}
        >
          Next
        </li>
      </ul>
    </div>
  );
}
