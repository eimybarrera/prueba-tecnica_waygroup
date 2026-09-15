import Link from "next/link";
import Form from "next/form";
import { redirect } from "next/navigation";
import EmpresasTable from "@/components/dashboard/empresas/EmpresasTable";
import {
  getEmpresas,
  EMPRESAS_POR_PAGINA,
} from "@/lib/queries/empresas";

type EmpresasPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    campo?: string | string[];
    pagina?: string | string[];
    creada?: string | string[];
    actualizada?: string | string[];
  }>;
};

export default async function EmpresasPage({
  searchParams,
}: EmpresasPageProps) {
  const params = await searchParams;

  const busqueda =
    typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";

  const campo = params.campo === "nit" ? "nit" : "nombre";

  const numero =
    typeof params.pagina === "string" ? Number(params.pagina) : 1;

  const pagina =
    Number.isSafeInteger(numero) && numero > 0 && numero <= 100000
      ? numero
      : 1;

  const { empresas, total, error } = await getEmpresas(
    busqueda,
    campo,
    pagina
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(total / EMPRESAS_POR_PAGINA)
  );

  function enlacePagina(numeroPagina: number) {
    const valores = new URLSearchParams({
      q: busqueda,
      campo,
      pagina: String(numeroPagina),
    });

    return `/empresas?${valores.toString()}`;
  }

  if (!error && pagina > totalPaginas) {
    redirect(enlacePagina(totalPaginas));
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">


        <h1 className="text-2xl font-bold">Empresas</h1>

        <div className="mt-4">
          <Link
            href="/empresas/nueva"
            className="inline-block rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-dark"
          >
            Nueva empresa
          </Link>
        </div>

        {(params.creada === "1" || params.actualizada === "1") && (
          <p
            role="status"
            className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
          >
            {params.actualizada === "1"
              ? "Empresa actualizada correctamente."
              : "Empresa creada correctamente."}
          </p>
        )}

        <p className="mt-2 text-sm text-gray-600">
          Consulta las empresas registradas y busca por nombre o NIT.
        </p>

        <Form
          action="/empresas"
          className="my-6 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div>
            <label
              htmlFor="campo"
              className="mb-2 block text-sm font-medium"
            >
              Buscar por
            </label>

            <select
              id="campo"
              name="campo"
              defaultValue={campo}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              <option value="nombre">Nombre</option>
              <option value="nit">NIT</option>
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="busqueda"
              className="mb-2 block text-sm font-medium"
            >
              Texto de búsqueda
            </label>

            <input
              id="busqueda"
              name="q"
              type="search"
              defaultValue={busqueda}
              maxLength={100}
              placeholder="Escribe el nombre o NIT"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-dark"
          >
            Buscar
          </button>

          <Link
            href="/empresas"
            className="rounded-lg border border-gray-300 px-4 py-2 text-center hover:bg-gray-50"
          >
            Limpiar
          </Link>
        </Form>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              Empresas encontradas: {total}
            </p>

            {empresas.length === 0 ? (
              <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">
                {busqueda
                  ? "No se encontraron empresas con esa búsqueda."
                  : "Todavía no hay empresas registradas."}
              </p>
            ) : (
              <EmpresasTable empresas={empresas} />
            )}

            {totalPaginas > 1 && (
              <nav
                aria-label="Páginas del listado"
                className="mt-6 flex items-center justify-between gap-3 text-sm"
              >
                {pagina > 1 ? (
                  <Link
                    href={enlacePagina(pagina - 1)}
                    className="text-brand hover:underline"
                  >
                    Anterior
                  </Link>
                ) : (
                  <span />
                )}

                <span>
                  Página {pagina} de {totalPaginas}
                </span>

                {pagina < totalPaginas ? (
                  <Link
                    href={enlacePagina(pagina + 1)}
                    className="text-brand hover:underline"
                  >
                    Siguiente
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}