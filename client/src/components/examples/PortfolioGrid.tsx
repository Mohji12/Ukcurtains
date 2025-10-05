import PortfolioGrid from '../PortfolioGrid';
import sheerImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';
import blackoutImage from '@assets/generated_images/Blackout_curtains_bedroom_luxury_675bdda2.png';
import motorizedImage from '@assets/generated_images/Motorized_office_curtains_modern_7739fdbe.png';
import romanImage from '@assets/generated_images/Roman_blinds_dining_room_6a3151e1.png';
import layeredImage from '@assets/generated_images/Layered_curtains_living_room_540027a7.png';
import silkImage from '@assets/generated_images/Silk_fabric_drape_detail_e994039e.png';

export default function PortfolioGridExample() {
  const projects = [
    { id: '1', title: 'Ethereal Morning Light', category: 'Sheer Curtains', image: sheerImage },
    { id: '2', title: 'Midnight Sanctuary', category: 'Blackout', image: blackoutImage },
    { id: '3', title: 'Executive Suite', category: 'Motorized', image: motorizedImage },
    { id: '4', title: 'Scandinavian Simplicity', category: 'Roman Blinds', image: romanImage },
    { id: '5', title: 'Layered Luxury', category: 'Living Room', image: layeredImage },
    { id: '6', title: 'Champagne Dreams', category: 'Silk Drapes', image: silkImage },
  ];

  return <PortfolioGrid projects={projects} onProjectClick={(id) => console.log('Project clicked:', id)} />;
}
