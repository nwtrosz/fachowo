import { useEffect, useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { ChevronLeft, Calendar, Tag, Image as ImageIcon, Loader2, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

      <main className="flex-1 pt-20 md:pt-24">
        {/* Lightbox Overlay */}
        <AnimatePresence>
          {isLightboxOpen && selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setIsLightboxOpen(false)}
            >
              <button 
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white transition-colors"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X size={32} className="md:w-10 md:h-10" />
              </button>
              
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage}
                alt={project.title}
                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
              />
              
              <div className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center text-white/50 text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] px-4">
                {project.title}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Header */}
        <section className="bg-primary text-white py-12 md:py-24">
          <div className="container mx-auto px-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
            >
              <ChevronLeft size={16} />
              Powrót do realizacji
            </button>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                <span className="inline-block px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">
                  {project.category}
                </span>
                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter italic">
                  {project.title}
                </h1>
              </div>
              <div className="flex flex-wrap gap-6 pt-6 lg:pt-0 border-t border-white/10 lg:border-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Calendar size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest leading-none mb-1">Data</p>
                    <p className="font-medium text-sm">{format(new Date(project.created_at), 'MMMM yyyy', { locale: pl })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Tag size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest leading-none mb-1">Kategoria</p>
                    <p className="font-medium text-sm">{project.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery & Description */}
        <section className="py-12 md:py-24 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
              {/* Gallery Side */}
              <div className="lg:col-span-7 space-y-6 md:space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white border border-border group cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={selectedImage || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                </motion.div>

                {gallery.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 md:gap-4">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                          "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer",
                          selectedImage === img 
                            ? "border-accent shadow-xl scale-105" 
                            : "border-transparent opacity-60 hover:opacity-100 hover:border-accent/30 shadow-sm"
                        )}
                      >
                        <img src={img} alt={`Widok ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Side */}
              <div className="lg:col-span-5">
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-primary/5 border border-border lg:sticky lg:top-32 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-16 -mt-16" />
                  
                  <h2 className="font-display text-3xl font-bold text-primary mb-8 flex items-center gap-3 italic">
                    <span className="w-10 h-1 bg-accent rounded-full" />
                    O realizacji
                  </h2>
                  <div className="prose prose-slate max-w-none text-foreground/70 leading-relaxed font-light text-lg">
                    {project.description.split('\n').map((para, i) => (
                      <p key={i} className="mb-6">{para}</p>
                    ))}
                  </div>

                  <div className="mt-12 pt-10 border-t border-slate-100 space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                        <ImageIcon size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-foreground/30 tracking-widest mb-1 text-left">Dokumentacja</p>
                        <p className="font-bold text-primary">{gallery.length} fotografii w galerii</p>
                      </div>
                    </div>
                    
                    <Link 
                      href="/kontakt"
                      className="block w-full py-5 bg-primary text-white text-center font-bold rounded-2xl hover:bg-accent transition-all shadow-xl shadow-primary/10 active:scale-[0.98] text-lg uppercase tracking-widest cursor-pointer"
                    >
                      Zapytaj o wycenę
                    </Link>
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
