import type { Empresa } from "@/types/empresa";
import Link from "next/link";

type EmpresasTableProps = {
  empresas: Empresa[];
};

export default function EmpresasTable({ empresas }: EmpresasTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Listado de empresas</caption>

        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3">
              NIT
            </th>
            <th scope="col" className="px-4 py-3">
              Correo de contacto
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {empresas.map((empresa) => (
            <tr key={empresa.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/empresas/${empresa.id}`}
                  className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
                >
                  {empresa.nombre}
                </Link>
              </td>

              <td className="px-4 py-3">{empresa.nit}</td>

              <td className="px-4 py-3">
                {empresa.correo_contacto ?? "Sin registrar"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
