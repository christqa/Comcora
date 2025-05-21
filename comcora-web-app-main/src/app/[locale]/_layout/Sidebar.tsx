"use client";

import { MyProductsWidget } from "@/features/account/components/MyProductsWidget";

export const Sidebar = () => {
  return (
    <aside className="flex w-full flex-col rounded-3xl bg-fill-primary">
      <MyProductsWidget />
    </aside>
  );
};
