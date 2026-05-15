import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[var(--muted)] sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Miguel Joaquin A. Sanson</p>
        <div className="flex gap-4">
          {profile.socials.map((social) => (
            <a key={social.label} href={social.href} target={social.external ? "_blank" : undefined} rel={social.external ? "noreferrer" : undefined} className="hover:text-[var(--text)]">
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
