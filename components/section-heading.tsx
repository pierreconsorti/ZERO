type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs uppercase text-zero-rust">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl font-semibold leading-tight text-zero-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-zero-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
