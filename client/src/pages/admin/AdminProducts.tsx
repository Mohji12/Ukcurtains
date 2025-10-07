import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  features: z.string().optional(), // Comma-separated features
});

type ProductFormData = z.infer<typeof productSchema>;

// Helper function to get product image URL
const getProductImageUrl = (product: any): string => {
  if (product.image) {
    // If it's a full URL (external), return as is
    if (product.image.startsWith('http')) {
      return product.image;
    }
    // If it's a local path, prefix with backend URL
    if (product.image.startsWith('/')) {
      return `${API_BASE_URL}/attached_assets${product.image}`;
    }
    // If it's a relative path, prefix with backend URL
    return `${API_BASE_URL}/attached_assets/${product.image}`;
  }
  return '';
};

export default function AdminProducts() {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      image: "",
      features: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Convert comma-separated features to array
      const productData = {
        ...data,
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      };
      const res = await apiRequest("POST", "/api/admin/products", productData);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Product created successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to create product", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      // Convert comma-separated features to array
      const productData = {
        ...data,
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      };
      const res = await apiRequest("PUT", `/api/admin/products/${id}`, productData);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      toast({ title: "Product updated successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to update product", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.refetchQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to delete product", description: error.message });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image || "",
      features: Array.isArray(product.features) ? product.features.join(', ') : "",
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    form.reset({
      name: "",
      category: "",
      description: "",
      image: "",
      features: "",
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-create-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product details" : "Add a new product to your catalog"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-product-name" placeholder="Wood Venetian Blinds" />
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
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="blinds">Blinds</SelectItem>
                          <SelectItem value="curtains">Curtains</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Textarea {...field} data-testid="textarea-description" placeholder="Product description" rows={4} />
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
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features (comma-separated, optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="textarea-features" placeholder="Feature 1, Feature 2, Feature 3" rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-product">
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingProduct ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(products as any[])?.map((product) => (
          <Card key={product.id} data-testid={`card-product-${product.id}`}>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>{product.category}</CardDescription>
            </CardHeader>
            <CardContent>
              {product.image && (
                <div className="mb-4">
                  <img 
                    src={getProductImageUrl(product)} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{product.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(product)} data-testid={`button-edit-${product.id}`}>
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(product.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${product.id}`}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!products || (products as any[]).length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No products yet. Click "Add Product" to create one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
