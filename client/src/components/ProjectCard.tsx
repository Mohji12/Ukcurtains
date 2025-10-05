interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  onClick?: () => void;
}

export default function ProjectCard({ id, title, category, image, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-md cursor-pointer animate-breathe hover-elevate"
      data-testid={`card-project-${id}`}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
          data-testid={`img-project-${id}`}
        />
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-700 ease-out" />
      <div className="absolute bottom-0 right-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700 ease-out delay-100" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <p className="text-primary text-xs sm:text-sm font-medium mb-1 tracking-wider uppercase" data-testid={`text-project-category-${id}`}>
          {category}
        </p>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white" data-testid={`text-project-title-${id}`}>
          {title}
        </h3>
      </div>
    </div>
  );
}
