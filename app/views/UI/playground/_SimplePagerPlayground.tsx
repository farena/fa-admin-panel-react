import { useState } from "react";
import SimplePager from "~/components/Pagination/SimplePager";
import { Example, Section } from "./_PlaygroundLayout";

const PER_PAGE = 10;
const TOTAL = 95;
const LAST_PAGE = Math.ceil(TOTAL / PER_PAGE);

export default function SimplePagerPlayground() {
  const [page, setPage] = useState(1);

  return (
    <Section title="SimplePager" state={{ page }}>
      <Example title="With results summary">
        <SimplePager
          from={(page - 1) * PER_PAGE + 1}
          to={Math.min(page * PER_PAGE, TOTAL)}
          total={TOTAL}
          lastPage={LAST_PAGE}
          actualPage={page}
          onChange={setPage}
        />
      </Example>
      <Example title="Controlled from outside (actualPage)">
        <button
          className="btn btn-sm btn-secondary mb-2"
          onClick={() => setPage(LAST_PAGE)}
        >
          Go to last page
        </button>
        <SimplePager
          lastPage={LAST_PAGE}
          actualPage={page}
          onChange={setPage}
        />
      </Example>
      <Example title="Single page">
        <SimplePager from={1} to={4} total={4} />
      </Example>
    </Section>
  );
}
