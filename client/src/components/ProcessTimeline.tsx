import { useEffect, useState } from 'react';
import { MessageSquare, Palette, Scissors, Wrench, Heart } from 'lucide-react';

import consultationImage from '@assets/stock_images/interior_designer_co_7e784dbb.jpg';
import designImage from '@assets/stock_images/luxury_fabric_swatch_9eeb7352.jpg';
import fabricationImage from '@assets/stock_images/craftsman_sewing_cur_091ef85f.jpg';
import installationImage from '@assets/stock_images/professional_install_712bd200.jpg';
import aftercareImage from '@assets/stock_images/professional_people__602f9885.jpg';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

const defaultSteps: TimelineStep[] = [
  {
    id: 'consultation',
    title: 'Consultation',
    description: 'We begin with an in-depth consultation to understand your vision, space requirements, and functional needs.',
    icon: MessageSquare,
    image: consultationImage,
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Our designers create a bespoke solution, selecting fabrics, colors, and hardware that perfectly complement your interior.',
    icon: Palette,
    image: designImage,
  },
  {
    id: 'fabrication',
    title: 'Fabrication',
    description: 'Expert craftsmen meticulously construct your curtains using premium materials and time-honored techniques.',
    icon: Scissors,
    image: fabricationImage,
  },
  {
    id: 'installation',
    title: 'Installation',
    description: 'Professional installation ensures perfect drape and flawless operation, with attention to every detail.',
    icon: Wrench,
    image: installationImage,
  },
  {
    id: 'aftercare',
    title: 'Aftercare',
    description: 'We provide ongoing support and maintenance guidance to ensure your window treatments remain pristine.',
    icon: Heart,
    image: aftercareImage,
  },
];

export default function ProcessTimeline() {
  const [visibleSteps, setVisibleSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.3 }
    );

    defaultSteps.forEach((step) => {
      const element = document.getElementById(step.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 px-4" data-testid="section-process-timeline">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-6" data-testid="text-process-title">
            Our Process
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            From initial consultation to final installation, we guide you through every step with expertise and care.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {defaultSteps.map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleSteps.has(step.id);
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.id}
                id={step.id}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                data-testid={`timeline-step-${step.id}`}
              >
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
                  <div className="w-full md:w-1/2 group">
                    <div className="relative overflow-hidden rounded-md">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                        data-testid={`image-step-${step.id}`}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-primary font-medium tracking-wider uppercase">
                              Step {index + 1}
                            </p>
                            <h3 className="font-serif text-xl font-bold text-white">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-primary font-medium tracking-wider uppercase mb-2">
                          Step {index + 1}
                        </p>
                        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3" data-testid={`text-step-title-${step.id}`}>
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pl-0 md:pl-18" data-testid={`text-step-description-${step.id}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
