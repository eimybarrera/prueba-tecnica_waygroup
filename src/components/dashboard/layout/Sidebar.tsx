"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import {
  Building2,
  LayoutDashboard,
  Link2,
  Menu,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import CerrarSesion from "@/components/dashboard/layout/CerrarSesion";

type SidebarProps = {
  email: string;
};

type EnlaceMenu = {
  href: string;
  texto: string;
  icono: LucideIcon;
};

export default function Sidebar({ email }: SidebarProps) {
  const pathname = usePathname();
  const menuMovil = useRef<HTMLDetailsElement>(null);

  const segmentos = pathname.split("/");
  const posibleEmpresaId = segmentos[2] ?? "";

  const empresaId =
    segmentos[1] === "empresas" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      posibleEmpresaId
    )
      ? posibleEmpresaId
      : null;

  const generales: EnlaceMenu[] = [
    {
      href: "/dashboard",
      texto: "Panel",
      icono: LayoutDashboard,
    },
    {
      href: "/empresas",
      texto: "Empresas",
      icono: Building2,
    },
  ];

  const deEmpresa: EnlaceMenu[] = empresaId
    ? [
        {
          href: `/empresas/${empresaId}`,
          texto: "Información de la empresa",
          icono: Building2,
        },
        {
          href: `/empresas/${empresaId}/empleados`,
          texto: "Empleados",
          icono: Users,
        },
        {
          href: `/empresas/${empresaId}/empleados/nuevo`,
          texto: "Nuevo empleado",
          icono: UserPlus,
        },
        {
          href: `/empresas/${empresaId}/empleados/vincular`,
          texto: "Vincular empleado",
          icono: Link2,
        },
      ]
    : [];

  const enlaceActivo = [...generales, ...deEmpresa]
    .filter(
      (enlace) =>
        pathname === enlace.href ||
        pathname.startsWith(`${enlace.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  function cerrarMenuMovil() {
    if (menuMovil.current) {
      menuMovil.current.open = false;
    }
  }

  function mostrarEnlace(enlace: EnlaceMenu) {
    const Icono = enlace.icono;
    const activo = enlaceActivo === enlace.href;

    return (
      <Link
        key={enlace.href}
        href={enlace.href}
        onClick={cerrarMenuMovil}
        aria-current={activo ? "location" : undefined}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition focus-visible:outline-emerald-400 ${
          activo
            ? "bg-brand text-white"
            : "text-slate-300 hover:bg-white/7 hover:text-white"
        }`}
      >
        <Icono aria-hidden="true" className="size-5 shrink-0" />
        <span>{enlace.texto}</span>
      </Link>
    );
  }

  const navegacion = (
    <>
      <div className="space-y-2">{generales.map(mostrarEnlace)}</div>

      {empresaId ? (
        <div className="mt-7 border-t border-white/10 pt-5">
          <p className="mb-3 px-4 text-xs font-medium text-slate-400">
            Empresa seleccionada
          </p>
          <div className="space-y-2">
            {deEmpresa.map(mostrarEnlace)}
          </div>
        </div>
      ) : (
        <p className="mt-6 px-4 text-sm leading-6 text-slate-400">
          Selecciona una empresa para gestionar sus empleados.
        </p>
      )}
    </>
  );

  const cuenta = (
    <>
      <p className="mb-1 text-xs text-slate-400">
        Sesión iniciada
      </p>
      <p className="mb-4 break-words text-sm font-medium text-slate-200">
        {email}
      </p>
      <CerrarSesion />
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-ink text-white lg:flex">
        <div className="px-6 py-8">
          <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-brand">
            <Building2 aria-hidden="true" className="size-6" />
          </div>
          <p className="text-lg font-semibold tracking-tight">
            Gestión empresarial
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Empresas y empleados
          </p>
        </div>

        <nav
          aria-label="Menú principal"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
        >
          {navegacion}
        </nav>

        <div className="border-t border-white/10 p-5">
          {cuenta}
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-20 items-center justify-between gap-3 bg-ink px-4 text-white lg:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 font-semibold"
        >
          <Building2 aria-hidden="true" className="size-6 text-emerald-400" />
          Gestión empresarial
        </Link>

        <details
          ref={menuMovil}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              cerrarMenuMovil();
              menuMovil.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-white/20 p-3 text-sm [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="size-5" />
            Menú
          </summary>

          <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 bg-ink p-4 shadow-xl">
            <nav aria-label="Menú principal móvil">
              {navegacion}
            </nav>
            <div className="mt-5 border-t border-white/10 pt-5">
              {cuenta}
            </div>
          </div>
        </details>
      </header>
    </>
  );
}