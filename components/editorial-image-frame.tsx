import Image from "next/image";
import type { EditorialImage } from "@/lib/data/editorial-images";
import { cn } from "@/lib/utils";

type EditorialImageFrameProps = {
  image: EditorialImage;
  variant?: "hero" | "card" | "source";
  className?: string;
};

const aspectByVariant = {
  hero: "aspect-[5/4]",
  card: "aspect-[4/3]",
  source: "aspect-[3/2]"
};

export function EditorialImageFrame({
  image,
  variant = "card",
  className
}: EditorialImageFrameProps) {
  const isDiagram = image.presentation === "diagram";
  const isSource = variant === "source";

  return (
    <figure
      className={cn(
        "grid gap-3 text-black",
        isSource && "rounded-[1.25rem] bg-white p-3 shadow-quiet",
        className
      )}
    >
      <a
        href={image.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "group relative block overflow-hidden bg-[#efefeb]",
          "rounded-[0.45rem]"
        )}
      >
        <div className={cn("relative", aspectByVariant[variant])}>
          <Image
            src={image.imageUrl}
            alt={image.caption}
            fill
            sizes={
              variant === "hero"
                ? "(min-width: 1024px) 36vw, 92vw"
                : "(min-width: 1024px) 28vw, 92vw"
            }
            className={cn(
              "transition duration-300 group-hover:scale-[1.015]",
              isDiagram ? "object-contain p-3" : "object-cover"
            )}
            unoptimized
          />
        </div>
      </a>
      <figcaption className="grid gap-2">
        <div className="flex flex-wrap gap-2 font-mono text-[0.62rem] uppercase text-black/45">
          <span>{image.source}</span>
          <span aria-hidden="true">/</span>
          <span>{image.license}</span>
        </div>
        <div className="grid gap-1.5">
          <p className="text-sm font-semibold leading-5 text-black">{image.title}</p>
          <p className="text-xs leading-5 text-black/58">{image.caption}</p>
          {variant !== "card" ? (
            <p className="text-xs leading-5 text-black/52">
              <span className="font-medium text-black/70">Why here:</span>{" "}
              {image.whyItBelongs}
            </p>
          ) : null}
          <p className="text-[0.68rem] leading-4 text-black/42">
            Credit: {image.credit}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
