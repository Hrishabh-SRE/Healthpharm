"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ClientSearchFiltersProps = {
  defaultQuery: string;
  defaultIncompleteOnly: boolean;
  onApply: (values: { q: string; incompleteOnly: boolean }) => void;
};

export function ClientSearchFilters({
  defaultQuery,
  defaultIncompleteOnly,
  onApply,
}: ClientSearchFiltersProps): React.JSX.Element {
  const [q, setQ] = useState(defaultQuery);
  const [incompleteOnly, setIncompleteOnly] = useState(defaultIncompleteOnly);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search name, email, phone" />
        <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 text-sm">
          <input type="checkbox" checked={incompleteOnly} onChange={(event) => setIncompleteOnly(event.target.checked)} />
          Incomplete profiles only
        </label>
        <Button type="button" onClick={() => onApply({ q, incompleteOnly })}>
          Apply
        </Button>
      </div>
    </div>
  );
}
