import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 text-gray-900">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>

        <p className="mb-6 mt-2 text-sm text-gray-600">
          Ingresa para gestionar empresas y empleados.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}