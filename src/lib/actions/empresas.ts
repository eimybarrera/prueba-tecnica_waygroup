"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validateEmpresa } from "@/lib/validations/empresa";

export type CrearEmpresaState = {
  message: string;
};

export async function crearEmpresa(
  _previousState: CrearEmpresaState,
  formData: FormData,
): Promise<CrearEmpresaState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const result = validateEmpresa(formData);

  if (!result.ok) {
    return { message: result.message };
  }

  const { error } = await supabase.from("empresas").insert(result.data);

  if (error) {
    if (error.code === "23505") {
      return {
        message: "Ya existe una empresa registrada con ese NIT.",
      };
    }

    return {
      message: "No fue posible guardar la empresa. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/empresas");
  revalidatePath("/dashboard");

  redirect("/empresas?creada=1");
}
export type EditarEmpresaState = {
  message: string;
};

export async function editarEmpresa(
  empresaId: string,
  _previousState: EditarEmpresaState,
  formData: FormData,
): Promise<EditarEmpresaState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (typeof empresaId !== "string" || !uuidPattern.test(empresaId)) {
    return {
      message: "El identificador de la empresa no es válido.",
    };
  }

  const result = validateEmpresa(formData);

  if (!result.ok) {
    return { message: result.message };
  }

  const { data, error } = await supabase
    .from("empresas")
    .update(result.data)
    .eq("id", empresaId)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        message: "Ya existe otra empresa registrada con ese NIT.",
      };
    }

    return {
      message: "No fue posible actualizar la empresa. Inténtalo nuevamente.",
    };
  }

  if (!data) {
    return {
      message: "La empresa no existe o no tienes permiso para editarla.",
    };
  }

  revalidatePath("/empresas");
  revalidatePath("/dashboard");
  revalidatePath(`/empresas/${empresaId}`);
  revalidatePath(`/empresas/${empresaId}/editar`);

  redirect("/empresas?actualizada=1");
}
