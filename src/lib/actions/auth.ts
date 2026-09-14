"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateLogin } from "@/lib/validations/auth";

export type LoginState = {
  message: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const result = validateLogin(formData);

  if (!result.ok) {
    return { message: result.message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.email,
    password: result.password,
  });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { message: "Correo o contraseña incorrectos." };
    }

    if (error.code === "email_not_confirmed") {
      return { message: "Debes confirmar tu correo antes de ingresar." };
    }

    return {
      message: "No fue posible iniciar sesión. Inténtalo nuevamente.",
    };
  }

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    throw new Error("No fue posible cerrar sesión. Inténtalo nuevamente.");
  }

  redirect("/login");
} 