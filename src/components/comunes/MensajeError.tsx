import { CircleAlert } from "lucide-react";

type MensajeErrorProps = {
  message: string;
};

export default function MensajeError({
  message,
}: MensajeErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-danger/15 bg-danger-light px-4 py-3 text-sm text-danger"
    >
      <CircleAlert
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0"
      />
      <p>{message}</p>
    </div>
  );
}