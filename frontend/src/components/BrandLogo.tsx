type BrandLogoProps = {
  dark?: boolean;
  showWordmark?: boolean;
  className?: string;
};

export function BrandLogo({ dark = false, showWordmark = true, className = "" }: BrandLogoProps) {
  const primary = dark ? "text-blue-900" : "text-white";
  const secondary = "text-blue-500";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`font-display text-2xl font-bold leading-none ${primary}`}>
        C<span className={secondary}>X</span>
      </div>
      {showWordmark && (
        <div className={`font-display text-lg font-semibold tracking-[0.12em] ${primary}`}>
          CROOD<span className={secondary}>X</span>
        </div>
      )}
    </div>
  );
}
