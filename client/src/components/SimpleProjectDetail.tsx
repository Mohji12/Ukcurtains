import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleProjectDetailProps {
  title: string;
  description: string | null;
  image: string | null;
  client: string | null;
  location: string | null;
  category: string | null;
  onClose?: () => void;
}

export default function SimpleProjectDetail({
  title,
  description,
  image,
  client,
  location,
  category,
  onClose,
}: SimpleProjectDetailProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto" data-testid="container-project-detail">
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-card-border flex items-center justify-center hover-elevate"
        data-testid="button-close-project"
      >
        <X className="w-6 h-6" />
      </button>

      {image && (
        <div className="relative h-[60vh]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            data-testid="img-project-hero"
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          {category && (
            <p className="text-primary text-sm font-medium tracking-wider uppercase mb-3" data-testid="text-project-category">
              {category}
            </p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6" data-testid="text-project-title">
            {title}
          </h1>
          
          {(client || location) && (
            <div className="flex flex-wrap gap-6 text-muted-foreground mb-6">
              {client && (
                <div>
                  <span className="font-medium text-foreground">Client: </span>
                  <span data-testid="text-project-client">{client}</span>
                </div>
              )}
              {location && (
                <div>
                  <span className="font-medium text-foreground">Location: </span>
                  <span data-testid="text-project-location">{location}</span>
                </div>
              )}
            </div>
          )}

          {description && (
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground" data-testid="text-project-description">
                {description}
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <Button 
            variant="outline" 
            onClick={onClose}
            data-testid="button-back-to-portfolio"
          >
            Back to Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
