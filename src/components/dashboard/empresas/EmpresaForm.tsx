"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Empresa } from "@/types/empresa";

type FormState = {
  message: string;
};

type EmpresaFormProps = {
  action: (
    previousState: FormState,
    formData: FormData
  ) => Promise<FormState>;
  empresa?: Empresa;
  cancelHref: string;
  submitLabel: string;
};

const initialState: FormState = {
  message: "",
};

export default function EmpresaForm({
  action,
  empresa,
  cancelHref,
  submitLabel,
}: EmpresaFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  const [nombre, setNombre] = useState(empresa?.nombre ?? "");
  const [nit, setNit] = useState(empresa?.nit ?? "");
  const [correo, setCorreo] = useState(
    empresa?.correo_contacto ?? ""
  );

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="nombre"
          className="mb-2 block text-sm font-medium"
        >
          Nombre de la empresa
        </label>

        <input
          id="nombre"
          name="nombre"
          type="text"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          required
          readOnly={pending}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="nit"
          className="mb-2 block text-sm font-medium"
        >
          NIT
        </label>

        <input
          id="nit"
          name="nit"
          type="text"
          value={nit}
          onChange={(event) => setNit(event.target.value)}
          required
          readOnly={pending}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="correo_contacto"
          className="mb-2 block text-sm font-medium"
        >
          Correo de contacto (opcional)
        </label>

        <input
          id="correo_contacto"
          name="correo_contacto"
          type="email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          readOnly={pending}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <p role="alert" className="text-sm text-red-700">
        {state.message}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Guardando..." : submitLabel}
        </button>

        {!pending && (
          <Link
            href={cancelHref}
            className="text-sm text-gray-700 hover:underline"
          >
            Cancelar
          </Link>
        )}
      </div>
    </form>
  );
}