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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  client: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

// Helper function to get portfolio image URL
const getPortfolioImageUrl = (item: any): string => {
  if (item.image) {
    // If it's a full URL (external), return as is
    if (item.image.startsWith('http')) {
      return item.image;
    }
    // If it's a local path, prefix with backend URL
    if (item.image.startsWith('/')) {
      return `${API_BASE_URL}/attached_assets${item.image}`;
    }
    // If it's a relative path, prefix with backend URL
    return `${API_BASE_URL}/attached_assets/${item.image}`;
  }
  return '';
};

export default function AdminPortfolio() {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ["/api/admin/portfolio"],
  });

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      client: "",
      location: "",
      category: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const res = await apiRequest("POST", "/api/admin/portfolio", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Portfolio item created" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to create item", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PortfolioFormData }) => {
      const res = await apiRequest("PUT", `/api/admin/portfolio/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ title: "Portfolio item updated" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to update item", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/portfolio"] });
      toast({ title: "Portfolio item deleted" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to delete item", description: error.message });
    },
  });

  const onSubmit = (data: PortfolioFormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      description: item.description,
      image: item.image || "",
      client: item.client || "",
      location: item.location || "",
      category: item.category || "",
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Showcase your completed projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-create-portfolio">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Project" : "Add Project"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update project details" : "Add a new project to your portfolio"}
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
                        <Input {...field} data-testid="input-title" placeholder="Luxury Penthouse Curtains" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-client" placeholder="Private Residence" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-location" placeholder="London, UK" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-category" placeholder="Residential, Commercial, etc." />
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
                        <Textarea {...field} data-testid="textarea-description" placeholder="Project description" rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-image-url" placeholder="https://example.com/image.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save">
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingItem ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(portfolio as any[])?.map((item) => (
          <Card key={item.id} data-testid={`card-portfolio-${item.id}`}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              {item.client && <CardDescription>{item.client}</CardDescription>}
            </CardHeader>
            <CardContent>
              {item.image && (
                <div className="mb-4">
                  <img 
                    src={getPortfolioImageUrl(item)} 
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(item)} data-testid={`button-edit-${item.id}`}>
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${item.id}`}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!portfolio || (portfolio as any[]).length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No portfolio items yet. Click "Add Project" to create one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
