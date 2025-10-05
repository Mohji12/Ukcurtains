import BeforeAfterSlider from '../BeforeAfterSlider';
import sheerImage from '@assets/generated_images/Luxury_sheer_curtains_hero_53aa2ee0.png';
import layeredImage from '@assets/generated_images/Layered_curtains_living_room_540027a7.png';

export default function BeforeAfterSliderExample() {
  return (
    <div className="p-8 max-w-4xl">
      <BeforeAfterSlider
        beforeImage={sheerImage}
        afterImage={layeredImage}
        beforeLabel="Before"
        afterLabel="After"
      />
    </div>
  );
}
