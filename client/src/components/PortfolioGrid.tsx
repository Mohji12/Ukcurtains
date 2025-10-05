import { useEffect, useRef, useState } from 'react';
import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface PortfolioGridProps {
  projects: Project[];
  onProjectClick?: (id: string) => void;
}

export default function PortfolioGrid({ projects, onProjectClick }: PortfolioGridProps) {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((card, index) => {
      if (!card) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set([...Array.from(prev), index]));
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(card);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [projects.length]);

  return (
    <section className="pb-24 px-4" data-testid="section-portfolio-grid">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`scroll-reveal ${visibleCards.has(index) ? 'revealed' : ''}`}
              style={{ 
                transitionDelay: `${(index % 3) * 100}ms`,
              }}
            >
              <ProjectCard
                {...project}
                onClick={() => onProjectClick?.(project.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
