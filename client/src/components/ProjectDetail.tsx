import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BeforeAfterSlider from './BeforeAfterSlider';

interface ProjectImage {
  url: string;
  caption: string;
  type: 'standard' | 'before-after';
  beforeUrl?: string;
}

interface ProjectDetailProps {
  title: string;
  category: string;
  description: string;
  challenge?: string;
  solution?: string;
  images: ProjectImage[];
  fabricDetails?: {
    type: string;
    color: string;
    features: string[];
  };
  onClose?: () => void;
}

export default function ProjectDetail({
  title,
  category,
  description,
  challenge,
  solution,
  images,
  fabricDetails,
  onClose,
}: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto" data-testid="container-project-detail">
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-card-border flex items-center justify-center hover-elevate"
        data-testid="button-close-project"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative h-[70vh]">
        {currentImage.type === 'before-after' && currentImage.beforeUrl ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <BeforeAfterSlider
              beforeImage={currentImage.beforeUrl}
              afterImage={currentImage.url}
            />
          </div>
        ) : (
          <img
            src={currentImage.url}
            alt={currentImage.caption}
            className="w-full h-full object-cover"
            data-testid="img-project-hero"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-card-border flex items-center justify-center hover-elevate"
              data-testid="button-prev-image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-card-border flex items-center justify-center hover-elevate"
              data-testid="button-next-image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-primary text-sm font-medium mb-2" data-testid="text-project-category">
          {category}
        </p>
        <h1 className="font-serif text-5xl font-bold mb-6" data-testid="text-project-title">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground mb-12" data-testid="text-project-description">
          {description}
        </p>

        {challenge && (
          <div className="mb-12 animate-fade-slide-up">
            <h2 className="font-serif text-2xl font-bold mb-4" data-testid="text-challenge-heading">
              The Challenge
            </h2>
            <p className="text-muted-foreground" data-testid="text-challenge-content">
              {challenge}
            </p>
          </div>
        )}

        {solution && (
          <div className="mb-12 animate-fade-slide-up">
            <h2 className="font-serif text-2xl font-bold mb-4" data-testid="text-solution-heading">
              Our Solution
            </h2>
            <p className="text-muted-foreground" data-testid="text-solution-content">
              {solution}
            </p>
          </div>
        )}

        {fabricDetails && (
          <div className="p-8 bg-card border border-card-border rounded-md animate-fade-slide-in">
            <h2 className="font-serif text-2xl font-bold mb-6" data-testid="text-fabric-details-heading">
              Fabric Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="font-medium" data-testid="text-fabric-type">{fabricDetails.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Color</p>
                <p className="font-medium" data-testid="text-fabric-color">{fabricDetails.color}</p>
              </div>
            </div>
            {fabricDetails.features.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">Features</p>
                <ul className="space-y-2">
                  {fabricDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`text-fabric-feature-${index}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Button size="lg" data-testid="button-book-consultation">
            Book a Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
