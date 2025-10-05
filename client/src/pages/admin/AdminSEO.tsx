import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const seoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().optional().or(z.literal("")),
  ogImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type SEOFormData = z.infer<typeof seoSchema>;

const pages = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "portfolio", label: "Portfolio" },
  { value: "products", label: "Products" },
  { value: "contact", label: "Contact" },
];

export default function AdminSEO() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");

  const { data: seoSettings, isLoading } = useQuery({
    queryKey: [`/api/admin/seo/${selectedPage}`],
  });

  const form = useForm<SEOFormData>({
    resolver: zodResolver(seoSchema),
    values: seoSettings ? {
      title: (seoSettings as any).title || "",
      description: (seoSettings as any).description || "",
      keywords: (seoSettings as any).keywords || "",
      ogImage: (seoSettings as any).ogImage || "",
    } : {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SEOFormData) => {
      const res = await apiRequest("PUT", `/api/admin/seo/${selectedPage}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/seo/${selectedPage}`] });
      toast({ title: "SEO settings updated successfully" });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Failed to update SEO settings", description: error.message });
    },
  });

  const onSubmit = (data: SEOFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Settings</h1>
        <p className="text-muted-foreground">Optimize your site for search engines</p>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList>
          {pages.map((page) => (
            <TabsTrigger key={page.value} value={page.value} data-testid={`tab-${page.value}`}>
              {page.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedPage} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{pages.find(p => p.value === selectedPage)?.label} Page SEO</CardTitle>
              <CardDescription>Configure meta tags and SEO settings for this page</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Title</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-title" placeholder="Nowest Interior | Luxury Curtains & Blinds" />
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
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="textarea-description" placeholder="Bespoke luxury curtains and blinds..." rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords (comma-separated)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-keywords" placeholder="luxury curtains, blinds, window treatments" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ogImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OG Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-og-image" placeholder="https://example.com/og-image.jpg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-seo">
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
