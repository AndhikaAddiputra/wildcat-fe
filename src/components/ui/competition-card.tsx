import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export interface CompetitionCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  className?: string;
}

function CompetitionCard({
  icon,
  title,
  description,
  href = "#",
  className,
}: CompetitionCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border-2 border-navy bg-cream p-6",
        className
      )}
    >
      <div>
        {icon && (
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-orange">
            {icon}
          </div>
        )}
        <h3 className="mb-2 text-lg font-bold text-navy">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-navy/70">{description}</p>
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-2 self-start rounded-[20px] bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
      >
        Learn More
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

export { CompetitionCard };
