type LoginValidation =
  | { ok: true; email: string; password: string }
  | { ok: false; message: string };

export function validateLogin(formData: FormData): LoginValidation {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (
    typeof emailValue !== "string" ||
    typeof passwordValue !== "string"
  ) {
    return {
      ok: false,
      message: "Debes ingresar correo y contraseña.",
    };
  }

  const email = emailValue.trim();
  const password = passwordValue;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      message: "Ingresa un correo válido.",
    };
  }

  if (password.length === 0) {
    return {
      ok: false,
      message: "Ingresa tu contraseña.",
    };
  }

  return { ok: true, email, password };
}