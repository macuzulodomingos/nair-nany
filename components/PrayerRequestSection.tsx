"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Send, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MIN_LENGTH = 5;
const MAX_LENGTH = 1000;
const TIMEOUT_MS = 10_000;

export function PrayerRequestSection() {
  const [request, setRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = request.trim();

    if (trimmed.length < MIN_LENGTH) {
      toast.error("Pedido muito curto", {
        description: `Por favor, escreva pelo menos ${MIN_LENGTH} caracteres.`,
      });
      return;
    }

    if (trimmed.length > MAX_LENGTH) {
      toast.error("Pedido muito longo", {
        description: `O limite é de ${MAX_LENGTH} caracteres.`,
      });
      return;
    }

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${API_URL}/prayers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Pedido recebido! 🙏", {
        description:
          "O seu pedido de oração foi recebido. Estamos em oração por si.",
      });
      setRequest("");
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.error("Tempo excedido", {
          description:
            "A ligação demorou demasiado. Verifique a internet e tente novamente.",
        });
      } else {
        toast.error("Não foi possível enviar", {
          description: "Ocorreu um erro. Tente novamente dentro de instantes.",
        });
      }
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-28  bg-primary-foreground relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6  bg-cream mx-auto w-[90%] md:w-[80%] rounded-2xl shadow-2xl">
        <div className="">
          <Image
            src="/imagens/nairPrayer.jpg"
            alt="Nair Nany"
            width={400} // largura fixa
            height={400} // altura fixa
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
              <Heart className="h-8 w-8 text-gold" />
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
              Pedido de Oração
            </h2>

            <p className="text-navy text-lg">
              Acredito no poder da oração e gostaria de interceder por si.
              Partilhe o seu pedido e estarei em oração.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="prayer-request" className="sr-only">
                  O seu pedido de oração
                </label>
                <Textarea
                  id="prayer-request"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  maxLength={MAX_LENGTH}
                  disabled={isSubmitting}
                  placeholder="Escreva aqui o seu pedido de oração..."
                  className="min-h-37.5 resize-none border-gold/30 bg-navy-light p-4 text-white placeholder:text-white/60 focus:border-gold"
                />
                <div className="flex justify-between px-1 text-xs text-navy/70">
                  <span>Mínimo {MIN_LENGTH} caracteres</span>
                  <span aria-live="polite">
                    {request.length}/{MAX_LENGTH}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gold font-semibold text-navy shadow-md transition-all hover:bg-gold-dark"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                    Enviar Pedido
                  </>
                )}
              </Button>
            </form>
            <p className="text-navy text-sm">
              "Confiem no Senhor de todo o coração e não se apoiem em seu
              próprio entendimento."
              <br />
              <span className="text-navy">— Provérbios 3:5</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
