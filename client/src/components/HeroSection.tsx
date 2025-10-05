import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  image: string;
  onExplore?: () => void;
}

export default function HeroSection({ title, subtitle, image, onExplore }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center parallax-slow"
        style={{ 
          backgroundImage: `url(${image})`,
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        
        <h1 
          className={`font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 px-2 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          data-testid="text-hero-title"
        >
          {title}
        </h1>
        
        {subtitle && (
          <p 
            className={`text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mb-8 sm:mb-12 px-4 font-light transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            data-testid="text-hero-subtitle"
          >
            {subtitle}
          </p>
        )}

        <Button
          size="lg"
          variant="outline"
          onClick={onExplore}
          className={`backdrop-blur-xl bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-1000 delay-500 group ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          data-testid="button-explore-portfolio"
        >
          <span className="mr-2">Explore Portfolio</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </Button>

        <button
          onClick={onExplore}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/80 animate-bounce hover:text-primary transition-colors"
          data-testid="button-scroll-indicator"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}
