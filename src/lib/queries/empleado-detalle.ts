import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esUuid } from "@/lib/validations/empleado";
import type { EmpleadoDetalle } from "@/types/empleado";

type ResultadoEmpleadoDetalle = {
  empleado: EmpleadoDetalle | null;
  error: string | null;
};

export async function getEmpleadoDeEmpresa(
  empresaId: string,
  empleadoId: string
): Promise<ResultadoEmpleadoDetalle> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!esUuid(empresaId) || !esUuid(empleadoId)) {
    return { empleado: null, error: null };
  }

  const { data, error } = await supabase
    .from("empleados")
    .select(`
      id,
      tipo_documento_id,
      documento,
      nombre,
      apellido,
      correo,
      empresa_empleados!inner(empresa_id)
    `)
    .eq("id", empleadoId)
    .eq("empresa_empleados.empresa_id", empresaId)
    .maybeSingle();

  if (error) {
    return {
      empleado: null,
      error: "No se pudieron consultar los datos del empleado.",
    };
  }

  if (!data) {
    return { empleado: null, error: null };
  }

  return {
    empleado: {
      id: data.id,
      tipo_documento_id: data.tipo_documento_id,
      documento: data.documento,
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
    },
    error: null,
  };
}