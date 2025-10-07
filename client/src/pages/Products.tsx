import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Building2, School, Trophy, Hospital, Star, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API_BASE_URL } from '@/lib/config';

import woodVenetianImg from '@assets/stock_images/wooden_venetian_blin_7e7829a6.jpg';
import visionBlindsImg from '@assets/stock_images/vision_blinds_day_an_8fbcb2d3.jpg';
import visageBlindsImg from '@assets/stock_images/visage_blinds_dual_l_4c4b6727.jpg';
import rollerBlindsImg from '@assets/stock_images/roller_blinds_modern_b7d98dd5.jpg';
import romanBlindsImg from '@assets/stock_images/roman_blinds_luxury__00686ca9.jpg';
import verticalBlindsImg from '@assets/stock_images/vertical_blinds_pati_2902750d.jpg';
import metalVenetianImg from '@assets/stock_images/metal_venetian_blind_7d4a6cdc.jpg';
import perfectFitImg from '@assets/stock_images/perfectfit_blinds_no_532bb41d.jpg';
import fauxWoodImg from '@assets/stock_images/faux_wood_blinds_bat_cfc49af7.jpg';
import panelBlindsImg from '@assets/stock_images/panel_blinds_sliding_3166318b.jpg';
import allusionBlindsImg from '@assets/stock_images/allusion_blinds_shee_0e0b9a49.jpg';
import mirageBlindsImg from '@assets/stock_images/mirage_blinds_light__c774c44c.jpg';
import pleatedBlindsImg from '@assets/stock_images/pleated_honeycomb_ce_2e6d3ab7.jpg';
import conservatoryImg from '@assets/stock_images/conservatory_roof_bl_1f8a1c9e.jpg';
import motorizedBlindsImg from '@assets/stock_images/motorized_automated__4b820a60.jpg';
import shuttersImg from '@assets/stock_images/plantation_shutters__c750720c.jpg';

import curtainsImg from '@assets/stock_images/luxury_made_to_measu_6dae048d.jpg';
import voilesImg from '@assets/stock_images/sheer_voile_curtains_822a8630.jpg';
import pelmetsImg from '@assets/stock_images/window_pelmet_curtai_8fc5ffd3.jpg';
import valancesImg from '@assets/stock_images/soft_valance_curtain_624784fd.jpg';
import swagsImg from '@assets/stock_images/swag_and_tail_curtai_7b5ba833.jpg';
import tieBacksImg from '@assets/stock_images/curtain_tie_backs_de_b5e76d59.jpg';
import cushionsImg from '@assets/stock_images/decorative_cushions__db1ebd25.jpg';
import tracksPolesImg from '@assets/stock_images/curtain_track_pole_h_50fcf83a.jpg';
import fabricsImg from '@assets/stock_images/luxury_curtain_fabri_27a5d197.jpg';
import liningsImg from '@assets/stock_images/curtain_lining_black_7638d50c.jpg';
import headboardsImg from '@assets/stock_images/upholstered_headboar_fa080734.jpg';

import commercialCurtainsImg from '@assets/stock_images/commercial_bespoke_c_80ae7c98.jpg';
import commercialRollerImg from '@assets/stock_images/commercial_roller_bl_51cfb099.jpg';
import commercialWoodImg from '@assets/stock_images/commercial_wood_vene_603918fb.jpg';
import commercialMetalImg from '@assets/stock_images/commercial_metal_ven_9f8b9615.jpg';
import commercialVerticalImg from '@assets/stock_images/commercial_vertical__41d14c90.jpg';
import commercialMotorizedImg from '@assets/stock_images/commercial_motorized_1ba2a261.jpg';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  category: string;
  features: string[];
}

interface Brochure {
  id: string;
  title: string;
  description: string;
  pdf_path: string;
  created_at: string;
  updated_at: string;
}

