import { useState } from 'react';
import FloatingNav from '../FloatingNav';
import { Home, Grid3x3, BookOpen, Phone } from 'lucide-react';

export default function FloatingNavExample() {
  const [activeItem, setActiveItem] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, onClick: () => setActiveItem('home') },
    { id: 'portfolio', label: 'Portfolio', icon: Grid3x3, onClick: () => setActiveItem('portfolio') },
    { id: 'process', label: 'Process', icon: BookOpen, onClick: () => setActiveItem('process') },
    { id: 'contact', label: 'Contact', icon: Phone, onClick: () => setActiveItem('contact') },
  ];

  return (
    <div className="h-96 relative bg-background">
      <FloatingNav activeItem={activeItem} items={navItems} />
    </div>
  );
}
