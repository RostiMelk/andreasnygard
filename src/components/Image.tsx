import { forwardRef } from "react";
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
    return (
      <div className="relative overflow-hidden">
        {blurDataURL && (
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
          ref={ref}
          alt={alt}
          loading={loading}
          className={cn("relative h-full w-full", props.className)}
        />
      </div>
    );
  }
);

Image.displayName = "Image";
