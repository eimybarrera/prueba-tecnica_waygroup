import EmpresaForm from "@/components/dashboard/empresas/EmpresaForm";
import { crearEmpresa } from "@/lib/actions/empresas";

export default function CrearEmpresaForm() {
  return (
    <EmpresaForm
      action={crearEmpresa}
      cancelHref="/empresas"
      submitLabel="Guardar empresa"
    />
  );
}