import { Github, Twitch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://github.com/adnjoo/twitch-title"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github size={24} />
        {/* View on GitHub */}
      </a>
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://twitch.tv"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitch size={24} />
        {/* Go to Twitch */}
      </a>
    </footer>
  );
}
