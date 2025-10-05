import SignatureCollection from '../SignatureCollection';
import sheerImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';
import blackoutImage from '@assets/generated_images/Blackout_curtains_bedroom_luxury_675bdda2.png';
import layeredImage from '@assets/generated_images/Layered_curtains_living_room_540027a7.png';

export default function SignatureCollectionExample() {
  const projects = [
    {
      id: '1',
      title: 'Ethereal Elegance',
      subtitle: 'Sheer Curtains',
      image: sheerImage,
    },
    {
      id: '2',
      title: 'Midnight Sanctuary',
      subtitle: 'Blackout Solutions',
      image: blackoutImage,
    },
    {
      id: '3',
      title: 'Layered Luxury',
      subtitle: 'Dual-Layer Systems',
      image: layeredImage,
    },
  ];

  return <SignatureCollection projects={projects} />;
}
