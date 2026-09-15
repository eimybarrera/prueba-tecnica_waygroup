import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CrearEmpresaForm from "@/components/dashboard/empresas/CrearEmpresaForm";

export default async function NuevaEmpresaPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <Link
          href="/empresas"
          className="text-sm text-brand hover:underline"
        >
          Volver a empresas
        </Link>

        <h1 className="mt-4 text-2xl font-bold">
          Nueva empresa
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          El nombre y el NIT son obligatorios.
        </p>

        <CrearEmpresaForm />
      </section>
    </main>
  );
}