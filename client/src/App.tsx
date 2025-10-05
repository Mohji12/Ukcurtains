import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingNav from "@/components/FloatingNav";
import { usePageViewTracking } from "@/hooks/usePageViewTracking";
import { Home as HomeIcon, Info, Grid3x3, Package, Phone, Share2 } from 'lucide-react';

import Home from "@/pages/Home";
import About from "@/pages/About";
import Portfolio from "@/pages/Portfolio";
import Products from "@/pages/Products";
import Contact from "@/pages/Contact";
import SocialReviews from "@/pages/SocialReviews";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminPortfolio from "@/pages/admin/AdminPortfolio";
import AdminBrochures from "@/pages/admin/AdminBrochures";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminSEO from "@/pages/admin/AdminSEO";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminLayout from "@/components/admin/AdminLayout";

function Router() {
  const [location, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState('home');

  // Track page views
  usePageViewTracking();

  useEffect(() => {
    const path = location.split('/')[1] || 'home';
    setActiveNav(path);
    window.scrollTo(0, 0);
  }, [location]);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, onClick: () => setLocation('/') },
    { id: 'about', label: 'About', icon: Info, onClick: () => setLocation('/about') },
    { id: 'portfolio', label: 'Portfolio', icon: Grid3x3, onClick: () => setLocation('/portfolio') },
    { id: 'products', label: 'Products', icon: Package, onClick: () => setLocation('/products') },
    { id: 'social', label: 'Social', icon: Share2, onClick: () => setLocation('/social') },
    { id: 'contact', label: 'Contact', icon: Phone, onClick: () => setLocation('/contact') },
  ];

  const isAdminRoute = location.startsWith('/admin');

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/products" component={Products} />
        <Route path="/social" component={SocialReviews} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard">
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </Route>
        <Route path="/admin/products">
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        </Route>
        <Route path="/admin/portfolio">
          <AdminLayout>
            <AdminPortfolio />
          </AdminLayout>
        </Route>
        <Route path="/admin/brochures">
          <AdminLayout>
            <AdminBrochures />
          </AdminLayout>
        </Route>
        <Route path="/admin/leads">
          <AdminLayout>
            <AdminLeads />
          </AdminLayout>
        </Route>
        <Route path="/admin/seo">
          <AdminLayout>
            <AdminSEO />
          </AdminLayout>
        </Route>
        <Route path="/admin/analytics">
          <AdminLayout>
            <AdminAnalytics />
          </AdminLayout>
        </Route>
        <Route component={NotFound} />
      </Switch>
      {!isAdminRoute && <FloatingNav activeItem={activeNav} items={navItems} />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
