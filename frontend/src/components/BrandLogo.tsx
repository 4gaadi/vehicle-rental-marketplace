type BrandLogoProps = {
  dark?: boolean;
  showWordmark?: boolean;
  className?: string;
};

export function BrandLogo({ dark = false, showWordmark = true, className = "" }: BrandLogoProps) {
  const primary = dark ? "text-white" : "text-white";
  const secondary = "text-[#2f66f3]";

  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      <div className={`font-display text-xl font-bold italic leading-none ${secondary}`}>
        C<span className="text-[#4b85ff]">Z</span>
      </div>
      {showWordmark && (
        <div className={`font-display text-[1.65rem] font-bold tracking-[-0.02em] ${primary}`}>
          CROODZ
        </div>
      )}
    </div>
  );
}
