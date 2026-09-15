export type EmpresaReciente = {
  id: string;
  nombre: string;
  nit: string;
  correo_contacto: string | null;
};

export type ResumenPanel = {
  totalEmpresas: number;
  totalPersonas: number;
  totalVinculaciones: number;
  empresasRecientes: EmpresaReciente[];
};

export type ResultadoResumen =
  | { ok: true; resumen: ResumenPanel }
  | { ok: false; message: string };