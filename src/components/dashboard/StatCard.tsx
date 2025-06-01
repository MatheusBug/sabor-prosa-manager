import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  className?: string;
  trend?: string; // e.g. "+5.2% from last month"
  trendColor?: 'text-green-500' | 'text-red-500' | 'text-muted-foreground';
}

export function StatCard({ title, value, icon: Icon, description, className, trend, trendColor = 'text-muted-foreground' }: StatCardProps) {
  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {trend && <p className={`text-xs ${trendColor} pt-1`}>{trend}</p>}
      </CardContent>
    </Card>
  );
}

// Helper for cn if not already available (though it should be from utils)
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
