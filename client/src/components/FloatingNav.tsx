import { Home, Grid3x3, BookOpen, Phone } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

interface FloatingNavProps {
  activeItem?: string;
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'portfolio', label: 'Portfolio', icon: Grid3x3 },
  { id: 'process', label: 'Process', icon: BookOpen },
  { id: 'contact', label: 'Contact', icon: Phone },
];

export default function FloatingNav({ activeItem = 'home', items = defaultItems }: FloatingNavProps) {
  return (
    <nav 
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-card/90 border border-card-border rounded-full px-4 sm:px-8 py-2 sm:py-3 shadow-lg"
      data-testid="nav-floating"
    >
      <ul className="flex items-center gap-2 sm:gap-8">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <li key={item.id}>
              <button
                onClick={item.onClick}
                className={`flex flex-col items-center gap-1 transition-all hover-elevate px-3 sm:px-4 py-2 rounded-md ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                data-testid={`button-nav-${item.id}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] sm:text-xs font-bold">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
