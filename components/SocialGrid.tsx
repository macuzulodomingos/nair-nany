"use client";

import { Instagram, Youtube, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

// Placeholder images e URLs de exemplo - substitua pelos vídeos reais
const socialItems = [
  {
    id: 1,
    type: "youtube",
    url: "https://www.youtube.com/embed/lmm9iKoSpHc",
    alt: "Vídeo YouTube",
  },
  {
    id: 2,
    type: "instagram",
    url: "https://www.instagram.com/p/DSn9-8MjVzS/embed",
    alt: "Vídeo Instagram",
  },
  {
    id: 3,
    type: "tiktok",
    url: "https://www.tiktok.com/embed/7452090335758519557",
    alt: "Vídeo TikTok",
  },
];


export function SocialGrid() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

  

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
            Acompanhe nas Redes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fique por dentro das novidades, bastidores e momentos especiais do ministério
          </p>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols md:w-[50%] gap-4 w-full mx-auto">
           {socialItems.map((item) => (
              <div key={item.id} className="aspect-video rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={item.url}
                  title={item.alt}
                  className="w-full h-full"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
        </div>

        {/* Social Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button
            variant="outline"
            className="border-navy text-navy hover:bg-navy hover:text-primary-foreground"
            asChild
          >
            <a
              href="https://www.instagram.com/nairnanyofficial/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Seguir no Instagram
            </a>
          </Button>
          <Button
            variant="outline"
            className="border-navy text-navy hover:bg-navy hover:text-primary-foreground"
            asChild
          >
            <a
              href="https://www.youtube.com/channel/UCrYw3IMqxJlgvTGU_795d6Q"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="mr-2 h-5 w-5" />
              Inscrever no YouTube
            </a>
          </Button>
          <Button
            variant="outline"
            className="border-navy text-navy hover:bg-navy hover:text-primary-foreground"
            asChild
          >
            <a
              href="https://www.tiktok.com/@nairnanyofficial"
              target="_blank"
              rel="noopener noreferrer"
            >
              Seguir no TikTok
            </a>
          </Button>
        </div>
      </div>

  
    </section>
  );
}
