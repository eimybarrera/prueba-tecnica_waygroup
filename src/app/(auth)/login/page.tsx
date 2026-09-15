import { redirect } from "next/navigation";
import { Building2, Check } from "lucide-react";
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
    <main className="flex min-h-dvh items-center justify-center bg-canvas p-4 text-ink sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/5 md:min-h-[640px] md:grid-cols-[42%_58%]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-white md:flex lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full border border-white/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full border border-white/5"
          />

          <div className="relative">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand">
              <Building2 aria-hidden="true" className="size-7" />
            </div>

            <p className="mt-7 text-xl font-semibold tracking-tight">
              Gestión empresarial
            </p>

            <h1 className="mt-12 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
              Tus empresas.
              <br />
              Tu equipo.
              <br />
              Un solo lugar.
            </h1>

            <p className="mt-6 max-w-xs text-base leading-7 text-slate-300">
              Organiza la información de tus empresas y las personas
              que forman parte de ellas.
            </p>
          </div>

          <ul className="relative mt-12 space-y-4 text-sm text-slate-200">
            <li className="flex items-center gap-3">
              <Check aria-hidden="true" className="size-5 text-emerald-400" />
              Consulta empresas y empleados.
            </li>
            <li className="flex items-center gap-3">
              <Check aria-hidden="true" className="size-5 text-emerald-400" />
              Busca por nombre, NIT o documento.
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="titulo-login"
          className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16"
        >
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand text-white">
                <Building2 aria-hidden="true" className="size-6" />
              </div>
              <p className="font-semibold">Gestión empresarial</p>
            </div>

            <p className="text-sm font-medium text-brand">
              Te damos la bienvenida
            </p>

            <h2
              id="titulo-login"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Inicia sesión
            </h2>

            <p className="mt-3 text-base leading-7 text-muted">
              Ingresa con tu correo y contraseña para continuar.
            </p>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}