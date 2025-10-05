import HeroSection from '@/components/HeroSection';
import SignatureCollection from '@/components/SignatureCollection';
import CurtainTypeExplorer from '@/components/CurtainTypeExplorer';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Maximize2, Moon, Zap, Layers } from 'lucide-react';

import heroImage from '@assets/stock_images/luxury_living_room_e_753bd7d5.jpg';
import sheerImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';
import blackoutImage from '@assets/generated_images/Blackout_curtains_bedroom_luxury_675bdda2.png';
import motorizedImage from '@assets/generated_images/Motorized_office_curtains_modern_7739fdbe.png';
import romanImage from '@assets/generated_images/Roman_blinds_dining_room_6a3151e1.png';
import layeredImage from '@assets/generated_images/Layered_curtains_living_room_540027a7.png';
import dramaticImage from '@assets/stock_images/luxury_curtains_flow_9cf016a6.jpg';

export default function Home() {
  const [, setLocation] = useLocation();

  const signatureProjects = [
    {
      id: '1',
      title: 'Ethereal Elegance',
      subtitle: 'Sheer Curtains',
      image: sheerImage,
    },
    {
      id: '2',
      title: 'Midnight Sanctuary',
      subtitle: 'Blackout Solutions',
      image: blackoutImage,
    },
    {
      id: '3',
      title: 'Layered Luxury',
      subtitle: 'Dual-Layer Systems',
      image: layeredImage,
    },
    {
      id: '4',
      title: 'Dramatic Ambiance',
      subtitle: 'Designer Collections',
      image: dramaticImage,
    },
  ];

  const curtainTypes = [
    {
      id: 'sheer',
      name: 'Sheers',
      icon: Maximize2,
      description: 'Elegant translucent fabrics that filter natural light while maintaining privacy and creating an ethereal ambiance.',
      image: sheerImage
    },
    {
      id: 'blackout',
      name: 'Blackout',
      icon: Moon,
      description: 'Complete light control and privacy with luxurious fabrics that offer superior insulation and sophisticated aesthetics.',
      image: blackoutImage
    },
    {
      id: 'motorized',
      name: 'Motorized',
      icon: Zap,
      description: 'Smart automation meets luxury design. Control your curtains with precision using advanced motorization technology.',
      image: motorizedImage
    },
    {
      id: 'roman',
      name: 'Roman Blinds',
      icon: Layers,
      description: 'Classic elegance with clean horizontal folds. Perfect for a tailored, sophisticated window treatment.',
      image: romanImage
    }
  ];

  const scrollToExplorer = () => {
    document.getElementById('curtain-explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <HeroSection
        title="Nowest Interior Ltd"
        subtitle="Luxury Blinds & Curtains Handcrafted in the UK Since 2002"
        image={heroImage}
        onExplore={scrollToExplorer}
      />

      <SignatureCollection projects={signatureProjects} />

      <div id="curtain-explorer">
        <CurtainTypeExplorer types={curtainTypes} />
      </div>

      <section className="relative py-24 md:py-32 px-4 text-center overflow-hidden">
        <div className="relative max-w-3xl mx-auto">
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4 animate-fade-slide-up" data-testid="text-cta-heading">
            Transform Your Home Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 px-4 animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
            Experience over 20 years of excellence in bespoke blinds and curtains. Free home consultation available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-fade-slide-up" style={{ animationDelay: '400ms' }}>
            <Button
              size="lg"
              onClick={() => setLocation('/portfolio')}
              className="group"
              data-testid="button-view-portfolio"
            >
              <span>View Full Portfolio</span>
              <div className="ml-2 w-0 group-hover:w-4 transition-all overflow-hidden">
                →
              </div>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => console.log('Book consultation')}
              className="group"
              data-testid="button-book-consultation"
            >
              <span>Book Consultation</span>
              <div className="ml-2 w-0 group-hover:w-4 transition-all overflow-hidden">
                ✦
              </div>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
