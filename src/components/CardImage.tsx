import { useState } from 'react';
import { getLocalCardImage, createCardSvgFallback } from '../data/cardImages';
import { CardRarity } from '../types';

interface CardImageProps {
  name: string;
  image?: string;
  rarity?: CardRarity;
  className?: string;
  alt?: string;
}

const RARITY_COLORS: Record<CardRarity, string> = {
  common: '#5cc3ff',
  rare: '#f09a2a',
  epic: '#b24fe8',
  legendary: '#71f0d0',
  champion: '#ffc933',
  hero: '#ffc933',
  tower: '#9aa8d8'
};

export const CardImage = ({
  name,
  image,
  rarity = 'common',
  className = '',
  alt
}: CardImageProps) => {
  const cdnFallback = getLocalCardImage(name);
  const color = RARITY_COLORS[rarity] || '#f7c75a';
  const svgFallback = createCardSvgFallback(name, color);

  // Initial source prioritizes provided image or high-res CDN
  const initialSrc = image || cdnFallback;
  const [src, setSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (!hasError && src !== cdnFallback) {
      setSrc(cdnFallback);
      setHasError(true);
    } else {
      setSrc(svgFallback);
    }
  };

  return (
    <img
      src={src}
      alt={alt || name}
      className={`max-w-full max-h-full object-contain pointer-events-none select-none transition-transform duration-200 ${className}`}
      loading="lazy"
      onError={handleError}
    />
  );
};
