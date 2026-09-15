"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";

function BotonCerrarSesion() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center gap-3 rounded-xl border border-white/15 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-emerald-400 disabled:cursor-wait disabled:opacity-60"
    >
      <LogOut aria-hidden="true" className="size-5" />
      {pending ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  );
}

export default function CerrarSesion() {
  return (
    <form action={logout}>
      <BotonCerrarSesion />
    </form>
  );
}