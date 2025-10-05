import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Calendar, Trash2, Eye, User, FileText, Clock } from "lucide-react";
import { formatDistance, format } from "date-fns";
import { useState } from "react";

const statusColors = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  converted: "bg-green-500",
  archived: "bg-gray-500",
};

const statusLabels = {
  new: "New",
  contacted: "Contacted", 
  converted: "Converted",
  archived: "Archived",
};

export default function AdminLeads() {
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["/api/admin/leads"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/leads/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({ title: "Lead status updated" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to update status", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({ title: "Lead deleted" });
      setSelectedLead(null);
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to delete lead", description: error.message });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">Loading leads...</div>
        </div>
      </div>
    );
  }

  const sortedLeads = (leads as any[])?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-leads-heading">Leads Management</h1>
          <p className="text-muted-foreground">Manage customer inquiries and track lead status</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <FileText className="h-3 w-3" />
          {sortedLeads.length} Total Leads
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusLabels).map(([status, label]) => {
          const count = sortedLeads.filter(lead => lead.status === status).length;
          return (
            <Card key={status} className="hover-elevate">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {sortedLeads.map((lead) => (
          <Card key={lead.id} className="hover-elevate transition-all" data-testid={`card-lead-${lead.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">{lead.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`${statusColors[lead.status as keyof typeof statusColors]} text-white border-0`}
                    >
                      {statusLabels[lead.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                        {lead.email}
                      </a>
                    </span>
                    {lead.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                          {lead.phone}
                        </a>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDistance(new Date(lead.createdAt), new Date(), { addSuffix: true })}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateStatusMutation.mutate({ id: lead.id, status: value })}
                  >
                    <SelectTrigger className="w-[140px]" data-testid={`select-status-${lead.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedLead(lead)}
                        data-testid={`button-view-${lead.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Lead Details</DialogTitle>
                        <DialogDescription>
                          Complete information for this lead inquiry
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <User className="h-4 w-4" />
                              Contact Person
                            </div>
                            <p className="text-lg font-semibold">{lead.name}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Submitted
                            </div>
                            <p className="text-lg font-semibold">
                              {format(new Date(lead.createdAt), 'PPpp')}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            Email Address
                          </div>
                          <a 
                            href={`mailto:${lead.email}`} 
                            className="text-lg font-semibold text-primary hover:underline"
                          >
                            {lead.email}
                          </a>
                        </div>

                        {lead.phone && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              Phone Number
                            </div>
                            <a 
                              href={`tel:${lead.phone}`} 
                              className="text-lg font-semibold text-primary hover:underline"
                            >
                              {lead.phone}
                            </a>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            Project Details
                          </div>
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {lead.projectDetails || 'No project details provided'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge 
                              className={`${statusColors[lead.status as keyof typeof statusColors]} text-white border-0`}
                            >
                              {statusLabels[lead.status as keyof typeof statusLabels]}
                            </Badge>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate(lead.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-dialog-${lead.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Lead
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteMutation.mutate(lead.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${lead.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Project Details:</p>
                <p className="text-sm leading-relaxed line-clamp-2">
                  {lead.projectDetails || 'No details provided'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedLeads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
            <p className="text-muted-foreground">
              Customer inquiries will appear here when they submit the contact form.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
