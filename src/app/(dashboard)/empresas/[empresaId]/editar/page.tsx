import Link from "next/link";
import EmpresaForm from "@/components/dashboard/empresas/EmpresaForm";
import { editarEmpresa } from "@/lib/actions/empresas";
import { getEmpresaById } from "@/lib/queries/empresas";

type EditarEmpresaPageProps = {
  params: Promise<{
    empresaId: string;
  }>;
};

export default async function EditarEmpresaPage({
  params,
}: EditarEmpresaPageProps) {
  const { empresaId } = await params;
  const result = await getEmpresaById(empresaId);

  const actualizarEmpresa = editarEmpresa.bind(null, empresaId);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <Link
          href={`/empresas/${empresaId}`}
          className="text-sm text-blue-700 hover:underline"
        >
          Volver al detalle
        </Link>

        <h1 className="mt-4 text-2xl font-bold">
          Editar empresa
        </h1>

        {!result.ok ? (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-50 p-4 text-red-700"
          >
            {result.message}
          </p>
        ) : (
          <EmpresaForm
            key={result.empresa.id}
            action={actualizarEmpresa}
            empresa={result.empresa}
            cancelHref={`/empresas/${empresaId}`}
            submitLabel="Guardar cambios"
          />
        )}
      </section>
    </main>
  );
}