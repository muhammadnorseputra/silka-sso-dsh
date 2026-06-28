"use client";

import { SSOAppGrid } from "@/components/sso-app-grid";

export function DashboardContent({ clients }: { clients: any }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">SSO Applications</h1>
      <SSOAppGrid results={clients} />
    </main>
  );
}
