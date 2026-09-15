type DatosEmpleado = {
  tipoDocumentoId: string;
  documento: string;
  nombre: string;
  apellido: string;
  correo: string;
};

type ValidacionEmpleado =
  | { ok: true; datos: DatosEmpleado }
  | { ok: false; message: string };

export function esUuid(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    valor
  );
}

function leerTexto(formData: FormData, campo: string): string {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

export function validarEmpleado(
  formData: FormData
): ValidacionEmpleado {
  const datos: DatosEmpleado = {
    tipoDocumentoId: leerTexto(formData, "tipo_documento_id"),
    documento: leerTexto(formData, "documento"),
    nombre: leerTexto(formData, "nombre"),
    apellido: leerTexto(formData, "apellido"),
    correo: leerTexto(formData, "correo"),
  };

  if (!esUuid(datos.tipoDocumentoId)) {
    return {
      ok: false,
      message: "Selecciona un tipo de documento válido.",
    };
  }

  if (!datos.documento || datos.documento.length > 100) {
    return {
      ok: false,
      message: "El documento es obligatorio y admite hasta 100 caracteres.",
    };
  }

  if (!datos.nombre || datos.nombre.length > 100) {
    return {
      ok: false,
      message: "El nombre es obligatorio y admite hasta 100 caracteres.",
    };
  }

  if (!datos.apellido || datos.apellido.length > 100) {
    return {
      ok: false,
      message: "El apellido es obligatorio y admite hasta 100 caracteres.",
    };
  }

  if (
    datos.correo &&
    (datos.correo.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo))
  ) {
    return {
      ok: false,
      message: "Escribe un correo válido o deja ese campo vacío.",
    };
  }

  return { ok: true, datos };
}