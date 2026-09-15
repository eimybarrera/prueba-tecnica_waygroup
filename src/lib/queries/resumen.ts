import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ResultadoResumen } from "@/types/resumen";

export async function getResumenPanel(): Promise<ResultadoResumen> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [empresas, personas, vinculaciones, recientes] =
    await Promise.all([
      supabase
        .from("empresas")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("empleados")
        .select("id", { count: "exact", head: true }),

      supabase
        .from("empresa_empleados")
        .select("empleado_id", { count: "exact", head: true }),

      supabase
        .from("empresas")
        .select("id, nombre, nit, correo_contacto")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(5),
    ]);

  if (
    empresas.error ||
    personas.error ||
    vinculaciones.error ||
    recientes.error ||
    empresas.count === null ||
    personas.count === null ||
    vinculaciones.count === null
  ) {
    return {
      ok: false,
      message:
        "No se pudo cargar el resumen. Recarga la página para intentarlo nuevamente.",
    };
  }

  return {
    ok: true,
    resumen: {
      totalEmpresas: empresas.count,
      totalPersonas: personas.count,
      totalVinculaciones: vinculaciones.count,
      empresasRecientes: recientes.data ?? [],
    },
  };
}