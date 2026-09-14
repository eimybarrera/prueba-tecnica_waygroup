import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";

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
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">
          Panel de administración
        </h1>

        <p className="mt-3 text-gray-600">
          Sesión iniciada como: {user.email}
        </p>

        <p className="mt-2 text-gray-600">
          Aquí construiremos el resumen de empresas y empleados.
        </p>

        <div className="mt-6">
          <Link
            href="/empresas"
            className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
          >
            Ver empresas
          </Link>
        </div>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
          >
            Cerrar sesión
          </button>
        </form>
      </section>
    </main>
  );
}