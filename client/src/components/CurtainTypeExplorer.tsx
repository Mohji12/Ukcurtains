import { useState } from 'react';
import { Maximize2, Moon, Zap, Layers } from 'lucide-react';

interface CurtainType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  image: string;
}

interface CurtainTypeExplorerProps {
  types: CurtainType[];
}

export default function CurtainTypeExplorer({ types }: CurtainTypeExplorerProps) {
  const [selectedType, setSelectedType] = useState(types[0]);
  const [imageKey, setImageKey] = useState(0);

  const handleTypeChange = (type: CurtainType) => {
    setSelectedType(type);
    setImageKey(prev => prev + 1);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <p className="text-primary text-xs sm:text-sm font-medium tracking-wider uppercase mb-2 sm:mb-3">Our Services</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2" data-testid="text-curtain-types-title">
            Explore Our Collection
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-4 sm:mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
          {types.map((type, index) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type)}
                className={`group p-3 sm:p-4 md:p-6 rounded-md border transition-all duration-500 hover-elevate animate-fade-slide-up ${
                  selectedType.id === type.id
                    ? 'bg-primary text-primary-foreground border-primary-border scale-105'
                    : 'bg-card border-card-border'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`button-curtain-type-${type.id}`}
              >
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto mb-2 sm:mb-3 transition-transform duration-300 ${
                  selectedType.id === type.id ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                <p className="text-xs sm:text-sm font-medium">{type.name}</p>
              </button>
            );
          })}
        </div>

        <div className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] rounded-md overflow-hidden">
          <img
            key={imageKey}
            src={selectedType.image}
            alt={selectedType.name}
            className="w-full h-full object-cover animate-drape-reveal"
            data-testid="img-curtain-type-display"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <div className="animate-fade-slide-up">
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3" data-testid="text-selected-type-name">
                {selectedType.name}
              </h3>
              <p className="text-white/90 max-w-2xl text-sm sm:text-base md:text-lg" data-testid="text-selected-type-description">
                {selectedType.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Maximize2, Moon, Zap, Layers };
