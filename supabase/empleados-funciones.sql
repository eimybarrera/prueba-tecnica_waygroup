BEGIN;

-- Crear una persona nueva y vincularla a una empresa.
CREATE OR REPLACE FUNCTION public.crear_empleado_y_vincular(
  p_empresa_id uuid,
  p_tipo_documento_id uuid,
  p_documento text,
  p_nombre text,
  p_apellido text,
  p_correo text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_empleado_id uuid;
BEGIN
  -- Exigir una sesión de usuario.
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión.'
      USING ERRCODE = '42501';
  END IF;

  -- Comprobar que exista la empresa.
  IF NOT EXISTS (
    SELECT 1
    FROM public.empresas
    WHERE id = p_empresa_id
  ) THEN
    RAISE EXCEPTION 'La empresa no existe.'
      USING ERRCODE = '23503';
  END IF;

  -- Crear al empleado.
  -- Las restricciones de la tabla validan campos,
  -- tipo de documento, correo e identificación única.
  INSERT INTO public.empleados (
    tipo_documento_id,
    documento,
    nombre,
    apellido,
    correo
  )
  VALUES (
    p_tipo_documento_id,
    btrim(p_documento),
    btrim(p_nombre),
    btrim(p_apellido),
    nullif(btrim(p_correo), '')
  )
  RETURNING id INTO v_empleado_id;

  -- Vincularlo a la empresa.
  INSERT INTO public.empresa_empleados (
    empresa_id,
    empleado_id
  )
  VALUES (
    p_empresa_id,
    v_empleado_id
  );

  RETURN v_empleado_id;
END;
$$;

-- Vincular una persona que ya existe.
CREATE OR REPLACE FUNCTION public.vincular_empleado(
  p_empresa_id uuid,
  p_empleado_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión.'
      USING ERRCODE = '42501';
  END IF;

  -- Las claves foráneas comprueban que ambos registros existan.
  -- La clave primaria impide repetir la misma vinculación.
  INSERT INTO public.empresa_empleados (
    empresa_id,
    empleado_id
  )
  VALUES (
    p_empresa_id,
    p_empleado_id
  );
END;
$$;

-- Limitar la ejecución a usuarios autenticados.
REVOKE ALL ON FUNCTION public.crear_empleado_y_vincular(
  uuid, uuid, text, text, text, text
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.crear_empleado_y_vincular(
  uuid, uuid, text, text, text, text
) TO authenticated;

REVOKE ALL ON FUNCTION public.vincular_empleado(
  uuid, uuid
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.vincular_empleado(
  uuid, uuid
) TO authenticated;

COMMIT;