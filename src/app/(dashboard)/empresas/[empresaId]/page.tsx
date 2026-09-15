import Link from "next/link";
import { getEmpresaById } from "@/lib/queries/empresas";

type EmpresaDetallePageProps = {
  params: Promise<{
    empresaId: string;
  }>;
};

export default async function EmpresaDetallePage({
  params,
}: EmpresaDetallePageProps) {
  const { empresaId } = await params;
  const result = await getEmpresaById(empresaId);

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
        <Link
          href="/empresas"
          className="text-sm text-brand hover:underline"
        >
          Volver a empresas
        </Link>

        {!result.ok ? (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-50 p-4 text-red-700"
          >
            {result.message}
          </p>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-bold">
              {result.empresa.nombre}
            </h1>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/empresas/${result.empresa.id}/editar`}
                className="inline-block rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-dark"
              >
                Editar empresa
              </Link>

              <Link
                href={`/empresas/${result.empresa.id}/empleados`}
                className="inline-block rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-dark"
              >
                Ver empleados
              </Link>
            </div>

            <h2 className="mt-6 text-lg font-semibold">
              Información de la empresa
            </h2>

            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-600">Nombre</dt>
                <dd className="mt-1 font-medium">
                  {result.empresa.nombre}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-600">NIT</dt>
                <dd className="mt-1 font-medium">
                  {result.empresa.nit}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm text-gray-600">
                  Correo de contacto
                </dt>
                <dd className="mt-1 break-words font-medium">
                  {result.empresa.correo_contacto ?? "Sin registrar"}
                </dd>
              </div>
            </dl>
          </>
        )}
      </section>
    </main>
  );
}