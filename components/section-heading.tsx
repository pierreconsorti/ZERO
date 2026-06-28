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
      <h2 className="display-tight-soft text-balance text-4xl text-zero-ink sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-zero-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
