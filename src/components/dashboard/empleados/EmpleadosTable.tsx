import Link from "next/link";
import type { EmpleadoListado } from "@/types/empleado";

type EmpleadosTableProps = {
  empresaId: string;
  empleados: EmpleadoListado[];
};

export default function EmpleadosTable({
  empresaId,
  empleados,
}: EmpleadosTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-canvas">
          <tr>
            <th scope="col" className="px-4 py-3">Documento</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Apellido</th>
            <th scope="col" className="px-4 py-3">Correo</th>
            <th scope="col" className="px-4 py-3">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {empleados.map((empleado) => (
            <tr key={empleado.id}>
              <td className="px-4 py-3">{empleado.documento}</td>
              <td className="px-4 py-3">{empleado.nombre}</td>
              <td className="px-4 py-3">{empleado.apellido}</td>
              <td className="px-4 py-3">
                {empleado.correo ?? "Sin registrar"}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/empresas/${empresaId}/empleados/${empleado.id}/editar`}
                  aria-label={`Editar a ${empleado.nombre} ${empleado.apellido}`}
                  className="text-brand underline"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}