import Link from "next/link";
import { ArrowUpRight, Building2, Link2, Users } from "lucide-react";
import { getResumenPanel } from "@/lib/queries/resumen";
import InitialsBadge from "@/components/comunes/InitialsBadge";
import CorreoBadge from "@/components/comunes/CorreoBadge";
import MensajeError from "@/components/comunes/MensajeError";

export default async function ResumenPanel() {
  const result = await getResumenPanel();

  if (!result.ok) {
    return (
      <div className="mt-6">
        <MensajeError message={result.message} />
      </div>
    );
  }

  const { resumen } = result;

  const indicadores = [
    {
      titulo: "Empresas",
      valor: resumen.totalEmpresas,
      descripcion: "Empresas registradas",
      icono: Building2,
    },
    {
      titulo: "Personas registradas",
      valor: resumen.totalPersonas,
      descripcion: "Sin duplicar personas entre empresas",
      icono: Users,
    },
    {
      titulo: "Vinculaciones",
      valor: resumen.totalVinculaciones,
      descripcion: "Relaciones con empresas",
      icono: Link2,
    },
  ];

  return (
    <div className="mt-8 space-y-9">
      <dl className="grid gap-4 md:grid-cols-3">
        {indicadores.map((indicador, index) => {
          const Icono = indicador.icono;

          return (
            <div
              key={indicador.titulo}
              className={`rounded-2xl border border-line bg-white p-6 ${
                index === 0 ? "border-l-[3px] border-l-brand" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <dt className="text-sm font-medium text-muted">
                  {indicador.titulo}
                </dt>
                <Icono
                  aria-hidden="true"
                  className={`size-5 ${
                    index === 0 ? "text-brand" : "text-muted"
                  }`}
                />
              </div>

              <dd
                className={`mt-4 text-4xl font-semibold tracking-tight ${
                  index === 0 ? "text-brand" : "text-ink"
                }`}
              >
                {indicador.valor}
              </dd>

              <dd className="mt-2 text-xs leading-5 text-muted">
                {indicador.descripcion}
              </dd>
            </div>
          );
        })}
      </dl>

      <section aria-labelledby="empresas-recientes">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="empresas-recientes"
            className="text-lg font-semibold text-ink"
          >
            Últimas empresas creadas
          </h2>

          <Link
            href="/empresas"
            className="flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-dark"
          >
            Ver todas
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {resumen.empresasRecientes.length === 0 ? (
          <p className="rounded-2xl border border-line bg-white p-6 text-muted">
            Todavía no hay empresas registradas.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-line bg-white divide-y divide-line">
            {resumen.empresasRecientes.map((empresa) => (
              <li key={empresa.id}>
                <Link
                  href={`/empresas/${empresa.id}`}
                  className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-canvas/60"
                >
                  <InitialsBadge nombre={empresa.nombre} />

                  <div className="min-w-0 flex-1">
                    <p className="break-words font-medium text-ink">
                      {empresa.nombre}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      NIT {empresa.nit}
                    </p>
                  </div>

                  <CorreoBadge correo={empresa.correo_contacto} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}