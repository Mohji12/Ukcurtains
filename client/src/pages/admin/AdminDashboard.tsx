import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Grid3x3, Users, Eye } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const metrics = [
    {
      title: "Total Products",
      value: (stats as any)?.total_products || 0,
      icon: Package,
      description: "Active products",
    },
    {
      title: "Portfolio Items",
      value: (stats as any)?.total_portfolio || 0,
      icon: Grid3x3,
      description: "Showcase projects",
    },
    {
      title: "New Leads",
      value: (stats as any)?.new_leads || 0,
      icon: Users,
      description: "Awaiting contact",
    },
    {
      title: "Page Views (30d)",
      value: (stats as any)?.page_views_30_days || 0,
      icon: Eye,
      description: "Last 30 days",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin portal</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the sidebar to navigate to different sections of the admin portal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
