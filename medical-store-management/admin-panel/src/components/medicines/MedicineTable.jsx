import { Pill } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import LoadingCard from "../ui/LoadingCard";
import MedicineTableRow from "./MedicineTableRow";
export default function MedicineTable({
  medicines,
  isLoading,
  hasFilters,
  actions,
}) {
  if (isLoading)
    return (
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  if (!medicines.length)
    return (
      <div className="p-5">
        <EmptyState
          icon={Pill}
          title={hasFilters ? "No matching medicines" : "No medicines yet"}
          description={
            hasFilters
              ? "Try changing or clearing the current filters."
              : "Add your first medicine to begin managing store stock."
          }
        />
      </div>
    );
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[1380px] text-left">
        <thead className="bg-slate-50/80 text-[11px] font-bold uppercase text-slate-500">
          <tr>
            {[
              "Medicine",
              "Category",
              "Company",
              "Batch",
              "Sale Price",
              "Stock",
              "Expiry",
              "Status",
              "Actions",
            ].map((x) => (
              <th
                key={x}
                className={`px-4 py-3 ${x === "Actions" ? "text-right" : ""}`}
              >
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {medicines.map((m) => (
            <MedicineTableRow key={m.id} medicine={m} {...actions} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
