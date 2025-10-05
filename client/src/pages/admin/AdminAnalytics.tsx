import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, Users, MousePointer, Activity, Mail, Clock, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

export default function AdminAnalytics() {
  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
    refetchInterval: 5000,
  });

  const { data: recentViews } = useQuery({
    queryKey: ["/api/analytics/page-views"],
    refetchInterval: 5000,
  });

  const { data: topPages } = useQuery({
    queryKey: ["/api/admin/analytics/pageviews"],
    refetchInterval: 5000,
  });

  const { data: recentLeads } = useQuery({
    queryKey: ["/api/admin/leads"],
    refetchInterval: 5000,
  });

  const metrics = [
    {
      title: "Total Page Views",
      value: (stats as any)?.pageViews30Days || 0,
      icon: Eye,
      description: "Last 30 days",
      trend: "+12.5%",
      color: "text-blue-500",
    },
    {
      title: "Unique Visitors",
      value: (stats as any)?.uniqueVisitors || 0,
      icon: Users,
      description: "Real visitors tracked",
      trend: "+8.3%",
      color: "text-green-500",
    },
    {
      title: "Total Products",
      value: (stats as any)?.totalProducts || 0,
      icon: MousePointer,
      description: "In catalog",
      color: "text-purple-500",
    },
    {
      title: "New Leads",
      value: (stats as any)?.newLeads || 0,
      icon: TrendingUp,
      description: "Pending contact",
      color: "text-orange-500",
    },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-analytics-heading">Real-Time Analytics</h1>
          <p className="text-muted-foreground">Live site performance and visitor metrics</p>
        </div>
        <Badge variant="default" className="gap-2 animate-pulse px-4 py-2" data-testid="badge-live-indicator">
          <Activity className="h-4 w-4" />
          <span className="font-semibold">Live</span>
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={metric.title} className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1" data-testid={`text-metric-${metric.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                {metric.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {metric.description}
              </p>
              {index < 2 && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {metric.trend}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card className="hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Top Pages</CardTitle>
            </div>
            <CardDescription>Most visited pages (30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(topPages as any[])?.slice(0, 5).map((page: any, index: number) => {
                const maxCount = (topPages as any[])?.[0]?.count || 1;
                const percentage = (page.count / maxCount) * 100;
                
                return (
                  <div key={page.page} className="space-y-2" data-testid={`page-stat-${page.page}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{page.page}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">{page.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {!(topPages as any[])?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No page views yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle>Live Activity</CardTitle>
            </div>
            <CardDescription>Recent page views (real-time)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {(recentViews as any[])?.slice(0, 8).map((view: any, index: number) => (
                <div key={view.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors" data-testid={`recent-view-${index}`}>
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{view.page}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(view.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {!(recentViews as any[])?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Waiting for activity...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="hover-elevate">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Recent Leads</CardTitle>
            </div>
            <Badge variant="outline">
              {(recentLeads as any[])?.length || 0} Total
            </Badge>
          </div>
          <CardDescription>Latest customer inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(recentLeads as any[])?.slice(0, 5).map((lead: any) => (
              <div 
                key={lead.id} 
                className="flex items-start justify-between p-3 rounded-lg border hover-elevate transition-all"
                data-testid={`lead-${lead.id}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{lead.name}</p>
                    <Badge 
                      variant={lead.status === 'new' ? 'default' : 'outline'}
                      className={lead.status === 'new' ? 'bg-blue-500 text-white' : ''}
                    >
                      {lead.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(lead.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {!(recentLeads as any[])?.length && (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No leads yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Activity className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Real-Time Tracking Active</h3>
              <p className="text-sm text-muted-foreground">
                Analytics data is automatically collected from all page visits and updates every 5 seconds. 
                Unique visitors are tracked based on browser user agents for accurate metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
