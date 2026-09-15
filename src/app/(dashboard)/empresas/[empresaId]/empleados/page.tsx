import Link from "next/link";
import Form from "next/form";
import { redirect } from "next/navigation";
import EmpleadosTable from "@/components/dashboard/empleados/EmpleadosTable";
import { getEmpresaById } from "@/lib/queries/empresas";
import {
    getEmpleadosPorEmpresa,
    EMPLEADOS_POR_PAGINA,
} from "@/lib/queries/empleados";
import type { CampoBusquedaEmpleado } from "@/types/empleado";

type EmpleadosPageProps = {
    params: Promise<{
        empresaId: string;
    }>;
    searchParams: Promise<{
        q?: string | string[];
        campo?: string | string[];
        pagina?: string | string[];
    }>;
};

export default async function EmpleadosPage({
    params,
    searchParams,
}: EmpleadosPageProps) {
    const { empresaId } = await params;
    const filtros = await searchParams;

    const resultadoEmpresa = await getEmpresaById(empresaId);

    if (!resultadoEmpresa.ok) {
        return (
            <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
                <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6">
                    <Link href="/empresas" className="text-brand">
                        Volver a empresas
                    </Link>

                    <p role="alert" className="mt-4 text-red-700">
                        {resultadoEmpresa.message}
                    </p>
                </section>
            </main>
        );
    }

    const busqueda =
        typeof filtros.q === "string"
            ? filtros.q.trim().slice(0, 100)
            : "";

    const campo: CampoBusquedaEmpleado =
        filtros.campo === "nombre" || filtros.campo === "apellido"
            ? filtros.campo
            : "documento";

    const numero =
        typeof filtros.pagina === "string"
            ? Number(filtros.pagina)
            : 1;

    const pagina =
        Number.isSafeInteger(numero) && numero > 0 && numero <= 100000
            ? numero
            : 1;

    const { empleados, total, error } = await getEmpleadosPorEmpresa(
        empresaId,
        busqueda,
        campo,
        pagina
    );

    const ruta = `/empresas/${empresaId}/empleados`;
    const totalPaginas = Math.max(
        1,
        Math.ceil(total / EMPLEADOS_POR_PAGINA)
    );

    function enlacePagina(numeroPagina: number) {
        const valores = new URLSearchParams({
            q: busqueda,
            campo,
            pagina: String(numeroPagina),
        });

        return `${ruta}?${valores.toString()}`;
    }

    if (!error && pagina > totalPaginas) {
        redirect(enlacePagina(totalPaginas));
    }

    return (
        <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
            <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm">
                <Link
                    href={`/empresas/${empresaId}`}
                    className="text-sm text-brand hover:underline"
                >
                    Volver a la empresa
                </Link>

                <h1 className="mt-4 text-2xl font-bold">
                    Empleados de {resultadoEmpresa.empresa.nombre}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href={`/empresas/${empresaId}/empleados/nuevo`}
                        className="inline-block rounded-lg bg-brand px-4 py-2 text-white hover:bg-brand-dark"
                    >
                        Nuevo empleado
                    </Link>

                    <Link
                        href={`/empresas/${empresaId}/empleados/vincular`}
                        className="inline-block rounded-lg border border-brand px-4 py-2 text-brand hover:bg-brand-light"
                    >
                        Vincular empleado existente
                    </Link>
                </div>

                <Form
                    key={`${campo}:${busqueda}`}
                    action={ruta}
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
                            <option value="documento">Documento</option>
                            <option value="nombre">Nombre</option>
                            <option value="apellido">Apellido</option>
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
                            placeholder="Escribe el dato que deseas buscar"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-brand px-4 py-2 text-white"
                    >
                        Buscar
                    </button>

                    <Link
                        href={ruta}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-center"
                    >
                        Limpiar
                    </Link>
                </Form>

                {error ? (
                    <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                    </p>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-gray-600">
                            Empleados encontrados: {total}
                        </p>

                        {empleados.length === 0 ? (
                            <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-600">
                                {busqueda
                                    ? "No se encontraron empleados con esa búsqueda."
                                    : "Esta empresa todavía no tiene empleados vinculados."}
                            </p>
                        ) : (
                            <EmpleadosTable
                                empresaId={empresaId}
                                empleados={empleados}
                            />
                        )}

                        {totalPaginas > 1 && (
                            <nav
                                aria-label="Páginas de empleados"
                                className="mt-6 flex items-center justify-between gap-3 text-sm"
                            >
                                {pagina > 1 ? (
                                    <Link
                                        href={enlacePagina(pagina - 1)}
                                        className="text-brand"
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
                                        className="text-brand"
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