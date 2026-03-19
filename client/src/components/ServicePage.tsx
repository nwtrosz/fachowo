import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import Navigation from './Navigation';
import { SEOHead } from './SEOHead';

interface ServicePageProps {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  benefits: string[];
}

/**
 * Service Page Component
 * Fachowo.net.pl - Reusable service page template
 * 
 * Design: Bold Structural Modernism
 * - Professional layout with hero image
 * - Description and benefits sections
 * - Image gallery
 * - Contact CTA
 */

export function ServicePage({
  title,
  subtitle,
  description,
  images,
  benefits,
}: ServicePageProps) {
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={title} 
        description={subtitle} 
        image={images[0]} 
      />
      <Navigation />
      {/* Header */}
      <div className="bg-primary text-primary-foreground pt-24 pb-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <ChevronLeft size={20} />
            Wróć
          </button>
          <h1 className="font-display text-4xl font-bold">{title}</h1>
          <p className="text-primary-foreground/90 mt-2">{subtitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Hero Image */}
        <div className="mb-12">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg border border-border">
            <img
              src={images[selectedImage]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === idx
                      ? 'border-accent shadow-md shadow-accent/20'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <img src={img} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl font-bold mb-4 text-foreground">O usłudze</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-2xl font-bold mb-4 text-foreground">Korzyści</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center mt-1">
                        <span className="text-accent-foreground text-sm font-bold">✓</span>
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20 shadow-sm">
              <h3 className="font-display text-xl font-bold mb-4 text-foreground">Zainteresowany?</h3>
              <p className="text-muted-foreground mb-6">
                Skontaktuj się z nami, aby uzyskać bezpłatną wycenę i konsultację.
              </p>
              <button
                onClick={() => navigate('/kontakt')}
                className="w-full px-6 py-3 bg-accent text-accent-foreground font-medium rounded hover:bg-accent/90 transition-colors cursor-pointer"
              >
                Zapytaj o darmową wycenę wstępną
              </button>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Telefon:</strong>
                </p>
                <p className="text-foreground font-medium">+48 12 345 67 89</p>
                <p className="text-sm text-muted-foreground mt-4 mb-2">
                  <strong>Email:</strong>
                </p>
                <p className="text-foreground font-medium break-all">kontakt@fachowo.net.pl</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
