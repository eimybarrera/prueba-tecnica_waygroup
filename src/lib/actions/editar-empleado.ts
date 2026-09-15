"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esUuid, validarEmpleado } from "@/lib/validations/empleado";
import type { EmpleadoFormState } from "@/types/empleado";

export async function editarEmpleado(
  empresaId: string,
  empleadoId: string,
  _estadoAnterior: EmpleadoFormState,
  formData: FormData
): Promise<EmpleadoFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Tu sesión terminó. Inicia sesión nuevamente.",
    };
  }

  if (!esUuid(empresaId) || !esUuid(empleadoId)) {
    return {
      message: "La empresa o el empleado indicado no es válido.",
    };
  }

  const validacion = validarEmpleado(formData);

  if (!validacion.ok) {
    return { message: validacion.message };
  }

  const { data: vinculacion, error: errorVinculacion } = await supabase
    .from("empresa_empleados")
    .select("empleado_id")
    .eq("empresa_id", empresaId)
    .eq("empleado_id", empleadoId)
    .maybeSingle();

  if (errorVinculacion) {
    return {
      message: "No se pudo comprobar la vinculación del empleado.",
    };
  }

  if (!vinculacion) {
    return {
      message: "Este empleado no está vinculado a esta empresa.",
    };
  }

  const { datos } = validacion;

  const { data, error } = await supabase
    .from("empleados")
    .update({
      tipo_documento_id: datos.tipoDocumentoId,
      documento: datos.documento,
      nombre: datos.nombre,
      apellido: datos.apellido,
      correo: datos.correo || null,
    })
    .eq("id", empleadoId)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        message:
          "Otra persona ya tiene ese tipo y número de documento.",
      };
    }

    if (error.code === "23503") {
      return {
        message: "El tipo de documento seleccionado ya no existe.",
      };
    }

    if (error.code === "42501") {
      return {
        message: "No tienes permisos para editar este empleado.",
      };
    }

    if (error.code === "23514" || error.code === "23502") {
      return {
        message:
          "Los datos no cumplen las reglas de la base de datos.",
      };
    }

    return {
      message:
        "No se pudo completar la actualización. Consulta los datos antes de intentarlo nuevamente.",
    };
  }

  if (!data) {
    return {
      message:
        "No se actualizó el empleado. Puede que ya no exista o que no tengas permiso.",
    };
  }

  // Los datos de la persona se comparten entre sus empresas.
  revalidatePath("/empresas", "layout");
  revalidatePath("/dashboard");

  redirect(`/empresas/${empresaId}/empleados`);
}