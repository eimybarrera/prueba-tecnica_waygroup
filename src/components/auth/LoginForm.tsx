"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { login, type LoginState } from "@/lib/actions/auth";
import MensajeError from "@/components/comunes/MensajeError";

const initialState: LoginState = {
  message: "",
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    initialState
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const claseInput =
    "h-13 w-full rounded-xl border border-line bg-white pl-12 pr-4 text-base text-ink outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-4 focus:ring-brand/10";

  return (
    <form action={formAction} className="mt-9 space-y-6">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Correo electrónico
        </label>

        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            readOnly={pending}
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={claseInput}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Contraseña
        </label>

        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          />

          <input
            id="password"
            name="password"
            type={mostrarPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            readOnly={pending}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${claseInput} pr-14`}
          />

          <button
            type="button"
            aria-label={
              mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            aria-pressed={mostrarPassword}
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
          >
            {mostrarPassword ? (
              <EyeOff aria-hidden="true" className="size-5" />
            ) : (
              <Eye aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </div>

      <MensajeError message={state.message} />

      <button
        type="submit"
        disabled={pending}
        className="flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Ingresando..." : "Iniciar sesión"}
        {!pending && <ArrowRight aria-hidden="true" className="size-5" />}
      </button>
    </form>
  );
}