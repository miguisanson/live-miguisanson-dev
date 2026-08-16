import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ src, name, size = 40 }: AvatarProps) {
  const initial = (name || "?").trim().slice(0, 1).toUpperCase();
  return (
    <span className="ui-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }} aria-hidden="true">
      {src ? <Image src={src} alt="" width={size} height={size} /> : initial}
    </span>
  );
}
