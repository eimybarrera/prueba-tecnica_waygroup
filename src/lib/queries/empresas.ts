import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Empresa } from "@/types/empresa";

export type CampoBusquedaEmpresa = "nombre" | "nit";

type EmpresasResult = {
  empresas: Empresa[];
  total: number;
  error: string | null;
};

export const EMPRESAS_POR_PAGINA = 10;

export async function getEmpresas(
  busqueda: string,
  campo: CampoBusquedaEmpresa,
  pagina: number
): Promise<EmpresasResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const desde = (pagina - 1) * EMPRESAS_POR_PAGINA;
  const hasta = desde + EMPRESAS_POR_PAGINA - 1;

  let query = supabase
    .from("empresas")
    .select("id, nombre, nit, correo_contacto", {
      count: "exact",
    })
    .order("nombre", { ascending: true })
    .order("id", { ascending: true });

  if (busqueda) {
    const texto = busqueda.replace(/[\\%_]/g, "\\$&");
    query = query.ilike(campo, `%${texto}%`);
  }

  const { data, error, count } = await query.range(desde, hasta);

  if (error) {
    return {
      empresas: [],
      total: 0,
      error: "No fue posible consultar las empresas. Inténtalo nuevamente.",
    };
  }

  return {
    empresas: data ?? [],
    total: count ?? 0,
    error: null,
  };
}
type EmpresaDetalleResult =
  | { ok: true; empresa: Empresa }
  | { ok: false; message: string };

export async function getEmpresaById(
  empresaId: string
): Promise<EmpresaDetalleResult> {
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

  if (!uuidPattern.test(empresaId)) {
    notFound();
  }

  const { data, error } = await supabase
    .from("empresas")
    .select("id, nombre, nit, correo_contacto")
    .eq("id", empresaId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: "No fue posible consultar la empresa. Inténtalo nuevamente.",
    };
  }

  if (!data) {
    notFound();
  }

  return {
    ok: true,
    empresa: data,
  };
}