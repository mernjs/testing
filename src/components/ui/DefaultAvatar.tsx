interface DefaultAvatarProps {
  gender: "male" | "female";
  className?: string;
}

// Generic silhouette avatar used in place of a real headshot until one is provided.
export default function DefaultAvatar({ gender, className = "" }: DefaultAvatarProps) {
  return (
    <div className={`w-full h-full bg-muted flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full text-muted-foreground/60" aria-hidden="true">
        <circle cx="50" cy="38" r="17" fill="currentColor" />
        <path d="M14,100 A36,36 0 0 1 86,100 Z" fill="currentColor" />
        {gender === "male" ? (
          <path d="M31,38 A19,19 0 0 1 69,38 Z" fill="currentColor" opacity="0.55" />
        ) : (
          <>
            <path d="M29,40 A21,21 0 0 1 71,40 Z" fill="currentColor" opacity="0.55" />
            <rect x="27" y="30" width="6" height="26" rx="3" fill="currentColor" opacity="0.55" />
            <rect x="67" y="30" width="6" height="26" rx="3" fill="currentColor" opacity="0.55" />
          </>
        )}
      </svg>
    </div>
  );
}
