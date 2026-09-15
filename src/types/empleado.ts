export type EmpleadoListado = {
  id: string;
  documento: string;
  nombre: string;
  apellido: string;
  correo: string | null;
};

export type CampoBusquedaEmpleado =
  | "documento"
  | "nombre"
  | "apellido";

export type ResultadoListadoEmpleados = {
  empleados: EmpleadoListado[];
  total: number;
  error: string | null;
};
export type TipoDocumento = {
  id: string;
  nombre: string;
};

export type EmpleadoFormState = {
  message: string;
};
export type BuscarEmpleadoState = {
  message: string;
  empleado: {
    id: string;
    tipo_documento_id: string;
    documento: string;
    nombre: string;
    apellido: string;
  } | null;
};
export type EmpleadoDetalle = EmpleadoListado & {
  tipo_documento_id: string;
};