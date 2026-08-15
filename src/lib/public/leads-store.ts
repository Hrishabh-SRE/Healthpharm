import type { LeadInput, LeadRecord } from "@/types/lead";

const inMemoryLeads: LeadRecord[] = [];

export function createLead(input: LeadInput): LeadRecord {
  const lead: LeadRecord = {
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "NEW",
    ...input,
  };

  inMemoryLeads.push(lead);
  return lead;
}

export function getLeads(): LeadRecord[] {
  return inMemoryLeads;
}
