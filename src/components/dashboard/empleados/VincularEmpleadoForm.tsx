"use client";

import { useActionState, useState } from "react";
import {
  buscarEmpleadoExistente,
  vincularEmpleadoExistente,
} from "@/lib/actions/vincular-empleado";
import type {
  BuscarEmpleadoState,
  EmpleadoFormState,
  TipoDocumento,
} from "@/types/empleado";

type VincularEmpleadoFormProps = {
  empresaId: string;
  tiposDocumento: TipoDocumento[];
};

const estadoBusquedaInicial: BuscarEmpleadoState = {
  message: "",
  empleado: null,
};

const estadoVinculacionInicial: EmpleadoFormState = {
  message: "",
};

function ConfirmarVinculacion({
  empresaId,
  empleadoId,
}: {
  empresaId: string;
  empleadoId: string;
}) {
  const accion = vincularEmpleadoExistente.bind(
    null,
    empresaId,
    empleadoId
  );

  const [state, formAction, pending] = useActionState(
    accion,
    estadoVinculacionInicial
  );

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <p role="alert" className="text-sm text-red-700">
        {state.message}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-brand px-4 py-2 text-white disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Vinculando..." : "Vincular a esta empresa"}
      </button>
    </form>
  );
}

export default function VincularEmpleadoForm({
  empresaId,
  tiposDocumento,
}: VincularEmpleadoFormProps) {
  const [tipoDocumentoId, setTipoDocumentoId] = useState("");
  const [documento, setDocumento] = useState("");

  const [state, formAction, pending] = useActionState(
    buscarEmpleadoExistente,
    estadoBusquedaInicial
  );

  const empleado = state.empleado;

  const mostrarResultado =
    !pending &&
    empleado !== null &&
    empleado.tipo_documento_id === tipoDocumentoId &&
    empleado.documento === documento.trim();

  return (
    <div className="mt-6">
      <form action={formAction}>
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
              value={tipoDocumentoId}
              onChange={(event) =>
                setTipoDocumentoId(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              <option value="">Selecciona una opción</option>

              {tiposDocumento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="documento"
              className="mb-2 block text-sm font-medium"
            >
              Número de documento
            </label>

            <input
              id="documento"
              name="documento"
              type="text"
              required
              maxLength={100}
              value={documento}
              onChange={(event) => setDocumento(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-brand px-4 py-2 text-white disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Buscando..." : "Buscar persona"}
          </button>
        </fieldset>
      </form>

      {!pending && state.message && (
        <p role="status" className="mt-4 rounded-lg bg-canvas p-4">
          {state.message}
        </p>
      )}

      {mostrarResultado && empleado && (
        <section className="mt-6 rounded-lg border border-gray-200 p-4">
          <h2 className="font-semibold">Persona encontrada</h2>

          <p className="mt-2">
            {empleado.nombre} {empleado.apellido}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Documento: {empleado.documento}
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Comprueba que sea la persona que deseas vincular.
          </p>

          <ConfirmarVinculacion
            key={empleado.id}
            empresaId={empresaId}
            empleadoId={empleado.id}
          />
        </section>
      )}
    </div>
  );
}