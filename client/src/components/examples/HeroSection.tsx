import HeroSection from '../HeroSection';
import heroImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';

export default function HeroSectionExample() {
  return (
    <HeroSection
      title="Where Fabric Becomes Art"
      subtitle="Discover our curated collection of luxury curtain installations, crafted with meticulous attention to detail"
      image={heroImage}
      onExplore={() => console.log('Explore portfolio clicked')}
    />
  );
}
