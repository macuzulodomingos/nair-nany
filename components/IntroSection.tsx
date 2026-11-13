import { Quote } from "lucide-react";

export function IntroSection() {
  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Quote className="h-12 w-12 text-gold mx-auto" />
          
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif text-navy leading-relaxed">
            "Eu sou a prova de que Deus é Real. <br /> A música é a minha forma de adorar a Deus e de levar esperança 
            a cada coração que precisa de cura e restauração."
          </blockquote>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold font-serif text-lg">Nair Nany</span>
            <div className="h-px w-12 bg-gold" />
          </div>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Hoje, seu ministério alcança milhares de pessoas através 
            de músicas que tocam a alma e elevam o espírito.
          </p>
        </div>
      </div>
    </section>
  );
}
