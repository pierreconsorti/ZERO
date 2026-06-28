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
      <h2 className="display-tight-lg text-balance text-[clamp(1.75rem,6.5vw,2.35rem)] text-zero-ink">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[1.03rem] leading-7 text-zero-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
