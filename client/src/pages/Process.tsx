import ProcessTimeline from '@/components/ProcessTimeline';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Process() {
  return (
    <div>
      <section className="relative py-32 md:py-40 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="animate-fade-slide-up">
            <p className="text-primary text-xs sm:text-sm font-medium tracking-wider uppercase mb-4 sm:mb-6">
              How We Work
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 px-4" data-testid="text-process-page-title">
              Our Bespoke Process
            </h1>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mb-8 sm:mb-10" />
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              Every project is a journey of collaboration, craftsmanship, and meticulous attention to detail. 
              From the first conversation to the final installation, we ensure your vision becomes reality.
            </p>
          </div>
        </div>
      </section>

      <ProcessTimeline />

      <section className="relative py-24 md:py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
        
        <div className="relative max-w-3xl mx-auto">
          <div className="animate-fade-slide-up">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4" data-testid="text-process-cta-heading">
              Begin Your Journey
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 px-4 max-w-2xl mx-auto leading-relaxed">
              Ready to experience the difference of truly bespoke window treatments? 
              Let's start with a complimentary consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button
                size="lg"
                onClick={() => console.log('Book consultation')}
                className="group w-full sm:w-auto"
                data-testid="button-start-consultation"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full sm:w-auto"
                data-testid="button-view-portfolio"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
