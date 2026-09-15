import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/layout/Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <a
        href="#contenido-principal"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only focus:rounded-lg focus:bg-white focus:p-4 focus:text-brand"
      >
        Saltar al contenido
      </a>

      <Sidebar email={user.email ?? "Usuario"} />

      <div className="min-w-0 pt-20 lg:pl-72 lg:pt-0">
        <div
          id="contenido-principal"
          tabIndex={-1}
          className="dashboard-content"
        >
          {children}
        </div>
      </div>
    </div>
  );
}