"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { authCookies } from '@/utils/cookies';

interface AuthenticatedImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
  unoptimized?: boolean;
}

// Helper to check if URL is external
const isExternalUrl = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:');
};

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  fallbackSrc = '/images/default-avatar.png',
  unoptimized: unoptimizedProp
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(false);
  
  // Default to unoptimized for external URLs to avoid domain restrictions
  // Check both original src and current imageSrc (could be blob URL)
  const shouldUnoptimize = unoptimizedProp ?? (isExternalUrl(src || '') || isExternalUrl(imageSrc));

  useEffect(() => {
    // If no src or src is already a fallback, don't do anything
    if (!src || src === fallbackSrc) {
      setImageSrc(fallbackSrc);
      return;
    }

    // Try to load the image directly first
    const img = document.createElement('img');
    img.onload = () => {
      // Image loaded successfully, use the original src
      setImageSrc(src);
    };
    img.onerror = () => {
      // Image failed to load, try with authentication
      loadImageWithAuth();
    };
    img.src = src;
  }, [src, fallbackSrc]);

  const loadImageWithAuth = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const token = authCookies.getToken();

      if (!token) {
        setImageSrc(fallbackSrc);
        return;
      }

      // Fetch the image with authentication
      const response = await fetch(src!, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Convert to blob and create object URL
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } else {
        // Still failed, use fallback
        setImageSrc(fallbackSrc);
      }
    } catch (error) {
      console.error('Error loading authenticated image:', error);
      setImageSrc(fallbackSrc);
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      unoptimized={shouldUnoptimize}
    />
  );
};

export default AuthenticatedImage;