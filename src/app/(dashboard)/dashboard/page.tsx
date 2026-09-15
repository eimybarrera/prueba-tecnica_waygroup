import ResumenPanel from "@/components/dashboard/home/ResumenPanel";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

return (
  <main className="p-5 sm:p-8 lg:p-10">
    <section className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-muted">
        Panel de administración
      </p>

      <h1 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Consulta el resumen de tus empresas y empleados
      </h1>

      <ResumenPanel />
    </section>
  </main>
);
}