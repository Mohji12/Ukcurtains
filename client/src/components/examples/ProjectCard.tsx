import ProjectCard from '../ProjectCard';
import layeredImage from '@assets/generated_images/Layered_curtains_living_room_540027a7.png';

export default function ProjectCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <ProjectCard
        id="1"
        title="Layered Elegance"
        category="Living Room"
        image={layeredImage}
        onClick={() => console.log('Project card clicked')}
      />
    </div>
  );
}
