import { useState } from 'react';
import ProjectDetail from '../ProjectDetail';
import layeredImage from '@assets/generated_images/Layered_curtains_living_room_540027a7.png';
import velvetImage from '@assets/generated_images/Velvet_fabric_texture_closeup_eb67914e.png';
import hardwareImage from '@assets/generated_images/Curtain_hardware_brass_detail_be02234e.png';
import sheerImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';

export default function ProjectDetailExample() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="p-8">
        <button onClick={() => setIsOpen(true)} className="text-primary">
          Open Project Detail
        </button>
      </div>
    );
  }

  return (
    <ProjectDetail
      title="Layered Luxury Living"
      category="Residential / Living Room"
      description="A sophisticated layering solution combining sheer elegance with rich velvet drapes, creating depth and versatility in light control while maintaining a cohesive aesthetic."
      challenge="The client required versatile light control for their open-plan living space while maintaining privacy and a sense of luxury. The large windows needed a solution that could transition from bright, airy daytime ambiance to cozy evening intimacy."
      solution="We designed a dual-layer system featuring ethereal white sheers paired with sumptuous burgundy velvet drapes. Custom motorization allows independent control of each layer, while brushed brass hardware adds a touch of refined elegance."
      images={[
        { url: layeredImage, caption: 'Full room view', type: 'standard' },
        { url: velvetImage, caption: 'Velvet fabric detail', type: 'standard' },
        { url: hardwareImage, caption: 'Hardware detail', type: 'standard' },
        { url: sheerImage, caption: 'Room transformation', type: 'before-after', beforeUrl: layeredImage },
      ]}
      fabricDetails={{
        type: 'Layered: Sheer Voile + Velvet',
        color: 'White Sheer / Burgundy Velvet',
        features: [
          'Premium velvet with subtle luster',
          'Light-filtering sheer underlayer',
          'Motorized dual-track system',
          'Custom brushed brass hardware',
          'Blackout lining available'
        ]
      }}
      onClose={() => setIsOpen(false)}
    />
  );
}
