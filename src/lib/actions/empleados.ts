"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  esUuid,
  validarEmpleado,
} from "@/lib/validations/empleado";
import type { EmpleadoFormState } from "@/types/empleado";

export async function crearEmpleado(
  empresaId: string,
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

  if (!esUuid(empresaId)) {
    return {
      message: "La empresa indicada no es válida.",
    };
  }

  const validacion = validarEmpleado(formData);

  if (!validacion.ok) {
    return {
      message: validacion.message,
    };
  }

  const { datos } = validacion;

  const { error } = await supabase.rpc(
    "crear_empleado_y_vincular",
    {
      p_empresa_id: empresaId,
      p_tipo_documento_id: datos.tipoDocumentoId,
      p_documento: datos.documento,
      p_nombre: datos.nombre,
      p_apellido: datos.apellido,
      p_correo: datos.correo,
    }
  );

  if (error) {
    if (error.code === "23505") {
      return {
        message:
          "Ya existe una persona con ese tipo y número de documento. No se creó otro registro.",
      };
    }

    if (error.code === "23503") {
      return {
        message:
          "La empresa o el tipo de documento ya no existe. Recarga la página.",
      };
    }

    if (error.code === "42501") {
      return {
        message:
          "No tienes permisos para registrar empleados. Comprueba tu sesión.",
      };
    }

    if (error.code === "23514" || error.code === "23502") {
      return {
        message:
          "Los datos no cumplen las reglas de la base de datos. Revisa los campos.",
      };
    }

    return {
      message:
        "No se pudo completar el registro. Consulta el listado antes de volver a intentarlo.",
    };
  }

  const rutaEmpleados = `/empresas/${empresaId}/empleados`;

  revalidatePath(rutaEmpleados);
  revalidatePath(`/empresas/${empresaId}`);
  revalidatePath("/dashboard");

  redirect(rutaEmpleados);
}