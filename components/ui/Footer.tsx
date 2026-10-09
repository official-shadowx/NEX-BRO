import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-5 py-10 pb-28 text-center text-xs text-white/35">
      <p>
        {SITE.name} · {SITE.handle} · Ghost in the machine.
      </p>
      <p className="mt-2">
        <a className="hover:text-white" href={SITE.github}>
          GitHub
        </a>
        {" · "}
        <a className="hover:text-white" href={SITE.discordInvite}>
          Discord
        </a>
      </p>
    </footer>
  );
}
