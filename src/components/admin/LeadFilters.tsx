"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LeadFiltersProps = {
  defaultQuery: string;
  defaultStatus: string;
  onApply: (filters: { q: string; status: string }) => void;
};

export function LeadFilters({ defaultQuery, defaultStatus, onApply }: LeadFiltersProps): React.JSX.Element {
  const [q, setQ] = useState(defaultQuery);
  const [status, setStatus] = useState(defaultStatus);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search name, email, phone, service" />
        <select
          className="h-10 rounded-md border border-slate-300 px-3 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="ALL">All statuses</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CONVERTED">CONVERTED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        <Button type="button" onClick={() => onApply({ q, status })}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
