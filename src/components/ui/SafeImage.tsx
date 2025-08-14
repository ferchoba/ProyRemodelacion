'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
};

export default function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = '/images/placeholders/fallback.svg', 
  ...rest 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <Image
      {...rest}
      src={hasError ? fallbackSrc : src}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      className={`${rest.className || ''} ${isLoading ? 'opacity-75' : 'opacity-100'} transition-opacity duration-200`}
    />
  );
}
