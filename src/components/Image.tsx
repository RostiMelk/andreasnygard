import { forwardRef, useState, useEffect, useRef } from "react";
import cn from "clsx";

/**
 * A drop-in replacement for next/image that provides similar blur-up loading
 * functionality without the high price tag of next/image's image optimization
 * features. All images are already optimized using the Sanity CDN.
 */
interface Props extends React.HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  loading?: "lazy" | "eager";
}

export const Image = forwardRef<HTMLImageElement, Props>(
  ({ blurDataURL, alt, loading = "lazy", ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      const img = imageRef.current;
      if (!img) return;

      const handleLoad = () => setIsLoaded(true);

      if (img.complete) {
        setIsLoaded(true);
      } else {
        img.addEventListener("load", handleLoad);
      }

      return () => img.removeEventListener("load", handleLoad);
    }, []);

    return (
      <div className="relative overflow-hidden">
        {blurDataURL && !isLoaded && (
          <img
            src={blurDataURL}
            alt={alt}
            loading={loading}
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full scale-110 object-cover blur-lg"
            )}
          />
        )}

        <img
          {...props}
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
            if (imageRef) imageRef.current = node;
          }}
          alt={alt}
          loading={loading}
          className={cn("relative h-full w-full", props.className)}
        />
      </div>
    );
  }
);

Image.displayName = "Image";
