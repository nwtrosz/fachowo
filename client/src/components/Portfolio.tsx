import { useState, useEffect } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

/**
 * Portfolio Section Component
 * Fachowo.eu - Construction, Renovations & Flooring
 * 
 * Design: Bold Structural Modernism
 * - Grid layout for project cards
 * - Image overlays with hover effects
 * - Category badges
 * - Filtering functionality
 */

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch projects', err);
        setLoading(false);
      });
  }, []);

  // Generate unique categories for filtering
  const categories = ['Wszystkie', ...Array.from(new Set(projects.map((p) => p.category)))];

  // Filter projects based on the active filter
  const filteredProjects = activeFilter === 'Wszystkie'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 md:mb-12">
          <span className="font-label text-accent text-sm font-bold uppercase tracking-widest">Nasze Realizacje</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary mt-2 mb-4 leading-tight">
            Projekty z Naszego <br className="hidden sm:block" /> Portfolio
          </h2>
          <div className="w-16 h-1 bg-accent rounded-full" aria-hidden="true" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-accent w-10 h-10" />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-10 justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={cn(
                    "px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-tighter transition-all duration-300 border cursor-pointer",
                    activeFilter === category
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-white text-foreground/70 border-border hover:border-accent hover:text-accent"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-white border border-border/50 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image || (project.images && project.images[0]) || '/assets/hero.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay - visible on hover or mobile tap focus */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                      <p className="text-white/90 text-sm mb-6 leading-relaxed line-clamp-4 italic">
                        {project.description}
                      </p>
                      <button 
                        onClick={() => setLocation(`/portfolio/${project.id}`)}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-bold rounded-full hover:bg-accent/90 transition-transform active:scale-95 shadow-lg cursor-pointer"
                      >
                        <span>Zobacz Detale</span>
                        <ExternalLink size={16} />
                      </button>
                    </div>

                    {/* Badge (always visible, top left) */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-block px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Below Image */}
                  <div className="p-6 md:p-8 border-t border-border/50 flex-1 flex flex-col justify-center">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-slate-100 sm:hidden">
                       <button 
                        onClick={() => setLocation(`/portfolio/${project.id}`)}
                        className="text-accent font-bold text-sm uppercase tracking-widest flex items-center gap-2"
                       >
                         Szczegóły <ExternalLink size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                Brak projektów w tej kategorii.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
