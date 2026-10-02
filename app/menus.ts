import { type Path } from "react-router";

export interface Menu {
  icon?: string;
  title: string;
  to?: Path | string;
  functionalities?: { name: string; mode: "write" | "read" }[];
  children?: Menu[];
}

export const menus: Menu[] = [
  {
    icon: "fa-solid fa-gauge-high",
    title: "Dashboard",
    to: "/dashboard",
  },
  {
    icon: "fa-solid fa-user",
    title: "Users",
  },
  {
    icon: "fa-solid fa-chart-pie",
    title: "Reports",
    children: [
      {
        title: "Income",
      },
      {
        title: "Outcome",
      },
    ],
  },
];
