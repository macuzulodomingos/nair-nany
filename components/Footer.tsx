import Link from "next/link";
import { Instagram, Youtube, Music2, Heart } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/nairnanyofficial/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/channel/UCrYw3IMqxJlgvTGU_795d6Q", label: "YouTube" },
  { icon: Music2, href: "https://open.spotify.com/intl-pt/artist/2FytFld4ckIocJkdotYqho", label: "Spotify" },
];

const footerLinks = [
  { href: "/", label: "Início" },
  { href: "/biografia", label: "Biografia" },
  { href: "/agenda", label: "Agenda" },
  { href: "/media-kit", label: "Media Kit" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="bg-navy border-t border-gold/20">
      <div className="container mx-auto w-[90%] md:w-[80%] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-gold mb-4">
              Nair Nany
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Cantora gospel angolana, levando a mensagem de esperança e fé 
              através da música em Angola, Brasil e pelo mundo.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h4 className="text-gold font-semibold mb-4">Navegação</h4>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href} 
                  className="text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-gold font-semibold mb-4">Redes Sociais</h4>
            <div className="flex justify-center md:justify-end gap-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-navy-light border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="text-primary-foreground/50 text-xs">
              management@nairnany.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gold/10 text-center">
          <p className="text-primary-foreground/50 text-sm flex items-center justify-center gap-2">
            © {new Date().getFullYear()} Nair Nany. Feito com{" "}
            <Heart className="h-4 w-4 text-gold fill-gold" /> para a glória de Deus.
          </p>
        </div>
      </div>
    </footer>
  );
}
