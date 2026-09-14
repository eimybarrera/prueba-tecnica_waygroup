type EmpresaInput = {
  nombre: string;
  nit: string;
  correo_contacto: string | null;
};

type EmpresaValidation =
  | { ok: true; data: EmpresaInput }
  | { ok: false; message: string };

export function validateEmpresa(
  formData: FormData
): EmpresaValidation {
  const nombreValue = formData.get("nombre");
  const nitValue = formData.get("nit");
  const correoValue = formData.get("correo_contacto");

  if (
    typeof nombreValue !== "string" ||
    typeof nitValue !== "string" ||
    typeof correoValue !== "string"
  ) {
    return {
      ok: false,
      message: "Los datos del formulario no son válidos.",
    };
  }

  const nombre = nombreValue.trim();
  const nit = nitValue.trim();
  const correo = correoValue.trim();

  if (!nombre) {
    return {
      ok: false,
      message: "El nombre de la empresa es obligatorio.",
    };
  }

  if (!nit) {
    return {
      ok: false,
      message: "El NIT es obligatorio.",
    };
  }

  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return {
      ok: false,
      message: "Ingresa un correo de contacto válido.",
    };
  }

  return {
    ok: true,
    data: {
      nombre,
      nit,
      correo_contacto: correo || null,
    },
  };
}