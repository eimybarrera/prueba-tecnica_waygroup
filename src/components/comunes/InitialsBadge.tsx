type InitialsBadgeProps = {
  nombre: string;
};

export default function InitialsBadge({
  nombre,
}: InitialsBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-sm font-semibold text-brand-dark"
    >
      {nombre.trim().slice(0, 2).toUpperCase() || "—"}
    </span>
  );
}