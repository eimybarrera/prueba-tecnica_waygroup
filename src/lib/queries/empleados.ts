import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  CampoBusquedaEmpleado,
  ResultadoListadoEmpleados,
} from "@/types/empleado";

export const EMPLEADOS_POR_PAGINA = 10;

export async function getEmpleadosPorEmpresa(
  empresaId: string,
  busqueda: string,
  campo: CampoBusquedaEmpleado,
  pagina: number
): Promise<ResultadoListadoEmpleados> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const desde = (pagina - 1) * EMPLEADOS_POR_PAGINA;

  let consulta = supabase
    .from("empleados")
    .select(
      `
        id,
        documento,
        nombre,
        apellido,
        correo,
        empresa_empleados!inner(empresa_id)
      `,
      { count: "exact" }
    )
    .eq("empresa_empleados.empresa_id", empresaId);

  if (busqueda) {
    const textoEscapado = busqueda.replace(
      /[\\%_]/g,
      "\\$&"
    );

    consulta = consulta.ilike(campo, `%${textoEscapado}%`);
  }

  const { data, count, error } = await consulta
    .order("apellido", { ascending: true })
    .order("nombre", { ascending: true })
    .order("id", { ascending: true })
    .range(desde, desde + EMPLEADOS_POR_PAGINA - 1);

  if (error) {
    return {
      empleados: [],
      total: 0,
      error: "No se pudieron consultar los empleados. Intenta nuevamente.",
    };
  }

  return {
    empleados: (data ?? []).map((empleado) => ({
      id: empleado.id,
      documento: empleado.documento,
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      correo: empleado.correo,
    })),
    total: count ?? 0,
    error: null,
  };
}