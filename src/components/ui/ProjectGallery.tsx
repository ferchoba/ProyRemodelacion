'use client';

import { useState } from 'react';
import SafeImage from './SafeImage';

interface ProjectGalleryProps {
  images: string[];
  projectTitle: string;
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Galería principal */}
      <div className="space-y-4">
        {/* Imagen principal */}
        <div className="relative h-96 rounded-lg overflow-hidden bg-outer-space/20 cursor-pointer group">
          <SafeImage
            src={images[selectedImage]}
            alt={`${projectTitle} - Imagen ${selectedImage + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
            onClick={() => openLightbox(selectedImage)}
          />
          
          {/* Overlay con información */}
          <div className="absolute inset-0 bg-gradient-to-t from-raisin-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm">
                Imagen {selectedImage + 1} de {images.length}
              </p>
              <p className="text-white/80 text-xs">
                Haz clic para ver en tamaño completo
              </p>
            </div>
          </div>

          {/* Navegación */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-raisin-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-raisin-black"
                aria-label="Imagen anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-raisin-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-raisin-black"
                aria-label="Imagen siguiente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedImage === index
                    ? 'ring-2 ring-outer-space scale-105'
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
              >
                <SafeImage
                  src={image}
                  alt={`${projectTitle} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-raisin-black/95 flex items-center justify-center p-4">
          {/* Imagen en lightbox */}
          <div className="relative max-w-7xl max-h-full">
            <SafeImage
              src={images[selectedImage]}
              alt={`${projectTitle} - Imagen ${selectedImage + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Controles del lightbox */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-raisin-black/80 text-white p-2 rounded-full hover:bg-raisin-black transition-colors"
            aria-label="Cerrar galería"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-raisin-black/80 text-white p-3 rounded-full hover:bg-raisin-black transition-colors"
                aria-label="Imagen anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-raisin-black/80 text-white p-3 rounded-full hover:bg-raisin-black transition-colors"
                aria-label="Imagen siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Información de la imagen */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm">
              {selectedImage + 1} de {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
