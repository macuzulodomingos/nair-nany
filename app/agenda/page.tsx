"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api"; // Ajuste o caminho conforme sua pasta
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type EventStatus = "confirmed" | "sold_out" | "cancelled";

interface TourEvent {
  id: number;
  date: string; // formato "YYYY-MM-DD"
  time: string; // formato "HH:MM"
  venue: string;
  city: string;
  country: string;
  status: EventStatus;
}

// ===================================

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleDateString("pt-PT", { month: "short" }).toUpperCase(),
    year: date.getFullYear(),
    weekday: date.toLocaleDateString("pt-PT", { weekday: "long" }),
  };
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700"; // Verde para confirmado
    case "pending":
      return "bg-yellow-100 text-yellow-700"; // Amarelo para pendente
    case "cancelled":
      return "bg-red-100 text-red-700 line-through";
    default:
      return "bg-gold/20 text-gold-dark";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmado";
    case "pending":
      return "Em Breve / Pendente";
    case "cancelled":
      return "Cancelado";
    default:
      return "Agendado";
  }
};

const Agenda = () => {
  const [events, setEvents] = useState<TourEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events`);
        const data = await res.json();

        // PROTEÇÃO: Verifica se 'data' é realmente um array
        // Se a sua API retorna { data: [...] }, mude para setEvents(data.data)
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("A API não retornou um array:", data);
          setEvents([]); // Garante que continue sendo um array vazio
        }
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        setEvents([]); // Evita que o estado fique 'undefined' em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Carregando eventos...</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = (Array.isArray(events) ? events : [])
    .filter((event) => {
      if (event.status === "cancelled") return false;

      // 1. Dividimos a string "2024-10-25" nos traços
      const dateParts = event.date.split("-"); // [ "2024", "10", "25" ]

      // 2. Criamos a data usando os números inteiros
      // Nota: O mês no JS começa em 0 (Janeiro é 0, Outubro é 9), por isso fazemos -1
      const eventDate = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2])
      );

      eventDate.setHours(0, 0, 0, 0);

      // 3. Compara apenas o valor do tempo
      return eventDate.getTime() >= today.getTime();
    })
    .sort((a, b) => {
      // Ordenação garantida por string (YYYY-MM-DD é naturalmente ordenável)
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    });

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-navy">
        <div className="">
          <Image
            src="/imagens/nair.jpg"
            alt="Menu "
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* RIGHT — TEXT */}
        <div className="md:w-1/2 px-4 mt-1 md:mt-0 relative z-10 mx-auto text-center">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
            Próximas Apresentações
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Agenda
          </h1>

          <p className="text-primary-foreground/70 text-xl text-center">
            Venha fazer parte de um momento de adoração e encontro com Deus
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-navy mb-2">
                Nenhum evento agendado
              </h3>
              <p className="text-muted-foreground">
                Em breve anunciaremos novas datas. Siga-nos nas redes sociais!
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {upcomingEvents.map((event) => {
                const dateInfo = formatDate(event.date);

                return (
                  <div
                    key={event.id}
                    className="bg-background rounded-2xl shadow-md hover:shadow-celestial transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Date Column */}
                      <div className="bg-navy p-6 md:p-8 flex flex-row md:flex-col items-center justify-center gap-4 md:gap-1 md:w-32">
                        <span className="text-4xl md:text-5xl font-serif font-bold text-gold">
                          {dateInfo.day}
                        </span>
                        <div className="text-center">
                          <span className="text-primary-foreground font-medium block">
                            {dateInfo.month}
                          </span>
                          <span className="text-primary-foreground/60 text-sm">
                            {dateInfo.year}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(
                                  event.status
                                )}`}
                              >
                                {getStatusLabel(event.status)}
                              </span>
                              <span className="text-muted-foreground text-sm capitalize">
                                {dateInfo.weekday}
                              </span>
                            </div>

                            <h3 className="text-xl font-serif font-bold text-navy">
                              {event.venue}
                            </h3>

                            <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.city}, {event.country}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {event.time}
                              </span>
                            </div>
                          </div>

                        
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground mb-4">
            Quer convidar Nair Nany para a sua igreja?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Entre em contacto connosco para agendar uma apresentação
          </p>
          <Button
            size="lg"
            className="bg-gold hover:bg-gold-dark text-navy font-semibold"
            asChild
          >
            <a href="/contacto">Fazer Convite</a>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Agenda;
