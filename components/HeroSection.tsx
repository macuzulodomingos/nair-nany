import { Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-navy overflow-hidden">

      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/nairvideo.mp4" type="video/mp4" />
      </video>

      


      <div className="container mx-auto w-[90%] sm:w-[80%] px-4 py-16 md:py-24 relative z-10">
        
          {/* Content */}
          <div className="text-center mt-55 space-y-8 animate-fade-in">
            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-primary-foreground/80 font-light">
                Levando a mensagem de <span className="font-bold">Esperança</span> e{" "}
                <span className="font-bold">Fé</span> através da música
              </p>
            </div>

           
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center ">
              <Button 
                size="lg"
                className="bg-gold hover:bg-gold-dark text-navy font-semibold px-8 py-6 text-lg shadow-gold"
                asChild
              >
                <a href="https://open.spotify.com/intl-pt/artist/2FytFld4ckIocJkdotYqho" target="_blank" rel="noopener noreferrer">
                  <Music className="mr-2 h-5 w-5" />
                  Ouvir no Spotify
                </a>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:text-gold px-8 py-6 text-lg"
                asChild
              >
                <a href="https://music.apple.com/us/artist/nair-nany/1518497275" target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-5 w-5" />
                  Apple Music
                </a>
              </Button>
            </div>
          </div>

          
        
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
