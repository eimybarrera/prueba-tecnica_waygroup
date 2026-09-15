import Link from "next/link";
import { notFound } from "next/navigation";
import EditarEmpleadoForm from "@/components/dashboard/empleados/EditarEmpleadoForm";
import { getEmpresaById } from "@/lib/queries/empresas";
import { getEmpleadoDeEmpresa } from "@/lib/queries/empleado-detalle";
import { getTiposDocumento } from "@/lib/queries/tipos-documento";

type EditarEmpleadoPageProps = {
  params: Promise<{
    empresaId: string;
    empleadoId: string;
  }>;
};

export default async function EditarEmpleadoPage({
  params,
}: EditarEmpleadoPageProps) {
  const { empresaId, empleadoId } = await params;

  const resultadoEmpresa = await getEmpresaById(empresaId);

  if (!resultadoEmpresa.ok) {
    return (
      <main className="p-8">
        <Link href="/empresas" className="text-brand">
          Volver a empresas
        </Link>
        <p role="alert" className="mt-4 text-red-700">
          {resultadoEmpresa.message}
        </p>
      </main>
    );
  }

  const resultado = await getEmpleadoDeEmpresa(
    empresaId,
    empleadoId
  );

  if (!resultado.error && !resultado.empleado) {
    notFound();
  }

  const catalogo = await getTiposDocumento();
  const error = resultado.error ?? catalogo.error;

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        <Link
          href={`/empresas/${empresaId}/empleados`}
          className="text-sm text-brand hover:underline"
        >
          Volver a empleados
        </Link>

        <h1 className="mt-4 text-2xl font-bold">
          Editar empleado
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Empresa: {resultadoEmpresa.empresa.nombre}
        </p>

        {error ? (
          <p role="alert" className="mt-6 text-red-700">
            {error}
          </p>
        ) : catalogo.tipos.length === 0 ? (
          <p role="alert" className="mt-6 text-red-700">
            No hay tipos de documento disponibles.
          </p>
        ) : resultado.empleado ? (
          <EditarEmpleadoForm
            key={resultado.empleado.id}
            empresaId={empresaId}
            empleado={resultado.empleado}
            tiposDocumento={catalogo.tipos}
          />
        ) : null}
      </section>
    </main>
  );
}