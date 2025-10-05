import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, FileText, ExternalLink } from "lucide-react";

const brochureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  pdfPath: z.string().min(1, "PDF path is required"),
});

type BrochureFormData = z.infer<typeof brochureSchema>;

interface Brochure {
  id: string;
  title: string;
  description: string;
  pdfPath: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBrochures() {
  const { toast } = useToast();
  const [editingBrochure, setEditingBrochure] = useState<Brochure | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: brochures, isLoading } = useQuery<Brochure[]>({
    queryKey: ["/api/admin/brochures"],
  });

  const form = useForm<BrochureFormData>({
    resolver: zodResolver(brochureSchema),
    defaultValues: {
      title: "",
      description: "",
      pdfPath: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BrochureFormData) => {
      const res = await apiRequest("POST", "/api/admin/brochures", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brochures"] });
      queryClient.invalidateQueries({ queryKey: ["/api/brochures"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Brochure created successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to create brochure", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BrochureFormData }) => {
      const res = await apiRequest("PUT", `/api/admin/brochures/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brochures"] });
      queryClient.invalidateQueries({ queryKey: ["/api/brochures"] });
      setIsDialogOpen(false);
      setEditingBrochure(null);
      form.reset();
      toast({ title: "Brochure updated successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to update brochure", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/brochures/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brochures"] });
      queryClient.invalidateQueries({ queryKey: ["/api/brochures"] });
      toast({ title: "Brochure deleted successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to delete brochure", description: error.message });
    },
  });

  const onSubmit = (data: BrochureFormData) => {
    if (editingBrochure) {
      updateMutation.mutate({ id: editingBrochure.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (brochure: Brochure) => {
    setEditingBrochure(brochure);
    form.reset({
      title: brochure.title,
      description: brochure.description,
      pdfPath: brochure.pdfPath,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBrochure(null);
    form.reset({
      title: "",
      description: "",
      pdfPath: "",
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brochures</h1>
          <p className="text-muted-foreground">Manage product brochures</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-add-brochure">
              <Plus className="w-4 h-4 mr-2" />
              Add Brochure
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBrochure ? "Edit Brochure" : "Create Brochure"}</DialogTitle>
              <DialogDescription>
                {editingBrochure ? "Update brochure information" : "Add a new brochure to your collection"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Newest Interior Collection 2024" {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the brochure..."
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pdfPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF Path</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/brochures/filename.pdf"
                          {...field}
                          data-testid="input-pdf-path"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-brochure"
                  >
                    {editingBrochure ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {brochures?.map((brochure) => (
          <Card key={brochure.id} data-testid={`brochure-card-${brochure.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-md bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="mb-2">{brochure.title}</CardTitle>
                    <CardDescription>{brochure.description}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">
                      PDF: {brochure.pdfPath}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    data-testid={`button-preview-${brochure.id}`}
                  >
                    <a href={brochure.pdfPath} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(brochure)}
                    data-testid={`button-edit-${brochure.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(brochure.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${brochure.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {brochures?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No brochures yet. Create your first one!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
