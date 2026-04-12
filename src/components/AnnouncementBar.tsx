interface AnnouncementBarProps {
  announcement?: string | null;
}

export function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const text = announcement?.trim();
  if (!text) return null;

  return (
    <div className="w-full bg-emerald-600 text-white text-center text-xs sm:text-sm py-2 px-4">
      <span className="font-medium">{text}</span>
    </div>
  );
}
