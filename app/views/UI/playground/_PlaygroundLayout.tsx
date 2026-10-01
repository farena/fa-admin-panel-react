import type { ReactNode } from "react";

export function Section({
  title,
  state,
  children,
}: {
  title: string;
  state?: unknown;
  children: ReactNode;
}) {
  return (
    <section className="card mb-4">
      <div className="card-header p-3">
        <h4 className="m-0">{title}</h4>
      </div>
      <div className="card-body pb-3">
        <div className="row">
          <div className={state === undefined ? "col-12" : "col-md-8"}>
            {children}
          </div>
          {state !== undefined && (
            <div className="col-md-4">
              <small className="d-block font-weight-bold mb-1">State</small>
              <pre className="small p-2 bg-light rounded">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Example({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <small className="d-block text-muted mb-2">{title}</small>
      {children}
    </div>
  );
}
