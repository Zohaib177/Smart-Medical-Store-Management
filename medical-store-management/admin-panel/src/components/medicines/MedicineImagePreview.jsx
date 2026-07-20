import { Pill } from "lucide-react";
import { useEffect, useState } from "react";
export default function MedicineImagePreview({
  src,
  alt,
  className = "h-12 w-12",
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed)
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100 ${className}`}
      >
        <Pill className="h-5 w-5" aria-hidden="true" />
      </span>
    );
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200 ${className}`}
    />
  );
}
