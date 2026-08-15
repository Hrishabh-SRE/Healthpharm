import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export function Section({ children, className }: SectionProps): React.JSX.Element {
  return <section className={cn("py-12 sm:py-16", className)}>{children}</section>;
}
