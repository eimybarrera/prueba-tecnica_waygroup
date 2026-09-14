"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {
  message: "",
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium"
        >
          Contraseña
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <p role="alert" className="text-sm text-red-700">
        {state.message}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}