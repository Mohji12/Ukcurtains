import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import PortfolioGrid from '@/components/PortfolioGrid';
import SimpleProjectDetail from '@/components/SimpleProjectDetail';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Import fallback images
import sheerImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';
import blackoutImage from '@assets/generated_images/Blackout_curtains_bedroom_luxury_675bdda2.png';
import motorizedImage from '@assets/generated_images/Motorized_office_curtains_modern_7739fdbe.png';
import romanImage from '@assets/generated_images/Roman_blinds_dining_room_6a3151e1.png';
import layeredImage from '@assets/generated_images/Layered_curtains_living_room_540027a7.png';
import silkImage from '@assets/generated_images/Silk_fabric_drape_detail_e994039e.png';
import velvetImage from '@assets/generated_images/Velvet_fabric_texture_closeup_eb67914e.png';

// Portfolio type from database
interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  client: string | null;
  location: string | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Image fallback map based on category or title keywords
const portfolioImageMap: Record<string, string> = {
  'sheer': sheerImage,
  'blackout': blackoutImage,
  'motorized': motorizedImage,
  'motorised': motorizedImage,
  'roman': romanImage,
  'layered': layeredImage,
  'silk': silkImage,
  'velvet': velvetImage,
};

// Helper function to get portfolio image
const getPortfolioImage = (item: PortfolioItem): string => {
  if (item.image) return item.image;
  
  const titleKey = item.title.toLowerCase();
  const categoryKey = item.category?.toLowerCase() || '';
  
  for (const [key, img] of Object.entries(portfolioImageMap)) {
    if (titleKey.includes(key) || categoryKey.includes(key)) return img;
  }
  
  return sheerImage; // Default fallback
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch portfolio items from database
  const { data: allPortfolio, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/portfolio'],
  });

  // Transform database items to match PortfolioGrid expected format
  const transformedProjects = useMemo(() => {
    if (!allPortfolio) return [];
    
    return allPortfolio.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category || 'Uncategorized',
      image: getPortfolioImage(item),
    }));
  }, [allPortfolio]);

  // Extract unique categories from portfolio items
  const categories = useMemo(() => {
    const cats = new Set(transformedProjects.map(p => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [transformedProjects]);

  // Filter projects by active category
  const projects = activeCategory === 'All' 
    ? transformedProjects 
    : transformedProjects.filter(p => p.category === activeCategory);

  return (
    <>
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 overflow-hidden px-4">
            <div className="animate-fade-slide-up">
              <p className="text-primary text-xs sm:text-sm font-medium tracking-wider uppercase mb-2 sm:mb-3">Our Work</p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4" data-testid="text-portfolio-page-title">
                Portfolio
              </h1>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4 sm:mt-6" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12 px-4" data-testid="category-filters">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                      className={`text-xs sm:text-sm transition-all duration-300 ${
                        activeCategory === category 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'hover-elevate active-elevate-2'
                      }`}
                      data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}

              <div className="text-center mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-muted-foreground" data-testid="text-project-count">
                  {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <PortfolioGrid
        projects={projects}
        onProjectClick={(id) => setSelectedProjectId(id)}
      />

      {selectedProjectId && allPortfolio && (
        (() => {
          const selectedItem = allPortfolio.find(item => item.id === selectedProjectId);
          return selectedItem ? (
            <SimpleProjectDetail
              title={selectedItem.title}
              description={selectedItem.description}
              image={getPortfolioImage(selectedItem)}
              client={selectedItem.client}
              location={selectedItem.location}
              category={selectedItem.category}
              onClose={() => setSelectedProjectId(null)}
            />
          ) : null;
        })()
      )}
    </>
  );
}