// Fallback images for products without database images
const productImageMap: Record<string, string> = {
  'wood venetian': woodVenetianImg,
  'vision': visionBlindsImg,
  'visage': visageBlindsImg,
  'roller': rollerBlindsImg,
  'roman': romanBlindsImg,
  'vertical': verticalBlindsImg,
  'metal venetian': metalVenetianImg,
  'perfectfit': perfectFitImg,
  'faux wood': fauxWoodImg,
  'panel': panelBlindsImg,
  'allusion': allusionBlindsImg,
  'mirage': mirageBlindsImg,
  'pleated': pleatedBlindsImg,
  'conservatory': conservatoryImg,
  'motorised': motorizedBlindsImg,
  'motorized': motorizedBlindsImg,
  'shutters': shuttersImg,
  'curtains': curtainsImg,
  'made-to-measure': curtainsImg,
  'voiles': voilesImg,
  'pelmets': pelmetsImg,
  'valances': valancesImg,
  'swags': swagsImg,
  'tie-backs': tieBacksImg,
  'cushions': cushionsImg,
  'tracks': tracksPolesImg,
  'poles': tracksPolesImg,
  'fabrics': fabricsImg,
  'linings': liningsImg,
  'headboards': headboardsImg,
  'commercial curtains': commercialCurtainsImg,
  'commercial roller': commercialRollerImg,
  'commercial wood': commercialWoodImg,
  'commercial metal': commercialMetalImg,
  'commercial vertical': commercialVerticalImg,
  'commercial motorised': commercialMotorizedImg,
  'commercial motorized': commercialMotorizedImg,
};

// Helper function to get product image
const getProductImage = (product: Product): string => {
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
  
  const nameKey = product.name.toLowerCase();
  for (const [key, img] of Object.entries(productImageMap)) {
    if (nameKey.includes(key)) return img;
  }
  
  return woodVenetianImg; // Default fallback
};

// Helper function to get brochure PDF URL
const getBrochurePdfUrl = (brochure: Brochure): string => {
  if (brochure.pdf_path) {
    // If it's a full URL (external), return as is
    if (brochure.pdf_path.startsWith('http')) {
      return brochure.pdf_path;
    }
    // If it's a local path, prefix with backend URL
    if (brochure.pdf_path.startsWith('/')) {
      return `${API_BASE_URL}/attached_assets${brochure.pdf_path}`;
    }
    // If it's a relative path, prefix with backend URL
    return `${API_BASE_URL}/attached_assets/${brochure.pdf_path}`;
  }
  
  return ''; // No fallback for PDFs
};

