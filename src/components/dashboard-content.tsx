"use client";

import { SSOAppGrid } from "@/components/sso-app-grid";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardContent({ clients }: { clients: any }) {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <h1 className="text-2xl font-bold mb-6">SSO Applications</h1>
      <SSOAppGrid results={clients} />
    </main>
  );
}
