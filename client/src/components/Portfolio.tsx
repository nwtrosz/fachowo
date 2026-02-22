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
  const categories = ['Wszystkie', ...new Set(projects.map((p) => p.category))];

  // Filter projects based on the active filter
  const filteredProjects = activeFilter === 'Wszystkie'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-label text-accent text-sm font-bold uppercase tracking-wider">Nasze Realizacje</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2 mb-4">
            Projekty z Naszego Portfolio
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
            <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={cn(
                    "px-6 py-2 rounded-full font-medium transition-all duration-300 border",
                    activeFilter === category
                      ? "bg-accent text-white border-accent shadow-md scale-105"
                      : "bg-transparent text-foreground/70 border-border hover:border-accent hover:text-accent"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-border/50"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                      <p className="text-white/90 text-sm mb-6 leading-relaxed">
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
                      <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Below Image */}
                  <div className="p-6 border-t border-border/50">
                    <h3 className="font-display text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
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
