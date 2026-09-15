"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { editarEmpleado } from "@/lib/actions/editar-empleado";
import type {
  EmpleadoDetalle,
  EmpleadoFormState,
  TipoDocumento,
} from "@/types/empleado";

type EditarEmpleadoFormProps = {
  empresaId: string;
  empleado: EmpleadoDetalle;
  tiposDocumento: TipoDocumento[];
};

const estadoInicial: EmpleadoFormState = {
  message: "",
};

const camposTexto = [
  { name: "documento", label: "Número de documento" },
  { name: "nombre", label: "Nombre" },
  { name: "apellido", label: "Apellido" },
] as const;

export default function EditarEmpleadoForm({
  empresaId,
  empleado,
  tiposDocumento,
}: EditarEmpleadoFormProps) {
  const [valores, setValores] = useState({
    tipo_documento_id: empleado.tipo_documento_id,
    documento: empleado.documento,
    nombre: empleado.nombre,
    apellido: empleado.apellido,
    correo: empleado.correo ?? "",
  });

  const accion = editarEmpleado.bind(null, empresaId, empleado.id);

  const [state, formAction, pending] = useActionState(
    accion,
    estadoInicial
  );

  const claseCampo =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2";

  return (
    <form action={formAction} className="mt-6">
      <p className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
        Los cambios se aplicarán a esta persona en todas las empresas
        donde esté vinculada.
      </p>

      <fieldset disabled={pending} className="space-y-5">
        <div>
          <label
            htmlFor="tipo_documento_id"
            className="mb-2 block text-sm font-medium"
          >
            Tipo de documento
          </label>

          <select
            id="tipo_documento_id"
            name="tipo_documento_id"
            required
            value={valores.tipo_documento_id}
            onChange={(event) =>
              setValores({
                ...valores,
                tipo_documento_id: event.target.value,
              })
            }
            className={claseCampo}
          >
            <option value="">Selecciona una opción</option>

            {tiposDocumento.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        {camposTexto.map((campo) => (
          <div key={campo.name}>
            <label
              htmlFor={campo.name}
              className="mb-2 block text-sm font-medium"
            >
              {campo.label}
            </label>

            <input
              id={campo.name}
              name={campo.name}
              type="text"
              required
              maxLength={100}
              value={valores[campo.name]}
              onChange={(event) =>
                setValores({
                  ...valores,
                  [campo.name]: event.target.value,
                })
              }
              className={claseCampo}
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="correo"
            className="mb-2 block text-sm font-medium"
          >
            Correo electrónico (opcional)
          </label>

          <input
            id="correo"
            name="correo"
            type="email"
            maxLength={254}
            value={valores.correo}
            onChange={(event) =>
              setValores({
                ...valores,
                correo: event.target.value,
              })
            }
            className={claseCampo}
          />
        </div>

        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-brand px-4 py-2 text-white disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar cambios"}
          </button>

          {!pending && (
            <Link
              href={`/empresas/${empresaId}/empleados`}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              Cancelar
            </Link>
          )}
        </div>
      </fieldset>
    </form>
  );
}