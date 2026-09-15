import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TipoDocumento } from "@/types/empleado";

type ResultadoTiposDocumento = {
  tipos: TipoDocumento[];
  error: string | null;
};

export async function getTiposDocumento(): Promise<ResultadoTiposDocumento> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("tipos_documento")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    return {
      tipos: [],
      error: "No se pudieron cargar los tipos de documento.",
    };
  }

  return {
    tipos: data ?? [],
    error: null,
  };
}