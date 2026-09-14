import Link from "next/link";

export default function EmpresaNotFound() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Empresa no encontrada
        </h1>

        <p className="mt-3 text-gray-600">
          No existe una empresa con el identificador de esta dirección.
        </p>

        <Link
          href="/empresas"
          className="mt-6 inline-block text-blue-700 hover:underline"
        >
          Volver a empresas
        </Link>
      </section>
    </main>
  );
}