export default function Products() {
  const [activeTab, setActiveTab] = useState('blinds');

  // Fetch products from database
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch brochures from database
  const { data: brochures, isLoading: isLoadingBrochures } = useQuery<Brochure[]>({
    queryKey: ['/api/brochures'],
  });

  // Filter products by category
  const blindsProducts = allProducts?.filter(p => p.category === 'blinds') || [];
  const curtainsProducts = allProducts?.filter(p => p.category === 'curtains') || [];
  const commercialProducts = allProducts?.filter(p => p.category === 'commercial') || [];

  const clients = [
    { icon: Building2, name: 'Government Departments' },
    { icon: School, name: 'Schools & Universities' },
    { icon: Trophy, name: 'Premier League Clubs' },
    { icon: Hospital, name: 'Hospitals & Healthcare' },
    { icon: Star, name: 'Prestigious Private Sector' }
  ];

  return (
    <div className="pb-40 sm:pb-44">
      <section className="relative py-12 md:py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="animate-fade-slide-up">
            <p className="text-primary text-xs sm:text-sm font-medium tracking-wider uppercase mb-4">
              Our Collection
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Luxury Curtains<br />& Blinds
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover our comprehensive range of bespoke window treatments, from traditional curtains 
              to modern automated blinds, crafted with precision and style
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
              <TabsTrigger value="blinds" data-testid="tab-blinds">Blinds</TabsTrigger>
              <TabsTrigger value="curtains" data-testid="tab-curtains">Curtains</TabsTrigger>
              <TabsTrigger value="commercial" data-testid="tab-commercial">Commercial</TabsTrigger>
              <TabsTrigger value="brochures" data-testid="tab-brochures">Brochures</TabsTrigger>
            </TabsList>

            <TabsContent value="blinds" className="space-y-16">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blindsProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group"
                      data-testid={`product-${product.id}`}
                    >
                      <div className="relative overflow-hidden rounded-md mb-4">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          data-testid={`image-${product.id}`}
                        />
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2" data-testid={`text-${product.id}-name`}>
                        {product.name}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                        {product.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="curtains" className="space-y-16">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {curtainsProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group"
                      data-testid={`product-${product.id}`}
                    >
                      <div className="relative overflow-hidden rounded-md mb-4">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          data-testid={`image-${product.id}`}
                        />
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2" data-testid={`text-${product.id}-name`}>
                        {product.name}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                        {product.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="commercial" className="space-y-16">
              <div className="bg-card/30 rounded-lg p-8 md:p-12 mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-center">
                  Commercial Blinds and Curtains
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-4xl mx-auto text-center">
                  Nowest Interior Ltd is a trusted contractor and subcontractor, providing a wide range of commercial blinds and curtains to suit any professional environment. We work across both the private and public sectors, understanding the specific needs of commercial clients and delivering solutions that combine quality, durability, and style.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mt-8">
                  {clients.map((client, idx) => {
                    const Icon = client.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-md bg-background">
                        <Icon className="w-8 h-8 text-primary" />
                        <span className="text-xs sm:text-sm text-center font-medium">{client.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {commercialProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group"
                      data-testid={`product-${product.id}`}
                    >
                      <div className="relative overflow-hidden rounded-md mb-4">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          data-testid={`image-${product.id}`}
                        />
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2" data-testid={`text-${product.id}-name`}>
                        {product.name}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                        {product.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="brochures" className="space-y-16">
              <div className="bg-card/30 rounded-lg p-8 md:p-12 mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-center">
                  Product Brochures
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-4xl mx-auto text-center">
                  Browse our collection of product brochures featuring our complete range of blinds, curtains, and window treatments. View them directly in your browser or download for later reference.
                </p>
              </div>

              {isLoadingBrochures ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {brochures?.map((brochure) => (
                    <div
                      key={brochure.id}
                      className="group bg-card rounded-lg p-6 hover-elevate transition-all"
                      data-testid={`brochure-${brochure.id}`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-md bg-primary/10">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold mb-2" data-testid={`text-${brochure.id}-title`}>
                            {brochure.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {brochure.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" className="flex-1" data-testid={`button-view-${brochure.id}`}>
                              <FileText className="w-4 h-4 mr-2" />
                              View PDF
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] sm:w-[min(95vw,80rem)] sm:h-[min(90vh,60rem)] max-w-none p-0 sm:p-4">
                            <div className="flex h-full flex-col">
                              <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                                <DialogTitle>{brochure.title}</DialogTitle>
                                <DialogDescription className="sr-only">{brochure.description}</DialogDescription>
                              </DialogHeader>
                              <div className="flex-1 min-h-0 px-4 pb-4 sm:px-6 sm:pb-6">
                                <iframe
                                  src={getBrochurePdfUrl(brochure)}
                                  className="w-full h-full rounded-none sm:rounded-md border-0"
                                  title={brochure.title}
                                  data-testid={`pdf-viewer-${brochure.id}`}
                                  onError={(e) => {
                                    console.error('PDF iframe failed to load:', e);
                                    // Fallback: try to open in new tab
                                    window.open(getBrochurePdfUrl(brochure), '_blank');
                                  }}
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          data-testid={`button-download-${brochure.id}`}
                        >
                          <a href={getBrochurePdfUrl(brochure)} target="_blank" rel="noopener noreferrer" download>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
