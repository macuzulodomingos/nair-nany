"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { Download, Image as ImageIcon, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { jsPDF } from "jspdf";

interface SongRecord {
  id: number;
  title: string;
  lyrics: string;
}

const MediaKit = () => {
  const [dynamicPhotos, setDynamicPhotos] = useState([]);
  const [dynamicSongs, setDynamicSongs] = useState<SongRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, songsRes] = await Promise.all([
          fetch(`${API_URL}/photos`),
          fetch(`${API_URL}/songs`),
        ]);

        if (!photosRes.ok || !songsRes.ok) {
          throw new Error("Falha ao carregar recursos");
        }

        const [photos, songs] = await Promise.all([
          photosRes.json(),
          songsRes.json(),
        ]);

        setDynamicPhotos(photos);
        setDynamicSongs(songs);
      } catch (error) {
        console.error("[fetchData] Erro ao carregar dados:", error);
        // opcional: feedback ao usuário
        // toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadPhoto = (url: string, fileName: string) => {
    try {
      const safeFileName = fileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "_");

      const downloadUrl = url.replace(
        "/upload/",
        `/upload/fl_attachment:${safeFileName}/`
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadPDF = (song: SongRecord) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const innerWidth = pageWidth - margin * 2;
    const bottomMargin = 25; // Espaço reservado para o rodapé

    // 1. Configurar Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(song.title.toUpperCase(), margin, 20);

    doc.setLineWidth(0.5);
    doc.line(margin, 25, pageWidth - margin, 25);

    // 2. Processar a Letra com Quebra de Página
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Divide o texto em linhas que cabem na largura da página [cite: 17]
    const lines = doc.splitTextToSize(song.lyrics, innerWidth);

    let cursorY = 35; // Posição inicial do texto
    const lineHeight = 7; // Espaço entre as linhas

    lines.forEach((line: string) => {
      // Verifica se a próxima linha vai ultrapassar o limite da página [cite: 17]
      if (cursorY + lineHeight > pageHeight - bottomMargin) {
        // Adiciona Rodapé antes de mudar de página
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Nair Nany - Ministério Gospel", margin, pageHeight - 10);

        doc.addPage();
        cursorY = 20; // Reseta o cursor no topo da nova página
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0);
      }

      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });

    // 3. Rodapé da última página
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Nair Nany - Ministério Gospel", margin, pageHeight - 10);

    doc.save(`Letra_${song.title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-white tracking-widest uppercase text-sm mb-4">
            Recursos para Igrejas e Organizadores
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground mb-6">
            Media Kit
          </h1>
          <p className="text-primary-foreground/70 text-xl max-w-2xl mx-auto">
            Materiais oficiais, letras e fotos para download
          </p>
        </div>
      </section>

      <section className="py-16 bg-cream min-h-150">
        <div className="container mx-auto px-4 w-[90%] md:w-[80%]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-gold" />
              <p className="text-navy/60">Carregando materiais...</p>
            </div>
          ) : (
            <div className="space-y-20">
              {/* SEÇÃO DE FOTOS */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-gold">
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-navy">
                      Fotos Oficiais
                    </h2>
                    <p className="text-muted-foreground">
                      Alta resolução para cartazes e redes sociais
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dynamicPhotos.map((photo: any) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-xl p-3 shadow-sm group border border-navy/5"
                    >
                      <div className="relative aspect-3/4 mb-3 overflow-hidden rounded-lg">
                        <Image
                          src={photo.url}
                          alt={photo.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs md:text-sm border-navy/20 hover:bg-navy hover:text-accent"
                        onClick={() =>
                          handleDownloadPhoto(photo.url, photo.name)
                        }
                      >
                        <Download className="mr-2 h-3 w-3" /> Baixar a foto
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SEÇÃO DE LETRAS DINÂMICAS */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-gold">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-navy">
                      Letras das Músicas
                    </h2>
                    <p className="text-muted-foreground">
                      Letras completas para projeção e acompanhamento
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dynamicSongs.map((song) => (
                    <div
                      key={song.id}
                      className="bg-white rounded-xl p-5 shadow-sm border border-navy/5 flex items-center justify-between group hover:border-gold/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cream rounded-lg text-navy">
                          <FileText size={20} />
                        </div>
                        <h3 className="font-medium text-navy group-hover:text-gold transition-colors">
                          {song.title}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-navy hover:text-gold"
                        onClick={() => handleDownloadPDF(song)}
                      >
                        <Download size={20} />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Diretrizes mantida conforme o original... */}
    </>
  );
};

export default MediaKit;
