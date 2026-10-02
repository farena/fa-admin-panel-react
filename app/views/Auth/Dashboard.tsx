import { useState } from "react";
import FaTable, {
  type FaTableFilter,
  type FaTableHeader,
  type FaTablePagerParams,
  type FaTablePagination,
} from "@farena/fa-tables-react";
import Widget from "~/components/Widget/Widget";
import WidgetCounter from "~/components/Widget/WidgetCounter";
import { useToast } from "~/components/Toast/ToastProvider";
import AreaChart from "~/components/Charts/AreaChart";
import BarChart from "~/components/Charts/BarChart";
import DonutChart from "~/components/Charts/DonutChart";
import RadialBarChart from "~/components/Charts/RadialBarChart";
import { formatToMoney } from "~/utils/string";
import {
  ACCOUNTS,
  EXPENSE_CATEGORIES,
  EXPENSES,
  INCOME,
  KPIS,
  MONTHS,
  SAVINGS_GOALS,
  TRANSACTION_CATEGORIES,
  TRANSACTION_STATUSES,
  UPCOMING_PAYMENTS,
  fetchTransactions,
  type Transaction,
} from "./_financeMock";

const money = (value: number) => `€${formatToMoney(value)}`;
const compactMoney = (value: number) =>
  `${value < 0 ? "-" : ""}€${Math.round(Math.abs(value) / 1000)}k`;

const NET_FLOW = INCOME.map((income, i) => income - EXPENSES[i]);

const STATUS_BADGES: Record<Transaction["status"], string> = {
  completed: "badge-success",
  pending: "badge-warning",
  failed: "badge-danger",
};

const TRANSACTION_HEADERS: FaTableHeader[] = [
  { title: "date", dateLocaleFormat: true, sortable: true },
  { title: "description", max_chars: 40 },
  { title: "category", hideable: true },
  { title: "account", hideable: true },
  { title: "status", slot: "status" },
  { title: "amount", slot: "amount", sortable: true },
];

const TRANSACTION_FILTERS: FaTableFilter[] = [
  {
    title: "Status",
    type: "select",
    column: "status",
    options: TRANSACTION_STATUSES,
    all_option: true,
    default_value: "all",
    isActive: (value) => value !== "all",
  },
  {
    title: "Category",
    type: "select",
    column: "category",
    options: TRANSACTION_CATEGORIES,
    all_option: true,
    default_value: "all",
    isActive: (value) => value !== "all",
  },
];

export default function Dashboard() {
  const toast = useToast();
  const [transactions, setTransactions] = useState<FaTablePagination | null>(
    null,
  );

  function getTransactions(params: FaTablePagerParams) {
    // FaTablePagination types rows as { checked: boolean }, a field the table never reads
    fetchTransactions(params).then((response) =>
      setTransactions(response as unknown as FaTablePagination),
    );
  }

  return (
    <>
      <div className="row">
        {KPIS.map((kpi) => (
          <div key={kpi.title} className="col-sm-6 col-xl-3 mb-4">
            <WidgetCounter moneySign="€" {...kpi} />
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <Widget
            icon="fa-solid fa-chart-line"
            title="Income vs expenses"
            description="Last 12 months"
          >
            <AreaChart
              series={[
                { name: "Income", data: INCOME },
                { name: "Expenses", data: EXPENSES },
              ]}
              categories={MONTHS}
              valueFormatter={money}
              // Areas start at zero so the filled height reads as the real amount
              options={{ yaxis: { min: 0, labels: { formatter: compactMoney } } }}
            />
          </Widget>
        </div>
        <div className="col-lg-4 mb-4">
          <Widget
            icon="fa-solid fa-chart-pie"
            title="Expenses by category"
            description="September"
          >
            <DonutChart
              {...EXPENSE_CATEGORIES}
              totalLabel="Total"
              valueFormatter={money}
            />
          </Widget>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <Widget
            icon="fa-solid fa-scale-balanced"
            title="Net cash flow"
            description="Income minus expenses"
          >
            <BarChart
              series={[{ name: "Net flow", data: NET_FLOW }]}
              categories={MONTHS}
              valueFormatter={money}
              options={{
                yaxis: { labels: { formatter: compactMoney } },
                plotOptions: {
                  bar: {
                    colors: {
                      ranges: [{ from: -Infinity, to: -0.01, color: "#e14319" }],
                    },
                  },
                },
              }}
            />
          </Widget>
        </div>
        <div className="col-lg-4 mb-4">
          <Widget
            icon="fa-solid fa-wallet"
            title="Balance by account"
          >
            <BarChart
              {...ACCOUNTS}
              horizontal
              valueFormatter={money}
              options={{ xaxis: { labels: { formatter: (v) => compactMoney(+v) } } }}
            />
          </Widget>
        </div>
        <div className="col-lg-4 mb-4">
          <Widget
            icon="fa-solid fa-piggy-bank"
            title="Savings goals"
            description="Progress towards target"
          >
            <RadialBarChart {...SAVINGS_GOALS} totalLabel="Average" />
          </Widget>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <Widget
            icon="fa-solid fa-receipt"
            title="Latest transactions"
            buttons={<button className="btn btn-sm btn-primary">See all</button>}
          >
            <FaTable
              headers={TRANSACTION_HEADERS}
              filters={TRANSACTION_FILTERS}
              values={transactions}
              onChange={getTransactions}
              onError={toast.warning}
              // Typed as required, but only used by checkeable tables
              onCheckChange={() => {}}
              primaryKey="id"
              slots={{
                status: ({ item }) => {
                  const { status } = item as Transaction;
                  return (
                    <span className={`badge ${STATUS_BADGES[status]}`}>
                      {status}
                    </span>
                  );
                },
                amount: ({ item }) => {
                  const { amount } = item as Transaction;
                  return (
                    <span className={amount < 0 ? "text-danger" : "text-success"}>
                      {amount < 0 ? "-" : "+"}
                      {money(Math.abs(amount))}
                    </span>
                  );
                },
              }}
            />
          </Widget>
        </div>
        <div className="col-lg-4 mb-4">
          <Widget icon="fa-solid fa-calendar-days" title="Upcoming payments">
            <ul className="list-unstyled m-0">
              {UPCOMING_PAYMENTS.map((payment) => (
                <li
                  key={payment.title}
                  className="d-flex align-items-center justify-content-between py-2 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <i className={`${payment.icon} text-primary mr-3`}></i>
                    <div>
                      <div>{payment.title}</div>
                      <small className="text-muted">{payment.date}</small>
                    </div>
                  </div>
                  <strong className="text-nowrap">{money(payment.amount)}</strong>
                </li>
              ))}
            </ul>
          </Widget>
        </div>
      </div>
    </>
  );
}
