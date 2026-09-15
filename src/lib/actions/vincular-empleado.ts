"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esUuid } from "@/lib/validations/empleado";
import type {
  EmpleadoFormState,
  BuscarEmpleadoState,
} from "@/types/empleado";

export async function buscarEmpleadoExistente(
  _estadoAnterior: BuscarEmpleadoState,
  formData: FormData
): Promise<BuscarEmpleadoState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Tu sesión terminó. Inicia sesión nuevamente.",
      empleado: null,
    };
  }

  const tipo = formData.get("tipo_documento_id");
  const documentoIngresado = formData.get("documento");

  const documento =
    typeof documentoIngresado === "string"
      ? documentoIngresado.trim()
      : "";

  if (
    typeof tipo !== "string" ||
    !esUuid(tipo) ||
    !documento ||
    documento.length > 100
  ) {
    return {
      message: "Selecciona el tipo y escribe un documento válido.",
      empleado: null,
    };
  }

  const { data, error } = await supabase
    .from("empleados")
    .select("id, tipo_documento_id, documento, nombre, apellido")
    .eq("tipo_documento_id", tipo)
    .eq("documento", documento)
    .maybeSingle();

  if (error) {
    return {
      message: "No se pudo consultar la persona. Intenta nuevamente.",
      empleado: null,
    };
  }

  if (!data) {
    return {
      message:
        "No existe una persona con ese tipo y número de documento. Puedes registrarla desde Nuevo empleado.",
      empleado: null,
    };
  }

  return {
    message: "",
    empleado: data,
  };
}

export async function vincularEmpleadoExistente(
  empresaId: string,
  empleadoId: string
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

  const { error } = await supabase.rpc("vincular_empleado", {
    p_empresa_id: empresaId,
    p_empleado_id: empleadoId,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        message: "Esta persona ya está vinculada a esta empresa.",
      };
    }

    if (error.code === "23503") {
      return {
        message:
          "La empresa o el empleado ya no existe. Recarga la página.",
      };
    }

    if (error.code === "42501") {
      return {
        message:
          "No tienes permisos para vincular empleados. Comprueba tu sesión.",
      };
    }

    return {
      message:
        "No se pudo completar la vinculación. Consulta el listado antes de intentarlo nuevamente.",
    };
  }

  const ruta = `/empresas/${empresaId}/empleados`;

  revalidatePath(ruta);
  revalidatePath(`/empresas/${empresaId}`);
  revalidatePath("/dashboard");

  redirect(ruta);
}