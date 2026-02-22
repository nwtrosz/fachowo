import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { ChevronLeft, Calendar, Tag, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
  created_at: string;
}

export default function ProjectDetails() {
  const [match, params] = useRoute('/portfolio/:id');
  const [, setLocation] = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const projects: Project[] = await res.json();
          const found = projects.find((p) => p.id === Number(params?.id));
          if (found) {
            setProject(found);
            setSelectedImage(found.image);
          } else {
            setLocation('/404');
          }
        }
      } catch (error) {
        console.error('Failed to fetch project details', error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchProject();
    }
  }, [params?.id, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent w-12 h-12" />
      </div>
    );
  }

  if (!project) return null;

  const gallery = project.images || [project.image];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title={project.title} description={project.description} />
      <Navigation />

      <main className="flex-1 pt-24">
        {/* Project Header */}
        <section className="bg-primary text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 cursor-pointer group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Powrót do Portfolio
            </button>
            
            <div className="grid md:grid-cols-3 gap-8 items-end">
              <div className="md:col-span-2">
                <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded mb-4">
                  {project.category}
                </span>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 italic">
                  {project.title}
                </h1>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-white/60 border-t border-white/10 pt-6 md:border-0 md:pt-0">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-accent" />
                  <span>{format(new Date(project.created_at), 'MMMM yyyy', { locale: pl })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-accent" />
                  <span>{project.category}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery & Description */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Gallery Side */}
              <div className="lg:col-span-3 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-gray-100"
                >
                  <img
                    src={selectedImage || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {gallery.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedImage === img ? 'border-accent scale-105 shadow-md' : 'border-transparent hover:border-accent/50'
                        }`}
                      >
                        <img src={img} alt={`Widok ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Side */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-border sticky top-32">
                  <h2 className="font-display text-3xl font-bold text-primary mb-6 relative">
                    O realizacji
                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent"></span>
                  </h2>
                  <div className="prose prose-slate max-w-none text-foreground/80 leading-relaxed italic">
                    {project.description.split('\n').map((para, i) => (
                      <p key={i} className="mb-4">{para}</p>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-border space-y-6">
                    <div className="flex items-center gap-4 text-primary">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-foreground/40">Zdjęcia</p>
                        <p className="font-bold">{gallery.length} fotografii w galerii</p>
                      </div>
                    </div>
                    
                    <a 
                      href="/kontakt"
                      className="block w-full py-4 bg-primary text-white text-center font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-xl"
                    >
                      Zapytaj o podobny projekt
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
