import CurtainTypeExplorer, { Maximize2, Moon, Zap, Layers } from '../CurtainTypeExplorer';
import sheerImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';
import blackoutImage from '@assets/generated_images/Blackout_curtains_bedroom_luxury_675bdda2.png';
import motorizedImage from '@assets/generated_images/Motorized_office_curtains_modern_7739fdbe.png';
import romanImage from '@assets/generated_images/Roman_blinds_dining_room_6a3151e1.png';

export default function CurtainTypeExplorerExample() {
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

  return <CurtainTypeExplorer types={curtainTypes} />;
}
