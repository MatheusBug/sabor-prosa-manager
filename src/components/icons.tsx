import type { SVGProps } from 'react';
import { Utensils } from 'lucide-react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2 text-primary" aria-label="Sabor & Prosa Manager Logo">
      <Utensils className="h-8 w-8" />
      <span className="text-xl font-bold font-headline">Sabor & Prosa Manager</span>
    </div>
  );
}
