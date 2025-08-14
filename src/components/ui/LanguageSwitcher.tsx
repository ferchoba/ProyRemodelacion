'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export default function LanguageSwitcher({ 
  className = '', 
  showLabel = false 
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations('language.switcher');
  const router = useRouter();
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);

  // Determinar el idioma actual
  const isSpanish = locale === 'es';
  const currentLanguage = isSpanish ? 'Español' : 'English';
  const targetLanguage = isSpanish ? 'English' : 'Español';
  const targetLocale = isSpanish ? 'en' : 'es';

  // Función para cambiar idioma
  const handleLanguageChange = async () => {
    if (isChanging) return;
    
    setIsChanging(true);
    
    try {
      // Construir nueva URL con el idioma objetivo
      const segments = pathname.split('/').filter(Boolean);
      
      // Remover el locale actual si existe
      if (segments[0] === 'es' || segments[0] === 'en') {
        segments.shift();
      }
      
      // Construir nueva ruta con el locale objetivo
      const newPath = `/${targetLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
      
      // Guardar preferencia de idioma
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-locale', targetLocale);
        document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
      }
      
      // Navegar a la nueva ruta
      router.push(newPath);
      
      // Anunciar cambio para screen readers
      if (typeof window !== 'undefined') {
        const announcement = isSpanish 
          ? `Language changed to ${targetLanguage}`
          : `Idioma cambiado a ${targetLanguage}`;
        
        // Crear elemento temporal para anuncio
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        document.body.appendChild(announcer);
        
        setTimeout(() => {
          document.body.removeChild(announcer);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setTimeout(() => setIsChanging(false), 300);
    }
  };

  // Manejar navegación por teclado
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange();
    }
  };

  // Aplicar preferencia guardada al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('preferred-locale');
      if (savedLocale && savedLocale !== locale) {
        // La preferencia se aplicará en la próxima navegación
      }
    }
  }, [locale]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-quick-silver">
          {t('label')}:
        </span>
      )}
      
      <div
        role="switch"
        aria-checked={isSpanish}
        aria-label={`${t('label')}. ${t('current', { language: currentLanguage })}`}
        tabIndex={0}
        className={`
          relative inline-flex items-center h-8 w-20 rounded-full border cursor-pointer
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2 focus:ring-offset-raisin-black
          ${isChanging ? 'opacity-75 cursor-wait' : 'cursor-pointer'}
          border-quick-silver/30 bg-outer-space/20 hover:bg-outer-space/30 hover:border-quick-silver/50
        `}
        onClick={handleLanguageChange}
        onKeyDown={handleKeyDown}
      >
        {/* Texto ES */}
        <span 
          className={`
            text-sm font-medium transition-colors duration-200 z-10 relative px-2 select-none
            ${isSpanish ? 'text-platinum' : 'text-quick-silver'}
          `}
          aria-hidden="true"
        >
          ES
        </span>
        
        {/* Slider animado */}
        <div 
          className={`
            absolute top-0.5 h-7 w-7 rounded-full bg-outer-space transition-transform duration-200 ease-in-out
            ${isSpanish ? 'left-0.5 transform translate-x-0' : 'left-0.5 transform translate-x-6'}
          `}
          aria-hidden="true"
        />
        
        {/* Texto EN */}
        <span 
          className={`
            text-sm font-medium transition-colors duration-200 z-10 relative px-2 select-none
            ${!isSpanish ? 'text-platinum' : 'text-quick-silver'}
          `}
          aria-hidden="true"
        >
          EN
        </span>
        
        {/* Indicador de carga */}
        {isChanging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-platinum border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para uso en menú móvil con label
export function LanguageSwitcherMobile({ className = '' }: { className?: string }) {
  return (
    <LanguageSwitcher 
      className={`justify-center ${className}`}
      showLabel={true}
    />
  );
}

// Componente para uso en header sin label
export function LanguageSwitcherHeader({ className = '' }: { className?: string }) {
  return (
    <LanguageSwitcher
      className={className}
      showLabel={false}
    />
  );
}
