import Link from "next/link";
import VincularEmpleadoForm from "@/components/dashboard/empleados/VincularEmpleadoForm";
import { getEmpresaById } from "@/lib/queries/empresas";
import { getTiposDocumento } from "@/lib/queries/tipos-documento";

type VincularEmpleadoPageProps = {
  params: Promise<{
    empresaId: string;
  }>;
};

export default async function VincularEmpleadoPage({
  params,
}: VincularEmpleadoPageProps) {
  const { empresaId } = await params;
  const result = await getEmpresaById(empresaId);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
        <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6">
          <Link href="/empresas" className="text-brand">
            Volver a empresas
          </Link>

          <p role="alert" className="mt-4 text-red-700">
            {result.message}
          </p>
        </section>
      </main>
    );
  }

  const { tipos, error } = await getTiposDocumento();

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
          Vincular empleado existente
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Busca una persona para vincularla a {result.empresa.nombre}.
        </p>

        {error ? (
          <p role="alert" className="mt-6 text-red-700">
            {error}
          </p>
        ) : tipos.length === 0 ? (
          <p role="alert" className="mt-6 text-red-700">
            No hay tipos de documento disponibles.
          </p>
        ) : (
          <VincularEmpleadoForm
            empresaId={empresaId}
            tiposDocumento={tipos}
          />
        )}

        <p className="mt-6 text-sm">
          ¿La persona todavía no está registrada?{" "}
          <Link
            href={`/empresas/${empresaId}/empleados/nuevo`}
            className="text-brand underline"
          >
            Crear nuevo empleado
          </Link>
        </p>
      </section>
    </main>
  );
}