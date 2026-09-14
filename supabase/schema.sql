BEGIN;

-- =========================================
-- 1. TIPOS DE DOCUMENTO
-- =========================================

CREATE TABLE public.tipos_documento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  nombre text NOT NULL,

  CONSTRAINT tipos_documento_nombre_unico
    UNIQUE (nombre),

  CONSTRAINT tipos_documento_nombre_valido
    CHECK (
      nombre ~ '[^[:space:]]'
      AND nombre = btrim(nombre)
    )
);

-- =========================================
-- 2. EMPRESAS
-- =========================================

CREATE TABLE public.empresas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  nombre text NOT NULL,
  nit text NOT NULL,
  correo_contacto text,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT empresas_nombre_valido
    CHECK (nombre ~ '[^[:space:]]'),

  CONSTRAINT empresas_nit_valido
    CHECK (
      nit ~ '[^[:space:]]'
      AND nit = btrim(nit)
    ),

  CONSTRAINT empresas_nit_unico
    UNIQUE (nit),

  CONSTRAINT empresas_correo_valido
    CHECK (
      correo_contacto IS NULL
      OR correo_contacto ~
        '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    )
);

-- =========================================
-- 3. EMPLEADOS
-- Una fila por persona.
-- =========================================

CREATE TABLE public.empleados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  tipo_documento_id uuid NOT NULL,
  documento text NOT NULL,

  nombre text NOT NULL,
  apellido text NOT NULL,
  correo text,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT empleados_tipo_documento_fk
    FOREIGN KEY (tipo_documento_id)
    REFERENCES public.tipos_documento(id)
    ON DELETE RESTRICT,

  CONSTRAINT empleados_identificacion_unica
    UNIQUE (tipo_documento_id, documento),

  CONSTRAINT empleados_documento_valido
    CHECK (
      documento ~ '[^[:space:]]'
      AND documento = btrim(documento)
    ),

  CONSTRAINT empleados_nombre_valido
    CHECK (nombre ~ '[^[:space:]]'),

  CONSTRAINT empleados_apellido_valido
    CHECK (apellido ~ '[^[:space:]]'),

  CONSTRAINT empleados_correo_valido
    CHECK (
      correo IS NULL
      OR correo ~
        '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    )
);

-- =========================================
-- 4. VINCULACIONES ENTRE EMPRESAS Y EMPLEADOS
-- =========================================

CREATE TABLE public.empresa_empleados (
  empresa_id uuid NOT NULL,
  empleado_id uuid NOT NULL,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT empresa_empleados_pk
    PRIMARY KEY (empresa_id, empleado_id),

  CONSTRAINT empresa_empleados_empresa_fk
    FOREIGN KEY (empresa_id)
    REFERENCES public.empresas(id)
    ON DELETE RESTRICT,

  CONSTRAINT empresa_empleados_empleado_fk
    FOREIGN KEY (empleado_id)
    REFERENCES public.empleados(id)
    ON DELETE RESTRICT
);

-- La clave primaria ya facilita buscar por empresa.
-- Este índice facilita buscar las empresas de un empleado.
CREATE INDEX empresa_empleados_empleado_idx
  ON public.empresa_empleados (empleado_id);

-- Facilita consultar las empresas más recientes.
CREATE INDEX empresas_created_at_idx
  ON public.empresas (created_at DESC, id DESC);

-- =========================================
-- 5. CATÁLOGO INICIAL
-- =========================================

INSERT INTO public.tipos_documento (nombre)
VALUES
  ('Cédula de ciudadanía'),
  ('Cédula de extranjería'),
  ('Tarjeta de identidad'),
  ('Pasaporte');

-- =========================================
-- 6. SEGURIDAD POR FILAS
-- =========================================

ALTER TABLE public.tipos_documento
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.empresas
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.empleados
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.empresa_empleados
  ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 7. PERMISOS DE LA APLICACIÓN
-- =========================================

REVOKE ALL ON TABLE
  public.tipos_documento,
  public.empresas,
  public.empleados,
  public.empresa_empleados
FROM anon, authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;

-- Usuarios con sesión: consultar las cuatro tablas.
GRANT SELECT ON TABLE
  public.tipos_documento,
  public.empresas,
  public.empleados,
  public.empresa_empleados
TO authenticated;

-- Crear empresas, empleados y vinculaciones.
GRANT INSERT ON TABLE
  public.empresas,
  public.empleados,
  public.empresa_empleados
TO authenticated;

-- Editar únicamente los campos del formulario.
GRANT UPDATE (nombre, nit, correo_contacto)
  ON public.empresas
  TO authenticated;

GRANT UPDATE (
  tipo_documento_id,
  documento,
  nombre,
  apellido,
  correo
)
  ON public.empleados
  TO authenticated;

-- =========================================
-- 8. POLÍTICAS DE ACCESO
-- =========================================

-- Catálogo: solo consulta desde la aplicación.
CREATE POLICY tipos_documento_consultar
  ON public.tipos_documento
  FOR SELECT TO authenticated
  USING (true);

-- Empresas
CREATE POLICY empresas_consultar
  ON public.empresas
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY empresas_crear
  ON public.empresas
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY empresas_editar
  ON public.empresas
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Empleados
CREATE POLICY empleados_consultar
  ON public.empleados
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY empleados_crear
  ON public.empleados
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY empleados_editar
  ON public.empleados
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Vinculaciones
CREATE POLICY empresa_empleados_consultar
  ON public.empresa_empleados
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY empresa_empleados_crear
  ON public.empresa_empleados
  FOR INSERT TO authenticated
  WITH CHECK (true);

COMMIT;