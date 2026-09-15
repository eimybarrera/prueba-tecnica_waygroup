import Link from "next/link";

export default function EmpleadoNoEncontrado() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-gray-900">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6">
        <h1 className="text-2xl font-bold">
          Empleado no encontrado
        </h1>

        <p className="mt-3">
          La persona no existe o no está vinculada a esta empresa.
        </p>

        <Link
          href="/empresas"
          className="mt-5 inline-block text-brand underline"
        >
          Volver a empresas
        </Link>
      </section>
    </main>
  );
}