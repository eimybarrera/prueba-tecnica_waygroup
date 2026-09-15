type CorreoBadgeProps = {
  correo: string | null;
};

export default function CorreoBadge({
  correo,
}: CorreoBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
        correo
          ? "bg-brand-light text-brand-dark"
          : "bg-canvas text-muted"
      }`}
    >
      {correo ? "Con correo" : "Sin correo"}
    </span>
  );
}