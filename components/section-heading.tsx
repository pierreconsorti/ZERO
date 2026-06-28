type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="meta-label mb-3">{eyebrow}</p>
      ) : null}
      <h2 className="display-tight-soft text-balance text-[clamp(2.25rem,10vw,3.5rem)] text-zero-ink sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-zero-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
