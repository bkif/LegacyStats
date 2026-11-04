import { useState, useEffect } from 'react';
import { getLocalCardImage, createCardSvgFallback } from '../data/cardImages';
import { CardRarity, CardVariant } from '../types';

interface CardImageProps {
  name: string;
  image?: string;
  rarity?: CardRarity;
  variant?: CardVariant;
  evoImage?: string | null;
  heroImage?: string | null;
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
  variant = 'normal',
  evoImage,
  heroImage,
  className = '',
  alt
}: CardImageProps) => {
  const cdnFallback = getLocalCardImage(name);
  const color = RARITY_COLORS[rarity] || '#f7c75a';
  const svgFallback = createCardSvgFallback(name, color);

  // Determine exact artwork: if played as evo -> evoImage, if played as hero -> heroImage, else normal image
  const resolvedImage =
    variant === 'evo' && evoImage
      ? evoImage
      : variant === 'hero' && heroImage
      ? heroImage
      : image || cdnFallback;

  const [src, setSrc] = useState<string>(resolvedImage);
  const [triedProxy, setTriedProxy] = useState<boolean>(false);

  useEffect(() => {
    const nextImg =
      variant === 'evo' && evoImage
        ? evoImage
        : variant === 'hero' && heroImage
        ? heroImage
        : image || cdnFallback;

    if (nextImg && nextImg !== src) {
      setSrc(nextImg);
      setTriedProxy(false);
    }
  }, [image, evoImage, heroImage, variant, cdnFallback]);

  const handleError = () => {
    // 1. Try worker image proxy if official URL had issue
    if (!triedProxy && src && src.startsWith('http') && !src.includes('workers.dev')) {
      setTriedProxy(true);
      setSrc(`https://cr-stats.pm00buq.workers.dev?image=${encodeURIComponent(src)}`);
      return;
    }
    // 2. Try RoyaleAPI CDN fallback
    if (src !== cdnFallback) {
      setSrc(cdnFallback);
      return;
    }
    // 3. Fallback to procedural SVG
    setSrc(svgFallback);
  };

  return (
    <img
      src={src}
      alt={alt || name}
      className={`w-full h-full object-contain pointer-events-none select-none transition-transform duration-200 ${className}`}
      loading="lazy"
      onError={handleError}
    />
  );
};
