import type {
  FaTablePaginatedResponse,
  FaTablePagerParams,
} from "@farena/fa-tables-react";

// Mock data for the finance dashboard, until the API is available

export const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export const INCOME = [18400, 19200, 24800, 17900, 18600, 20100, 21300, 20800, 22400, 21900, 19800, 23600];
export const EXPENSES = [15200, 16100, 21900, 14800, 15300, 17800, 16900, 18200, 17600, 19400, 21100, 18300];

export const KPIS = [
  { title: "Total balance", count: "128.450,32", description: "+4,2% vs last month", tooltip: "Sum of the balances of all active accounts" },
  { title: "Income (Sep)", count: "23.600,00", description: "+19,2% vs August" },
  { title: "Expenses (Sep)", count: "18.300,00", description: "-13,3% vs August" },
  { title: "Savings rate", count: "22,5%", description: "Target: 20%", moneySign: "" },
];

export const EXPENSE_CATEGORIES = {
  labels: ["Payroll", "Suppliers", "Rent", "Taxes", "Marketing", "Other"],
  series: [7400, 4200, 2600, 1900, 1300, 900],
};

export const ACCOUNTS = {
  categories: ["Operating", "Savings", "Payroll", "Taxes reserve", "Credit card"],
  series: [{ name: "Balance", data: [54200, 41800, 18600, 12300, 1550] }],
};

export const SAVINGS_GOALS = {
  labels: ["Emergency fund", "New office", "Equipment"],
  series: [82, 46, 63],
};

export type Transaction = {
  id: number;
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  account: string;
  amount: number;
  status: "completed" | "pending" | "failed";
};

export const TRANSACTION_STATUSES: Transaction["status"][] = ["completed", "pending", "failed"];

const TRANSACTION_TEMPLATES: Omit<Transaction, "id" | "date" | "status">[] = [
  { description: "Invoice - Acme Corp", category: "Sales", account: "Operating", amount: 8450 },
  { description: "Payroll", category: "Payroll", account: "Payroll", amount: -7400 },
  { description: "AWS - Cloud services", category: "Suppliers", account: "Credit card", amount: -1240.5 },
  { description: "Invoice - Globex", category: "Sales", account: "Operating", amount: 5200 },
  { description: "Office rent", category: "Rent", account: "Operating", amount: -2600 },
  { description: "Google Ads", category: "Marketing", account: "Credit card", amount: -680 },
  { description: "VAT payment", category: "Taxes", account: "Taxes reserve", amount: -1900 },
  { description: "Transfer to savings", category: "Transfers", account: "Savings", amount: 3000 },
];

export const TRANSACTION_CATEGORIES = [
  ...new Set(TRANSACTION_TEMPLATES.map((template) => template.category)),
];

// 48 transactions, one every ~2 days going back from 30/09/2026
const TRANSACTIONS: Transaction[] = Array.from({ length: 48 }, (_, i) => {
  const template = TRANSACTION_TEMPLATES[i % TRANSACTION_TEMPLATES.length];
  const date = new Date(Date.UTC(2026, 8, 30 - i * 2));
  return {
    ...template,
    id: 1048 - i,
    date: date.toISOString().slice(0, 10),
    description: template.description.startsWith("Invoice")
      ? template.description.replace("Invoice", `Invoice #${1048 - i}`)
      : template.description,
    amount: Math.round(template.amount * (1 + ((i * 7) % 5) / 20) * 100) / 100,
    status: i % 9 === 5 ? "failed" : i % 4 === 3 ? "pending" : "completed",
  };
});

// Simulates the API: search, filters, sorting and pagination done "server-side"
export function fetchTransactions(
  params: FaTablePagerParams,
): Promise<FaTablePaginatedResponse<Transaction>> {
  const search = params.search?.toLowerCase();
  const { status, category } = (params.filters ?? {}) as Record<string, string | null>;

  let rows = TRANSACTIONS.filter(
    (row) =>
      (!search || row.description.toLowerCase().includes(search)) &&
      (!status || status === "all" || row.status === status) &&
      (!category || category === "all" || row.category === category),
  );

  if (params.sort_by) {
    const key = params.sort_by as keyof Transaction;
    const dir = params.sort_dir === "desc" ? -1 : 1;
    rows = [...rows].sort((a, b) => (a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0));
  }

  // FaTable omits per_page on its first call when it has filters; 10 is what its panel shows
  const perPage = params.per_page || 10;
  const lastPage = Math.max(Math.ceil(rows.length / perPage), 1);
  const page = Math.min(params.page, lastPage);
  const offset = (page - 1) * perPage;
  const data = rows.slice(offset, offset + perPage);

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          total: rows.length,
          per_page: perPage,
          current_page: page,
          last_page: lastPage,
          from: data.length ? offset + 1 : 0,
          to: offset + data.length,
          data,
        }),
      300,
    ),
  );
}

export const UPCOMING_PAYMENTS = [
  { title: "Office rent", date: "01/10/2026", amount: 2600, icon: "fa-solid fa-building" },
  { title: "Loan installment", date: "05/10/2026", amount: 1850, icon: "fa-solid fa-landmark" },
  { title: "Insurance", date: "10/10/2026", amount: 420, icon: "fa-solid fa-shield-halved" },
  { title: "Software licenses", date: "15/10/2026", amount: 315.9, icon: "fa-solid fa-laptop-code" },
];
